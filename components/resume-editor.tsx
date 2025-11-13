"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  X,
  Trash2,
  Bold,
  Italic,
  Underline,
  ArrowUp,
  ArrowDown,
  Settings2,
  List,
  ChevronLeft,
  ChevronRight,
  Type,
  Palette,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Font sizes for all inputs
const fontSizes = [
  { value: "8", label: "8px" },
  { value: "9", label: "9px" },
  { value: "10", label: "10px" },
  { value: "10.5", label: "10.5px" },
  { value: "11", label: "11px" },
  { value: "12", label: "12px" },
  { value: "13", label: "13px" },
  { value: "14", label: "14px" },
  { value: "16", label: "16px" },
  { value: "18", label: "18px" },
  { value: "20", label: "20px" },
  { value: "24", label: "24px" },
  { value: "28", label: "28px" },
];

// Bullet styles
const bulletStyles = [
  { value: "•", label: "• Bullet" },
  { value: "○", label: "○ Circle" },
  { value: "■", label: "■ Square" },
  { value: "▪", label: "▪ Small Square" },
  { value: "►", label: "► Arrow" },
  { value: "✓", label: "✓ Check" },
  { value: "→", label: "→ Right Arrow" },
  { value: "⋄", label: "⋄ Diamond" },
  { value: "-", label: "- Dash" },
];

// Text colors
const textColors = [
  { value: "#000000", label: "Black" },
  { value: "#1e3a8a", label: "Dark Blue" },
  { value: "#1e40af", label: "Blue" },
  { value: "#065f46", label: "Dark Green" },
  { value: "#059669", label: "Green" },
  { value: "#7c2d12", label: "Dark Red" },
  { value: "#dc2626", label: "Red" },
  { value: "#92400e", label: "Brown" },
  { value: "#4b5563", label: "Gray" },
  { value: "#6b21a8", label: "Purple" },
];

// Available sections
const availableSections = [
  { id: "experience", label: "Experience", icon: "💼" },
  { id: "projects", label: "Projects", icon: "🚀" },
  { id: "education", label: "Education", icon: "🎓" },
  { id: "skills", label: "Skills", icon: "⚡" },
  { id: "summary", label: "Summary", icon: "📝" },
];

export default function ResumeEditor({ resumeData, setResumeData }: any) {
  const [sectionOrder, setSectionOrder] = useState(
    resumeData.sectionOrder || ["personal", "summary", "skills", "experience", "projects", "education"]
  );
  const [activeTab, setActiveTab] = useState("personal");
  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement }>({});

  // Tab navigation
  const currentTabIndex = activeTab === "order" ? sectionOrder.length : sectionOrder.indexOf(activeTab);
  const totalTabs = sectionOrder.length + 1; // +1 for "order" tab
  const canNavigateLeft = currentTabIndex > 0;
  const canNavigateRight = currentTabIndex < totalTabs - 1;

  const navigateTabs = (direction: "left" | "right") => {
    if (direction === "left" && canNavigateLeft) {
      if (activeTab === "order") {
        setActiveTab(sectionOrder[sectionOrder.length - 1]);
      } else {
        const currentIndex = sectionOrder.indexOf(activeTab);
        setActiveTab(sectionOrder[currentIndex - 1]);
      }
    } else if (direction === "right" && canNavigateRight) {
      const currentIndex = sectionOrder.indexOf(activeTab);
      if (currentIndex === sectionOrder.length - 1) {
        setActiveTab("order");
      } else {
        setActiveTab(sectionOrder[currentIndex + 1]);
      }
    }
  };

  // Update section order
  const updateSectionOrder = (newOrder: string[]) => {
    setSectionOrder(newOrder);
    setResumeData({ ...resumeData, sectionOrder: newOrder });
  };

  // Formatting helpers
  const applyFormattingToSelection = (
    refKey: string,
    type: "bold" | "italic" | "underline" | "color",
    colorValue?: string
  ) => {
    const textarea = textareaRefs.current[refKey];
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    if (start === end) {
      alert("Please select text first to apply formatting!");
      return;
    }

    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);

    let formatted = "";
    if (type === "bold") {
      formatted = `${before}**${selected}**${after}`;
    } else if (type === "italic") {
      formatted = `${before}*${selected}*${after}`;
    } else if (type === "underline") {
      formatted = `${before}__${selected}__${after}`;
    } else if (type === "color" && colorValue) {
      formatted = `${before}<span style="color:${colorValue}">${selected}</span>${after}`;
    }

    return formatted;
  };

  // Section management
  const moveSection = (index: number, direction: "up" | "down") => {
    const newOrder = [...sectionOrder];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newOrder.length) return;
    [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
    updateSectionOrder(newOrder);
  };

  const deleteSection = (section: string) => {
    updateSectionOrder(sectionOrder.filter((s) => s !== section));
  };

  const addPredefinedSection = (sectionId: string) => {
    if (!sectionOrder.includes(sectionId)) {
      updateSectionOrder([...sectionOrder, sectionId]);
      
      // Initialize data if needed
      if (sectionId === "experience" && (!resumeData.experience || resumeData.experience.length === 0)) {
        setResumeData({
          ...resumeData,
          experience: [],
          sectionOrder: [...sectionOrder, sectionId],
        });
      } else if (sectionId === "projects" && (!resumeData.projects || resumeData.projects.length === 0)) {
        setResumeData({
          ...resumeData,
          projects: [],
          sectionOrder: [...sectionOrder, sectionId],
        });
      } else if (sectionId === "education" && (!resumeData.education || resumeData.education.length === 0)) {
        setResumeData({
          ...resumeData,
          education: [],
          sectionOrder: [...sectionOrder, sectionId],
        });
      } else if (sectionId === "skills" && !resumeData.skills) {
        setResumeData({
          ...resumeData,
          skills: {},
          sectionOrder: [...sectionOrder, sectionId],
        });
      } else if (sectionId === "summary" && !resumeData.summary) {
        setResumeData({
          ...resumeData,
          summary: "",
          sectionOrder: [...sectionOrder, sectionId],
        });
      }
    }
  };

  const addCustomSection = () => {
    const sectionName = prompt("Enter custom section name:");
    if (!sectionName) return;

    if (sectionOrder.includes(sectionName.toLowerCase())) {
      alert("Section already exists!");
      return;
    }

    const mode = confirm(
      "Click OK for Paragraph mode (like Summary)\nClick Cancel for Category mode (like Skills)"
    );

    const sectionKey = sectionName.toLowerCase();
    updateSectionOrder([...sectionOrder, sectionKey]);

    if (!mode) {
      // Category mode - initialize as object
      setResumeData({
        ...resumeData,
        [sectionKey]: {},
        sectionOrder: [...sectionOrder, sectionKey],
      });
    } else {
      // Paragraph mode - initialize as string
      setResumeData({
        ...resumeData,
        [sectionKey]: "",
        sectionOrder: [...sectionOrder, sectionKey],
      });
    }
  };

  // Personal info
  const updatePersonal = (field: string, value: string) => {
    setResumeData({
      ...resumeData,
      personal: { ...resumeData.personal, [field]: value },
    });
  };

  const updatePersonalFontSize = (field: string, size: string) => {
    setResumeData({
      ...resumeData,
      personalFontSizes: { ...resumeData.personalFontSizes, [field]: size },
    });
  };

  const addCustomPersonalField = () => {
    const fieldName = prompt("Enter field name (e.g., Portfolio, Twitter):");
    if (fieldName) {
      setResumeData({
        ...resumeData,
        personal: { ...resumeData.personal, [fieldName.toLowerCase()]: "" },
      });
    }
  };

  const deletePersonalField = (field: string) => {
    const { [field]: removed, ...rest } = resumeData.personal;
    setResumeData({ ...resumeData, personal: rest });
  };

  // Summary
  const updateSummary = (value: string) => {
    setResumeData({ ...resumeData, summary: value });
  };

  const applySummaryFormatting = (
    type: "bold" | "italic" | "underline" | "color",
    color?: string
  ) => {
    const formatted = applyFormattingToSelection("summary", type, color);
    if (formatted) updateSummary(formatted);
  };

  // Skills
  const addSkillCategory = () => {
    const categoryName = prompt("Enter skill category name:");
    if (categoryName) {
      setResumeData({
        ...resumeData,
        skills: { ...resumeData.skills, [categoryName]: [] },
      });
    }
  };

  const deleteSkillCategory = (category: string) => {
    const { [category]: removed, ...rest } = resumeData.skills;
    setResumeData({ ...resumeData, skills: rest });
  };

  const updateSkills = (category: string, value: string) => {
    setResumeData({
      ...resumeData,
      skills: {
        ...resumeData.skills,
        [category]: value.split(",").map((item) => item.trim()).filter(Boolean),
      },
    });
  };

  // Experience
  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...(resumeData.experience || []),
        {
          id: Date.now(),
          company: "",
          position: "",
          location: "",
          startDate: "",
          endDate: "",
          bullets: [""],
          bulletStyle: "•",
        },
      ],
    });
  };

  const updateExperience = (id: number, field: string, value: any) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp: any) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const updateExperienceFieldFontSize = (id: number, field: string, size: string) => {
    const key = `${id}-${field}`;
    setResumeData({
      ...resumeData,
      experienceFieldFontSizes: {
        ...resumeData.experienceFieldFontSizes,
        [key]: size,
      },
    });
  };

  const addBullet = (expId: number) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp: any) =>
        exp.id === expId ? { ...exp, bullets: [...exp.bullets, ""] } : exp
      ),
    });
  };

  const updateBullet = (expId: number, bulletIdx: number, value: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp: any) =>
        exp.id === expId
          ? {
              ...exp,
              bullets: exp.bullets.map((b: string, i: number) =>
                i === bulletIdx ? value : b
              ),
            }
          : exp
      ),
    });
  };

  const applyBulletFormatting = (
    expId: number,
    bulletIdx: number,
    type: "bold" | "italic" | "underline" | "color",
    color?: string
  ) => {
    const refKey = `bullet-${expId}-${bulletIdx}`;
    const formatted = applyFormattingToSelection(refKey, type, color);
    if (formatted) {
      const textarea = textareaRefs.current[refKey];
      if (textarea) {
        updateBullet(expId, bulletIdx, formatted);
        setTimeout(() => textarea.focus(), 0);
      }
    }
  };

  const deleteBullet = (expId: number, bulletIdx: number) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp: any) =>
        exp.id === expId
          ? {
              ...exp,
              bullets: exp.bullets.filter((_: any, i: number) => i !== bulletIdx),
            }
          : exp
      ),
    });
  };

  const deleteExperience = (id: number) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter((exp: any) => exp.id !== id),
    });
  };

  // Projects
  const addProject = () => {
    setResumeData({
      ...resumeData,
      projects: [
        ...(resumeData.projects || []),
        {
          id: Date.now(),
          title: "",
          type: "Personal",
          technologies: [],
          description: "",
          bullets: [],
          impact: "",
          link: "",
          bulletStyle: "•",
        },
      ],
    });
  };

  const updateProject = (id: number, field: string, value: any) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map((proj: any) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    });
  };

  const updateProjectFieldFontSize = (id: number, field: string, size: string) => {
    const key = `${id}-${field}`;
    setResumeData({
      ...resumeData,
      projectFieldFontSizes: {
        ...resumeData.projectFieldFontSizes,
        [key]: size,
      },
    });
  };

  const addProjectBullet = (projId: number) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map((proj: any) =>
        proj.id === projId
          ? { ...proj, bullets: [...(proj.bullets || []), ""] }
          : proj
      ),
    });
  };

  const updateProjectBullet = (projId: number, bulletIdx: number, value: string) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map((proj: any) =>
        proj.id === projId
          ? {
              ...proj,
              bullets: proj.bullets.map((b: string, i: number) =>
                i === bulletIdx ? value : b
              ),
            }
          : proj
      ),
    });
  };

  const applyProjectBulletFormatting = (
    projId: number,
    bulletIdx: number,
    type: "bold" | "italic" | "underline" | "color",
    color?: string
  ) => {
    const refKey = `proj-bullet-${projId}-${bulletIdx}`;
    const formatted = applyFormattingToSelection(refKey, type, color);
    if (formatted) {
      const textarea = textareaRefs.current[refKey];
      if (textarea) {
        updateProjectBullet(projId, bulletIdx, formatted);
        setTimeout(() => textarea.focus(), 0);
      }
    }
  };

  const deleteProjectBullet = (projId: number, bulletIdx: number) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map((proj: any) =>
        proj.id === projId
          ? {
              ...proj,
              bullets: proj.bullets.filter((_: any, i: number) => i !== bulletIdx),
            }
          : proj
      ),
    });
  };

  const deleteProject = (id: number) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.filter((proj: any) => proj.id !== id),
    });
  };

  // Education
  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...(resumeData.education || []),
        {
          id: Date.now(),
          school: "",
          degree: "",
          minor: "",
          location: "",
          graduationDate: "",
          gpa: "",
          honors: "",
          description: "",
        },
      ],
    });
  };

  const updateEducation = (id: number, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map((edu: any) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const updateEducationFieldFontSize = (id: number, field: string, size: string) => {
    const key = `${id}-${field}`;
    setResumeData({
      ...resumeData,
      educationFieldFontSizes: {
        ...resumeData.educationFieldFontSizes,
        [key]: size,
      },
    });
  };

  const deleteEducation = (id: number) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter((edu: any) => edu.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigateTabs("left")}
            disabled={!canNavigateLeft}
            className="text-white hover:bg-slate-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <TabsList className="flex-1 flex bg-slate-700 text-white h-auto overflow-x-auto">
            {sectionOrder.map((section) => (
              <TabsTrigger 
                key={section} 
                value={section} 
                className={`capitalize py-2 px-4 whitespace-nowrap ${activeTab === section ? 'bg-slate-600' : ''}`}
              >
                {section === "order" ? (
                  <>
                    <Settings2 className="w-4 h-4 mr-1" /> Manage
                  </>
                ) : (
                  section
                )}
              </TabsTrigger>
            ))}
            <TabsTrigger 
              value="order" 
              className={`py-2 px-4 whitespace-nowrap ${activeTab === "order" ? 'bg-slate-600' : ''}`}
            >
              <Settings2 className="w-4 h-4 mr-1" /> Manage
            </TabsTrigger>
          </TabsList>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigateTabs("right")}
            disabled={!canNavigateRight}
            className="text-white hover:bg-slate-700"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Personal Tab */}
        <TabsContent value="personal" className="space-y-4 mt-4">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Personal Info</h3>
              <Button
                onClick={addCustomPersonalField}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 gap-2"
              >
                <Plus className="w-4 h-4" /> Add Field
              </Button>
            </div>
            {Object.entries(resumeData.personal).map(([key, value]: any) => (
              <div key={key} className="mb-3">
                <label className="text-sm font-semibold text-gray-300 capitalize mb-1 block">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <div className="flex gap-2 items-center">
                  <Input
                    value={value}
                    onChange={(e) => updatePersonal(key, e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white flex-1"
                  />
                  <Select
                    onValueChange={(size) => updatePersonalFontSize(key, size)}
                    defaultValue={resumeData.personalFontSizes?.[key] || (key === "name" ? "28" : "10.5")}
                  >
                    <SelectTrigger className="w-20 bg-slate-700 border-slate-600 text-white">
                      <Type className="w-4 h-4" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 text-white">
                      {fontSizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!["name", "email", "phone"].includes(key) && (
                    <Button
                      onClick={() => deletePersonalField(key)}
                      size="icon"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </Card>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex justify-between mb-2 items-center">
              <label className="text-sm font-semibold text-gray-300">Professional Summary</label>
              <div className="flex gap-1">
                <Select onValueChange={(size) => setResumeData({ ...resumeData, summaryFontSize: size })} defaultValue="11">
                  <SelectTrigger className="w-20 bg-slate-700 border-slate-600 text-white">
                    <Type className="w-4 h-4" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white">
                    {fontSizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="icon" onClick={() => applySummaryFormatting("bold")} className="bg-slate-700 hover:bg-slate-600">
                  <Bold className="w-4 h-4" />
                </Button>
                <Button size="icon" onClick={() => applySummaryFormatting("italic")} className="bg-slate-700 hover:bg-slate-600">
                  <Italic className="w-4 h-4" />
                </Button>
                <Button size="icon" onClick={() => applySummaryFormatting("underline")} className="bg-slate-700 hover:bg-slate-600">
                  <Underline className="w-4 h-4" />
                </Button>
                <Select onValueChange={(color) => applySummaryFormatting("color", color)}>
                  <SelectTrigger className="w-10 h-10 bg-slate-700 hover:bg-slate-600 border-slate-600">
                    <Palette className="w-4 h-4" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white">
                    {textColors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: color.value }} />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Textarea
              ref={(el) => {
                if (el) textareaRefs.current["summary"] = el;
              }}
              value={resumeData.summary}
              onChange={(e) => updateSummary(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white mt-2 min-h-32"
            />
            <p className="text-xs text-gray-400 mt-2">Tip: Select text and use formatting buttons</p>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-4 mt-4">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Skills</h3>
              <div className="flex gap-2">
                <Select onValueChange={(size) => setResumeData({ ...resumeData, skillsFontSize: size })} defaultValue="11">
                  <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                    <Type className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white">
                    {fontSizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addSkillCategory} size="sm" className="bg-blue-600 hover:bg-blue-700 gap-2">
                  <Plus className="w-4 h-4" /> Add Category
                </Button>
              </div>
            </div>
            {Object.entries(resumeData.skills || {}).map(([category, skills]: any) => (
              <div key={category} className="mb-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-300 capitalize">{category}</label>
                  <Button onClick={() => deleteSkillCategory(category)} size="icon" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={skills.join(", ")}
                  onChange={(e) => updateSkills(category, e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                  placeholder="Separate with commas"
                />
              </div>
            ))}
          </Card>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience" className="space-y-4 mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-white">Experience</h3>
            <Select onValueChange={(size) => setResumeData({ ...resumeData, experienceFontSize: size })} defaultValue="11">
              <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                <Type className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 text-white">
                {fontSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(resumeData.experience || []).map((exp: any, idx: number) => (
            <Card key={exp.id} className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white">Experience {idx + 1}</h3>
                <div className="flex gap-2">
                  <Select
                    value={exp.bulletStyle || "•"}
                    onValueChange={(val) => updateExperience(exp.id, "bulletStyle", val)}
                  >
                    <SelectTrigger className="w-36 bg-slate-700 border-slate-600 text-white">
                      <List className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 text-white">
                      {bulletStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => deleteExperience(exp.id)} size="icon" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Job Title"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white flex-1"
                  />
                  <Select
                    onValueChange={(size) => updateExperienceFieldFontSize(exp.id, "position", size)}
                    defaultValue="11"
                  >
                    <SelectTrigger className="w-20 bg-slate-700 border-slate-600 text-white">
                      <Type className="w-4 h-4" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 text-white">
                      {fontSizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white flex-1"
                  />
                  <Select
                    onValueChange={(size) => updateExperienceFieldFontSize(exp.id, "company", size)}
                    defaultValue="11"
                  >
                    <SelectTrigger className="w-20 bg-slate-700 border-slate-600 text-white">
                      <Type className="w-4 h-4" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 text-white">
                      {fontSizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Location"
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white flex-1"
                  />
                  <Select
                    onValueChange={(size) => updateExperienceFieldFontSize(exp.id, "location", size)}
                    defaultValue="11"
                  >
                    <SelectTrigger className="w-20 bg-slate-700 border-slate-600 text-white">
                      <Type className="w-4 h-4" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 text-white">
                      {fontSizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Start Date"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white flex-1"
                    />
                    <Select
                      onValueChange={(size) => updateExperienceFieldFontSize(exp.id, "startDate", size)}
                      defaultValue="11"
                    >
                      <SelectTrigger className="w-16 bg-slate-700 border-slate-600 text-white">
                        <Type className="w-4 h-4" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 text-white">
                        {fontSizes.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="End Date"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white flex-1"
                    />
                    <Select
                      onValueChange={(size) => updateExperienceFieldFontSize(exp.id, "endDate", size)}
                      defaultValue="11"
                    >
                      <SelectTrigger className="w-16 bg-slate-700 border-slate-600 text-white">
                        <Type className="w-4 h-4" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 text-white">
                        {fontSizes.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {exp.bullets.map((bullet: string, bIdx: number) => (
                  <div key={bIdx} className="mb-2">
                    <div className="flex gap-1 mb-1 items-center">
                      <Button size="icon" onClick={() => applyBulletFormatting(exp.id, bIdx, "bold")} className="bg-slate-700 hover:bg-slate-600 h-8 w-8">
                        <Bold className="w-3 h-3" />
                      </Button>
                      <Button size="icon" onClick={() => applyBulletFormatting(exp.id, bIdx, "italic")} className="bg-slate-700 hover:bg-slate-600 h-8 w-8">
                        <Italic className="w-3 h-3" />
                      </Button>
                      <Button size="icon" onClick={() => applyBulletFormatting(exp.id, bIdx, "underline")} className="bg-slate-700 hover:bg-slate-600 h-8 w-8">
                        <Underline className="w-3 h-3" />
                      </Button>
                      <Select onValueChange={(color) => applyBulletFormatting(exp.id, bIdx, "color", color)}>
                        <SelectTrigger className="w-8 h-8 bg-slate-700 hover:bg-slate-600 border-slate-600 p-0">
                          <Palette className="w-3 h-3 mx-auto" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 text-white">
                          {textColors.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: color.value }} />
                                {color.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button size="icon" variant="ghost" onClick={() => deleteBullet(exp.id, bIdx)} className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8 w-8 ml-auto">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      ref={(el) => {
                        if (el) textareaRefs.current[`bullet-${exp.id}-${bIdx}`] = el;
                      }}
                      value={bullet}
                      onChange={(e) => updateBullet(exp.id, bIdx, e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Describe your responsibility..."
                    />
                  </div>
                ))}
                <Button onClick={() => addBullet(exp.id)} size="sm" className="bg-blue-600 hover:bg-blue-700 w-full mt-2">
                  <Plus className="w-4 h-4" /> Add Bullet
                </Button>
              </div>
            </Card>
          ))}
          <Button onClick={addExperience} className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus className="w-4 h-4" /> Add Experience
          </Button>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4 mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-white">Projects</h3>
            <Select onValueChange={(size) => setResumeData({ ...resumeData, projectsFontSize: size })} defaultValue="11">
              <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                <Type className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 text-white">
                {fontSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(resumeData.projects || []).map((proj: any, idx: number) => (
            <Card key={proj.id} className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold">Project {idx + 1}</h3>
                <div className="flex gap-2">
                  <Select
                    value={proj.bulletStyle || "•"}
                    onValueChange={(val) => updateProject(proj.id, "bulletStyle", val)}
                  >
                    <SelectTrigger className="w-36 bg-slate-700 border-slate-600 text-white">
                      <List className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 text-white">
                      {bulletStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => deleteProject(proj.id)} size="icon" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Project Title"
                    value={proj.title}
                    onChange={(e) => updateProject(proj.id, "title", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white flex-1"
                  />
                  <Select
                    onValueChange={(size) => updateProjectFieldFontSize(proj.id, "title", size)}
                    defaultValue="11"
                  >
                    <SelectTrigger className="w-20 bg-slate-700 border-slate-600 text-white">
                      <Type className="w-4 h-4" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 text-white">
                      {fontSizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Input
                  placeholder="Technologies (comma separated)"
                  value={proj.technologies?.join(", ") || ""}
                  onChange={(e) => updateProject(proj.id, "technologies", e.target.value.split(",").map((t: string) => t.trim()).filter(Boolean))}
                  className="bg-slate-700 border-slate-600 text-white"
                />

                <Select
                  value={proj.type}
                  onValueChange={(val) => updateProject(proj.id, "type", val)}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Project Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white">
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Open Source">Open Source</SelectItem>
                  </SelectContent>
                </Select>

                <Textarea
                  placeholder="Description"
                  value={proj.description}
                  onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />

                <Textarea
                  placeholder="Impact / Results"
                  value={proj.impact}
                  onChange={(e) => updateProject(proj.id, "impact", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />

                <Input
                  placeholder="Project Link"
                  value={proj.link}
                  onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />

                {proj.bullets && proj.bullets.map((bullet: string, bIdx: number) => (
                  <div key={bIdx} className="mb-2">
                    <div className="flex gap-1 mb-1 items-center">
                      <Button size="icon" onClick={() => applyProjectBulletFormatting(proj.id, bIdx, "bold")} className="bg-slate-700 hover:bg-slate-600 h-8 w-8">
                        <Bold className="w-3 h-3" />
                      </Button>
                      <Button size="icon" onClick={() => applyProjectBulletFormatting(proj.id, bIdx, "italic")} className="bg-slate-700 hover:bg-slate-600 h-8 w-8">
                        <Italic className="w-3 h-3" />
                      </Button>
                      <Button size="icon" onClick={() => applyProjectBulletFormatting(proj.id, bIdx, "underline")} className="bg-slate-700 hover:bg-slate-600 h-8 w-8">
                        <Underline className="w-3 h-3" />
                      </Button>
                      <Select onValueChange={(color) => applyProjectBulletFormatting(proj.id, bIdx, "color", color)}>
                        <SelectTrigger className="w-8 h-8 bg-slate-700 hover:bg-slate-600 border-slate-600 p-0">
                          <Palette className="w-3 h-3 mx-auto" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 text-white">
                          {textColors.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: color.value }} />
                                {color.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button size="icon" variant="ghost" onClick={() => deleteProjectBullet(proj.id, bIdx)} className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8 w-8 ml-auto">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      ref={(el) => {
                        if (el) textareaRefs.current[`proj-bullet-${proj.id}-${bIdx}`] = el;
                      }}
                      value={bullet}
                      onChange={(e) => updateProjectBullet(proj.id, bIdx, e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Describe project highlight..."
                    />
                  </div>
                ))}
                <Button onClick={() => addProjectBullet(proj.id)} size="sm" className="bg-blue-600 hover:bg-blue-700 w-full mt-2">
                  <Plus className="w-4 h-4" /> Add Bullet Point
                </Button>
              </div>
            </Card>
          ))}
          <Button onClick={addProject} className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus className="w-4 h-4" /> Add Project
          </Button>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-4 mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-white">Education</h3>
            <Select onValueChange={(size) => setResumeData({ ...resumeData, educationFontSize: size })} defaultValue="11">
              <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                <Type className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 text-white">
                {fontSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(resumeData.education || []).map((edu: any, idx: number) => (
            <Card key={edu.id} className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold">Education {idx + 1}</h3>
                <Button onClick={() => deleteEducation(edu.id)} size="icon" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="University / Institution"
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white flex-1"
                  />
                  <Select
                    onValueChange={(size) => updateEducationFieldFontSize(edu.id, "school", size)}
                    defaultValue="11"
                  >
                    <SelectTrigger className="w-20 bg-slate-700 border-slate-600 text-white">
                      <Type className="w-4 h-4" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 text-white">
                      {fontSizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white flex-1"
                  />
                  <Select
                    onValueChange={(size) => updateEducationFieldFontSize(edu.id, "degree", size)}
                    defaultValue="11"
                  >
                    <SelectTrigger className="w-20 bg-slate-700 border-slate-600 text-white">
                      <Type className="w-4 h-4" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 text-white">
                      {fontSizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Input
                  placeholder="Minor / Specialization"
                  value={edu.minor}
                  onChange={(e) => updateEducation(edu.id, "minor", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />

                <Input
                  placeholder="Location"
                  value={edu.location}
                  onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />

                <div className="flex gap-2">
                  <Input
                    placeholder="Graduation Date"
                    value={edu.graduationDate}
                    onChange={(e) => updateEducation(edu.id, "graduationDate", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white flex-1"
                  />
                  <Select
                    onValueChange={(size) => updateEducationFieldFontSize(edu.id, "graduationDate", size)}
                    defaultValue="11"
                  >
                    <SelectTrigger className="w-20 bg-slate-700 border-slate-600 text-white">
                      <Type className="w-4 h-4" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 text-white">
                      {fontSizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Input
                  placeholder="GPA"
                  value={edu.gpa}
                  onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />

                <Textarea
                  placeholder="Honors / Awards"
                  value={edu.honors}
                  onChange={(e) => updateEducation(edu.id, "honors", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />

                <Textarea
                  placeholder="Clubs / Research / Highlights"
                  value={edu.description}
                  onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </Card>
          ))}
          <Button onClick={addEducation} className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus className="w-4 h-4" /> Add Education
          </Button>
        </TabsContent>

        {/* Manage Tab */}
        <TabsContent value="order" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Section Manager</h3>
              <Button
                onClick={addCustomSection}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                <Plus className="w-4 h-4" /> Custom Section
              </Button>
            </div>

            {/* Current Sections */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-300 mb-3">Current Sections</h4>
              {sectionOrder.map((section, idx) => (
                <div key={section} className="flex justify-between items-center bg-slate-700/50 p-3 rounded-md mb-2">
                  <span className="capitalize text-gray-200">{section}</span>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => moveSection(idx, "up")} className="bg-gray-600 hover:bg-gray-500" disabled={idx === 0}>
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={() => moveSection(idx, "down")} className="bg-gray-600 hover:bg-gray-500" disabled={idx === sectionOrder.length - 1}>
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    {section !== "personal" && (
                      <Button size="sm" onClick={() => deleteSection(section)} className="bg-red-600 hover:bg-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Back Sections */}
            <div>
              <h4 className="text-md font-semibold text-gray-300 mb-3">Add Sections Back</h4>
              <div className="grid grid-cols-2 gap-2">
                {availableSections
                  .filter((section) => !sectionOrder.includes(section.id))
                  .map((section) => (
                    <Button key={section.id} onClick={() => addPredefinedSection(section.id)} className="bg-green-600 hover:bg-green-700 text-white gap-2 justify-start">
                      <span>{section.icon}</span>
                      <span>{section.label}</span>
                    </Button>
                  ))}
              </div>
              {availableSections.filter((section) => !sectionOrder.includes(section.id)).length === 0 && (
                <p className="text-gray-400 text-sm">All standard sections are already added</p>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}