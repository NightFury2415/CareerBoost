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
  GripVertical,
  Briefcase,
  GraduationCap,
  Palette,
  List,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ResumeEditor({ resumeData, setResumeData }: any) {
  const [sectionOrder, setSectionOrder] = useState(
    resumeData.sectionOrder || [
      "personal",
      "summary",
      "skills",
      "experience",
      "projects",
      "education",
    ]
  );

  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement }>({});

  // Available sections that can be added back
  const availableSections = [
    { id: "experience", label: "Experience", icon: "💼" },
    { id: "projects", label: "Projects", icon: "🚀" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "skills", label: "Skills", icon: "⚡" },
    { id: "summary", label: "Summary", icon: "📝" },
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

  // Update section order in resume data whenever it changes
  const updateSectionOrder = (newOrder: string[]) => {
    setSectionOrder(newOrder);
    setResumeData({ ...resumeData, sectionOrder: newOrder });
  };

  // ===== Formatting with selection support =====
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
      formatted = `${before}[color:${colorValue}]${selected}[/color]${after}`;
    }

    return formatted;
  };

  // ===== Section Order / Management =====
  const moveSection = (index: number, direction: "up" | "down") => {
    const newOrder = [...sectionOrder];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newOrder.length) return;
    [newOrder[index], newOrder[newIndex]] = [
      newOrder[newIndex],
      newOrder[index],
    ];
    updateSectionOrder(newOrder);
  };

  const deleteSection = (section: string) => {
    updateSectionOrder(sectionOrder.filter((s) => s !== section));
  };

  const addPredefinedSection = (sectionId: string) => {
    if (!sectionOrder.includes(sectionId)) {
      updateSectionOrder([...sectionOrder, sectionId]);

      // Initialize data if needed
      if (
        sectionId === "experience" &&
        (!resumeData.experience || resumeData.experience.length === 0)
      ) {
        setResumeData({
          ...resumeData,
          experience: [],
          sectionOrder: [...sectionOrder, sectionId],
        });
      } else if (
        sectionId === "projects" &&
        (!resumeData.projects || resumeData.projects.length === 0)
      ) {
        setResumeData({
          ...resumeData,
          projects: [],
          sectionOrder: [...sectionOrder, sectionId],
        });
      } else if (
        sectionId === "education" &&
        (!resumeData.education || resumeData.education.length === 0)
      ) {
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
    if (sectionName && !sectionOrder.includes(sectionName.toLowerCase())) {
      updateSectionOrder([...sectionOrder, sectionName.toLowerCase()]);
      setResumeData({
        ...resumeData,
        [sectionName.toLowerCase()]: "",
        sectionOrder: [...sectionOrder, sectionName.toLowerCase()],
      });
    }
  };

  // ===== Personal =====
  const updatePersonal = (field: string, value: string) => {
    setResumeData({
      ...resumeData,
      personal: { ...resumeData.personal, [field]: value },
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

  // ===== Summary =====
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

  // ===== Skills =====
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
        [category]: value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      },
    });
  };

  // ===== Experience =====
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
        // Restore cursor position
        setTimeout(() => {
          textarea.focus();
        }, 0);
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
              bullets: exp.bullets.filter(
                (_: any, i: number) => i !== bulletIdx
              ),
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

  // ===== Projects =====
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
          impact: "",
          link: "",
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

  const deleteProject = (id: number) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.filter((proj: any) => proj.id !== id),
    });
  };

  const deleteProjectField = (projId: number, field: string) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map((proj: any) => {
        if (proj.id === projId) {
          const { [field]: removed, ...rest } = proj;
          return rest;
        }
        return proj;
      }),
    });
  };

  // ===== Education =====
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

  const deleteEducation = (id: number) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter((edu: any) => edu.id !== id),
    });
  };

  const deleteEducationField = (eduId: number, field: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map((edu: any) => {
        if (edu.id === eduId) {
          const { [field]: removed, ...rest } = edu;
          return rest;
        }
        return edu;
      }),
    });
  };

  // ===== Custom Sections =====
  const updateCustomSection = (section: string, value: string) => {
    setResumeData({ ...resumeData, [section]: value });
  };

  // ===== MAIN UI =====
  return (
    <div className="space-y-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-slate-800 text-white">
          {sectionOrder.slice(0, 6).map((section) => (
            <TabsTrigger key={section} value={section}>
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </TabsTrigger>
          ))}
          <TabsTrigger value="order">
            <Settings2 className="w-4 h-4 mr-1" /> Manage
          </TabsTrigger>
        </TabsList>

        {/* Manage Section Order */}
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
              <h4 className="text-md font-semibold text-gray-300 mb-3">
                Current Sections
              </h4>
              {sectionOrder.map((section, idx) => (
                <div
                  key={section}
                  className="flex justify-between items-center bg-slate-700/50 p-3 rounded-md mb-2"
                >
                  <span className="capitalize text-gray-200">{section}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => moveSection(idx, "up")}
                      className="bg-gray-600 hover:bg-gray-500"
                      disabled={idx === 0}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => moveSection(idx, "down")}
                      className="bg-gray-600 hover:bg-gray-500"
                      disabled={idx === sectionOrder.length - 1}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    {section !== "personal" && (
                      <Button
                        size="sm"
                        onClick={() => deleteSection(section)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Back Sections */}
            <div>
              <h4 className="text-md font-semibold text-gray-300 mb-3">
                Add Sections Back
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {availableSections
                  .filter((section) => !sectionOrder.includes(section.id))
                  .map((section) => (
                    <Button
                      key={section.id}
                      onClick={() => addPredefinedSection(section.id)}
                      className="bg-green-600 hover:bg-green-700 text-white gap-2 justify-start"
                    >
                      <span>{section.icon}</span>
                      <span>{section.label}</span>
                    </Button>
                  ))}
              </div>
              {availableSections.filter(
                (section) => !sectionOrder.includes(section.id)
              ).length === 0 && (
                <p className="text-gray-400 text-sm">
                  All standard sections are already added
                </p>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* PERSONAL */}
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
                <label className="text-sm font-semibold text-gray-300 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <div className="flex gap-2 items-center mt-1">
                  <Input
                    value={value}
                    onChange={(e) => updatePersonal(key, e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
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

        {/* SUMMARY */}
        <TabsContent value="summary" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-300">
                Professional Summary
              </label>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  onClick={() => applySummaryFormatting("bold")}
                  className="bg-slate-700 hover:bg-slate-600 text-white"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={() => applySummaryFormatting("italic")}
                  className="bg-slate-700 hover:bg-slate-600 text-white"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={() => applySummaryFormatting("underline")}
                  className="bg-slate-700 hover:bg-slate-600 text-white"
                  title="Underline"
                >
                  <Underline className="w-4 h-4" />
                </Button>
                <Select
                  onValueChange={(color) =>
                    applySummaryFormatting("color", color)
                  }
                >
                  <SelectTrigger className="w-10 h-10 bg-slate-700 hover:bg-slate-600 border-slate-600">
                    <Palette className="w-4 h-4" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white">
                    {textColors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: color.value }}
                          />
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
            <p className="text-xs text-gray-400 mt-2">
              Tip: Select text and use formatting buttons above
            </p>
          </Card>
        </TabsContent>

        {/* SKILLS */}
        <TabsContent value="skills" className="space-y-4 mt-4">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Skills</h3>
              <Button
                onClick={addSkillCategory}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 gap-2"
              >
                <Plus className="w-4 h-4" /> Add Category
              </Button>
            </div>
            {Object.entries(resumeData.skills || {}).map(
              ([category, skills]: any) => (
                <div key={category} className="mb-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-gray-300 capitalize">
                      {category}
                    </label>
                    <Button
                      onClick={() => deleteSkillCategory(category)}
                      size="icon"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
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
              )
            )}
          </Card>
        </TabsContent>

        {/* EXPERIENCE */}
        <TabsContent value="experience" className="space-y-4 mt-4">
          {(resumeData.experience || []).map((exp: any, idx: number) => (
            <Card key={exp.id} className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-5 h-5 text-gray-500" />
                  <h3 className="font-bold text-white">Experience {idx + 1}</h3>
                </div>
                <div className="flex gap-2 items-center">
                  <Select
                    value={exp.bulletStyle || "•"}
                    onValueChange={(val) =>
                      updateExperience(exp.id, "bulletStyle", val)
                    }
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
                  <Button
                    onClick={() => deleteExperience(exp.id)}
                    size="icon"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Input
                placeholder="Job Title"
                value={exp.position}
                onChange={(e) =>
                  updateExperience(exp.id, "position", e.target.value)
                }
                className="bg-slate-700 border-slate-600 text-white mb-2"
              />
              <Input
                placeholder="Company"
                value={exp.company}
                onChange={(e) =>
                  updateExperience(exp.id, "company", e.target.value)
                }
                className="bg-slate-700 border-slate-600 text-white mb-2"
              />
              <Input
                placeholder="Location"
                value={exp.location}
                onChange={(e) =>
                  updateExperience(exp.id, "location", e.target.value)
                }
                className="bg-slate-700 border-slate-600 text-white mb-2"
              />
              <div className="grid grid-cols-2 gap-3 mb-2">
                <Input
                  placeholder="Start Date"
                  value={exp.startDate}
                  onChange={(e) =>
                    updateExperience(exp.id, "startDate", e.target.value)
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Input
                  placeholder="End Date or 'Present'"
                  value={exp.endDate}
                  onChange={(e) =>
                    updateExperience(exp.id, "endDate", e.target.value)
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              {exp.bullets.map((bullet: string, bIdx: number) => (
                <div key={bIdx} className="mb-2">
                  <div className="flex gap-1 mb-1 items-center">
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        onClick={() =>
                          applyBulletFormatting(exp.id, bIdx, "bold")
                        }
                        className="bg-slate-700 hover:bg-slate-600 text-white h-8 w-8"
                        title="Bold"
                      >
                        <Bold className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        onClick={() =>
                          applyBulletFormatting(exp.id, bIdx, "italic")
                        }
                        className="bg-slate-700 hover:bg-slate-600 text-white h-8 w-8"
                        title="Italic"
                      >
                        <Italic className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        onClick={() =>
                          applyBulletFormatting(exp.id, bIdx, "underline")
                        }
                        className="bg-slate-700 hover:bg-slate-600 text-white h-8 w-8"
                        title="Underline"
                      >
                        <Underline className="w-3 h-3" />
                      </Button>
                      <Select
                        onValueChange={(color) =>
                          applyBulletFormatting(exp.id, bIdx, "color", color)
                        }
                      >
                        <SelectTrigger className="w-8 h-8 bg-slate-700 hover:bg-slate-600 border-slate-600 p-0">
                          <Palette className="w-3 h-3 mx-auto" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 text-white">
                          {textColors.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded"
                                  style={{ backgroundColor: color.value }}
                                />
                                {color.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteBullet(exp.id, bIdx)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8 w-8 ml-auto"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <Textarea
                    ref={(el) => {
                      if (el)
                        textareaRefs.current[`bullet-${exp.id}-${bIdx}`] = el;
                    }}
                    value={bullet}
                    onChange={(e) => updateBullet(exp.id, bIdx, e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Describe your responsibility or impact... Select text to format"
                  />
                </div>
              ))}
              <Button
                onClick={() => addBullet(exp.id)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 w-full mt-2"
              >
                <Plus className="w-4 h-4" /> Add Bullet
              </Button>
            </Card>
          ))}
          <Button
            onClick={addExperience}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Plus className="w-4 h-4" /> Add Experience
          </Button>
        </TabsContent>

        {/* PROJECTS */}
        <TabsContent value="projects" className="space-y-4 mt-4">
          {(resumeData.projects || []).map((proj: any, idx: number) => (
            <Card
              key={proj.id}
              className="bg-slate-800/50 border-slate-700 p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="text-blue-400" />
                  <h3 className="text-white font-bold">Project {idx + 1}</h3>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      const fieldName = prompt(
                        "Enter new custom field name for this project:"
                      );
                      if (fieldName)
                        updateProject(proj.id, fieldName.toLowerCase(), "");
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="w-4 h-4" /> Add Field
                  </Button>
                  <Button
                    onClick={() => deleteProject(proj.id)}
                    size="icon"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {[
                { key: "title", label: "Project Title", type: "input" },
                { key: "type", label: "Project Type", type: "select" },
                { key: "description", label: "Description", type: "textarea" },
                { key: "impact", label: "Impact / Results", type: "textarea" },
                { key: "technologies", label: "Technologies", type: "input" },
                { key: "link", label: "Project Link", type: "input" },
              ]
                .filter((field) => proj.hasOwnProperty(field.key))
                .map((field) => (
                  <div key={field.key} className="relative mb-3">
                    {field.type === "input" && (
                      <Input
                        placeholder={field.label}
                        value={
                          field.key === "technologies"
                            ? proj[field.key].join(", ")
                            : proj[field.key]
                        }
                        onChange={(e) =>
                          field.key === "technologies"
                            ? updateProject(
                                proj.id,
                                "technologies",
                                e.target.value
                                  .split(",")
                                  .map((t) => t.trim())
                                  .filter(Boolean)
                              )
                            : updateProject(proj.id, field.key, e.target.value)
                        }
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    )}
                    {field.type === "textarea" && (
                      <Textarea
                        placeholder={field.label}
                        value={proj[field.key]}
                        onChange={(e) =>
                          updateProject(proj.id, field.key, e.target.value)
                        }
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    )}
                    {field.type === "select" && (
                      <Select
                        value={proj[field.key]}
                        onValueChange={(val) =>
                          updateProject(proj.id, field.key, val)
                        }
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder={field.label} />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 text-white">
                          <SelectItem value="Personal">Personal</SelectItem>
                          <SelectItem value="Academic">Academic</SelectItem>
                          <SelectItem value="Professional">
                            Professional
                          </SelectItem>
                          <SelectItem value="Open Source">
                            Open Source
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    {!["id", "title"].includes(field.key) && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteProjectField(proj.id, field.key)}
                        className="absolute right-1 top-1 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}

              {/* Custom Fields */}
              {Object.entries(proj)
                .filter(
                  ([key]) =>
                    ![
                      "id",
                      "title",
                      "type",
                      "description",
                      "impact",
                      "technologies",
                      "link",
                    ].includes(key)
                )
                .map(([key, val]) => (
                  <div key={key} className="relative mb-2">
                    <Input
                      placeholder={key}
                      value={val as string}
                      onChange={(e) =>
                        updateProject(proj.id, key, e.target.value)
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteProjectField(proj.id, key)}
                      className="absolute right-1 top-1 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
            </Card>
          ))}
          <Button
            onClick={addProject}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Plus className="w-4 h-4" /> Add Project
          </Button>
        </TabsContent>

        {/* EDUCATION */}
        <TabsContent value="education" className="space-y-4 mt-4">
          {(resumeData.education || []).map((edu: any, idx: number) => (
            <Card key={edu.id} className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="text-blue-400" />
                  <h3 className="text-white font-bold">Education {idx + 1}</h3>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      const newField = prompt(
                        "Enter a new custom field name for this education:"
                      );
                      if (newField)
                        updateEducation(edu.id, newField.toLowerCase(), "");
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="w-4 h-4" /> Add Field
                  </Button>
                  <Button
                    onClick={() => deleteEducation(edu.id)}
                    size="icon"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {[
                { key: "school", label: "University / Institution" },
                { key: "degree", label: "Degree" },
                { key: "minor", label: "Minor / Specialization" },
                { key: "location", label: "Location" },
                { key: "graduationDate", label: "Graduation Date" },
                { key: "gpa", label: "GPA" },
                { key: "honors", label: "Honors / Awards" },
                { key: "description", label: "Clubs / Research / Highlights" },
              ]
                .filter((f) => edu.hasOwnProperty(f.key))
                .map((field) => (
                  <div key={field.key} className="relative mb-3">
                    {field.key === "description" || field.key === "honors" ? (
                      <Textarea
                        placeholder={field.label}
                        value={edu[field.key]}
                        onChange={(e) =>
                          updateEducation(edu.id, field.key, e.target.value)
                        }
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    ) : (
                      <Input
                        placeholder={field.label}
                        value={edu[field.key]}
                        onChange={(e) =>
                          updateEducation(edu.id, field.key, e.target.value)
                        }
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    )}
                    {!["id", "school", "degree"].includes(field.key) && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteEducationField(edu.id, field.key)}
                        className="absolute right-1 top-1 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}

              {/* Custom Fields */}
              {Object.entries(edu)
                .filter(
                  ([key]) =>
                    ![
                      "id",
                      "school",
                      "degree",
                      "minor",
                      "location",
                      "graduationDate",
                      "gpa",
                      "honors",
                      "description",
                    ].includes(key)
                )
                .map(([key, val]) => (
                  <div key={key} className="relative mb-2">
                    <Input
                      placeholder={key}
                      value={val as string}
                      onChange={(e) =>
                        updateEducation(edu.id, key, e.target.value)
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteEducationField(edu.id, key)}
                      className="absolute right-1 top-1 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
            </Card>
          ))}
          <Button
            onClick={addEducation}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Plus className="w-4 h-4" /> Add Education
          </Button>
        </TabsContent>

        {/* Custom Sections */}
        {sectionOrder
          .filter(
            (section) =>
              ![
                "personal",
                "summary",
                "skills",
                "experience",
                "projects",
                "education",
              ].includes(section)
          )
          .map((section) => (
            <TabsContent key={section} value={section} className="mt-4">
              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h3 className="text-lg font-bold text-white mb-4 capitalize">
                  {section}
                </h3>
                <Textarea
                  value={resumeData[section] || ""}
                  onChange={(e) => updateCustomSection(section, e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white min-h-32"
                  placeholder={`Enter content for ${section} section...`}
                />
              </Card>
            </TabsContent>
          ))}
      </Tabs>
    </div>
  );
}
