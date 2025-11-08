"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  X,
  Trash2,
  GripVertical,
  Bold,
  Italic,
  Underline,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function ResumeEditor({ resumeData, setResumeData }: any) {
  const [sectionOrder, setSectionOrder] = useState([
    "personal",
    "summary",
    "skills",
    "experience",
    "projects",
    "education",
  ]);

  // Helper for formatting
  const applyFormatting = (
    text: string,
    type: "bold" | "italic" | "underline"
  ) => {
    const wrapper = { bold: "**", italic: "*", underline: "__" }[type];
    return `${wrapper}${text}${wrapper}`;
  };

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

  const updateSummary = (value: string) => {
    setResumeData({ ...resumeData, summary: value });
  };

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
        [category]: value.split(",").map((item) => item.trim()),
      },
    });
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        {
          id: Date.now(),
          company: "",
          position: "",
          location: "",
          startDate: "",
          endDate: "",
          bullets: [""],
          bulletStyle: "disc",
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

  const addProject = () => {
    setResumeData({
      ...resumeData,
      projects: [
        ...resumeData.projects,
        {
          id: Date.now(),
          title: "",
          technologies: [],
          description: "",
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

  const addEducation = () => {
    if (!resumeData.education) {
      setResumeData({ ...resumeData, education: [] });
    }
    setResumeData({
      ...resumeData,
      education: [
        ...(resumeData.education || []),
        {
          id: Date.now(),
          school: "",
          degree: "",
          graduationDate: "",
          gpa: "",
          location: "",
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

  const moveSection = (index: number, direction: "up" | "down") => {
    const newOrder = [...sectionOrder];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newOrder.length) return;
    [newOrder[index], newOrder[newIndex]] = [
      newOrder[newIndex],
      newOrder[index],
    ];
    setSectionOrder(newOrder);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-slate-800 text-white">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="order">Order</TabsTrigger>
        </TabsList>

        {/* === Customize Order === */}
        <TabsContent value="order" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Section Display Order
            </h3>
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
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => moveSection(idx, "down")}
                    className="bg-gray-600 hover:bg-gray-500"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </Card>
        </TabsContent>

        {/* === Personal === */}
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

        {/* === Summary === */}
        <TabsContent value="summary" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-300">
                Professional Summary
              </label>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  onClick={() =>
                    updateSummary(applyFormatting(resumeData.summary, "bold"))
                  }
                  className="bg-slate-700 hover:bg-slate-600 text-white"
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={() =>
                    updateSummary(applyFormatting(resumeData.summary, "italic"))
                  }
                  className="bg-slate-700 hover:bg-slate-600 text-white"
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={() =>
                    updateSummary(
                      applyFormatting(resumeData.summary, "underline")
                    )
                  }
                  className="bg-slate-700 hover:bg-slate-600 text-white"
                >
                  <Underline className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Textarea
              value={resumeData.summary}
              onChange={(e) => updateSummary(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white mt-2 min-h-32"
            />
          </Card>
        </TabsContent>

        {/* === Skills === */}
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
            {Object.entries(resumeData.skills).map(
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

        {/* === Experience === */}
        <TabsContent value="experience" className="space-y-4 mt-4">
          {resumeData.experience.map((exp: any, idx: number) => (
            <Card key={exp.id} className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-5 h-5 text-gray-500" />
                  <h3 className="font-bold text-white">Experience {idx + 1}</h3>
                </div>
                <Button
                  onClick={() => deleteExperience(exp.id)}
                  size="icon"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
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

              <div className="grid grid-cols-2 gap-3">
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

              <div className="mt-4">
                {exp.bullets.map((bullet: string, bIdx: number) => (
                  <div key={bIdx} className="mb-2">
                    <div className="flex gap-1 mb-1">
                      <Button
                        size="icon"
                        onClick={() =>
                          updateBullet(
                            exp.id,
                            bIdx,
                            applyFormatting(bullet, "bold")
                          )
                        }
                        className="bg-slate-700 hover:bg-slate-600 text-white"
                      >
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        onClick={() =>
                          updateBullet(
                            exp.id,
                            bIdx,
                            applyFormatting(bullet, "italic")
                          )
                        }
                        className="bg-slate-700 hover:bg-slate-600 text-white"
                      >
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        onClick={() =>
                          updateBullet(
                            exp.id,
                            bIdx,
                            applyFormatting(bullet, "underline")
                          )
                        }
                        className="bg-slate-700 hover:bg-slate-600 text-white"
                      >
                        <Underline className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={bullet}
                      onChange={(e) =>
                        updateBullet(exp.id, bIdx, e.target.value)
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                ))}
                <Button
                  onClick={() => addBullet(exp.id)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 mt-2 w-full"
                >
                  <Plus className="w-4 h-4" /> Add Bullet
                </Button>
              </div>
            </Card>
          ))}
          <Button
            onClick={addExperience}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Plus className="w-4 h-4" /> Add Experience
          </Button>
        </TabsContent>

        {/* === Projects === */}
        <TabsContent value="projects" className="space-y-4 mt-4">
          {resumeData.projects.map((proj: any, idx: number) => (
            <Card
              key={proj.id}
              className="bg-slate-800/50 border-slate-700 p-6"
            >
              <div className="flex justify-between mb-4">
                <h3 className="text-white font-bold">Project {idx + 1}</h3>
                <Button
                  onClick={() => deleteProject(proj.id)}
                  size="icon"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <Input
                placeholder="Project Title"
                value={proj.title}
                onChange={(e) =>
                  updateProject(proj.id, "title", e.target.value)
                }
                className="bg-slate-700 border-slate-600 text-white mb-2"
              />

              <Textarea
                placeholder="Description"
                value={proj.description}
                onChange={(e) =>
                  updateProject(proj.id, "description", e.target.value)
                }
                className="bg-slate-700 border-slate-600 text-white mb-2"
              />

              <Input
                placeholder="Technologies (comma separated)"
                value={proj.technologies.join(", ")}
                onChange={(e) =>
                  updateProject(
                    proj.id,
                    "technologies",
                    e.target.value.split(",").map((t) => t.trim())
                  )
                }
                className="bg-slate-700 border-slate-600 text-white mb-2"
              />

              <Input
                placeholder="Project Link"
                value={proj.link}
                onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white mb-2"
              />
            </Card>
          ))}
          <Button
            onClick={addProject}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Plus className="w-4 h-4" /> Add Project
          </Button>
        </TabsContent>

        {/* === Education === */}
        <TabsContent value="education" className="space-y-4 mt-4">
          {resumeData.education.map((edu: any, idx: number) => (
            <Card key={edu.id} className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-white font-bold">Education {idx + 1}</h3>
                <Button
                  onClick={() => deleteEducation(edu.id)}
                  size="icon"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <Input
                placeholder="School"
                value={edu.school}
                onChange={(e) =>
                  updateEducation(edu.id, "school", e.target.value)
                }
                className="bg-slate-700 border-slate-600 text-white mb-2"
              />

              <Input
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) =>
                  updateEducation(edu.id, "degree", e.target.value)
                }
                className="bg-slate-700 border-slate-600 text-white mb-2"
              />

              <Input
                placeholder="Location"
                value={edu.location}
                onChange={(e) =>
                  updateEducation(edu.id, "location", e.target.value)
                }
                className="bg-slate-700 border-slate-600 text-white mb-2"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Graduation Date"
                  value={edu.graduationDate}
                  onChange={(e) =>
                    updateEducation(edu.id, "graduationDate", e.target.value)
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Input
                  placeholder="GPA"
                  value={edu.gpa}
                  onChange={(e) =>
                    updateEducation(edu.id, "gpa", e.target.value)
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </Card>
          ))}
          <Button
            onClick={addEducation}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Plus className="w-4 h-4" /> Add Education
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
