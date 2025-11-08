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
  List,
  ListOrdered,
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
  const [customFields, setCustomFields] = useState<any[]>([]);

  const updatePersonal = (field: string, value: string) => {
    setResumeData({
      ...resumeData,
      personal: { ...resumeData.personal, [field]: value },
    });
  };

  const addCustomPersonalField = () => {
    const fieldName = prompt(
      "Enter field name (e.g., Portfolio, Twitter, etc.):"
    );
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

  const applyTextFormatting = (
    expId: number,
    bulletIdx: number,
    format: string
  ) => {
    const exp = resumeData.experience.find((e: any) => e.id === expId);
    if (!exp) return;

    const bullet = exp.bullets[bulletIdx];
    let formattedText = bullet;

    // Simple formatting - wrap selected text or entire bullet
    switch (format) {
      case "bold":
        formattedText = `**${bullet}**`;
        break;
      case "italic":
        formattedText = `*${bullet}*`;
        break;
      case "underline":
        formattedText = `__${bullet}__`;
        break;
    }

    updateBullet(expId, bulletIdx, formattedText);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-slate-800 text-white">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
        </TabsList>

        {/* Personal */}
        <TabsContent value="personal" className="space-y-4 mt-4">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">
                Personal Information
              </h3>
              <Button
                onClick={addCustomPersonalField}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 gap-2"
              >
                <Plus className="w-4 h-4" /> Add Field
              </Button>
            </div>
            <div className="space-y-4">
              {Object.entries(resumeData.personal).map(([key, value]: any) => (
                <div key={key} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold text-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </label>
                      {!["name", "email", "phone"].includes(key) && (
                        <Button
                          onClick={() => deletePersonalField(key)}
                          size="sm"
                          variant="ghost"
                          className="h-6 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <Input
                      value={value}
                      onChange={(e) => updatePersonal(key, e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Summary */}
        <TabsContent value="summary" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-300">
                Professional Summary
              </label>
              <div className="text-xs text-gray-400">
                {resumeData.summary?.length || 0} characters
              </div>
            </div>
            <Textarea
              value={resumeData.summary}
              onChange={(e) => updateSummary(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white mt-2 min-h-32"
              placeholder="Describe your professional background and expertise..."
            />
            <div className="mt-2 text-xs text-gray-400">
              Tip: Keep it concise (2-3 sentences) and highlight your key
              strengths
            </div>
          </Card>
        </TabsContent>

        {/* Skills */}
        <TabsContent value="skills" className="space-y-4 mt-4">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Skills</h3>
              <Button
                onClick={addSkillCategory}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 gap-2"
              >
                <Plus className="w-4 h-4" /> Add Category
              </Button>
            </div>
            <div className="space-y-4">
              {Object.entries(resumeData.skills).map(
                ([category, skills]: any) => (
                  <div key={category}>
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold text-gray-300 capitalize">
                        {category.replace(/([A-Z])/g, " $1")}
                      </label>
                      <Button
                        onClick={() => deleteSkillCategory(category)}
                        size="sm"
                        variant="ghost"
                        className="h-6 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input
                      value={skills.join(", ")}
                      onChange={(e) => updateSkills(category, e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                      placeholder="Separate skills with commas"
                    />
                  </div>
                )
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Experience */}
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
                  size="sm"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <Input
                  placeholder="Job Title"
                  value={exp.position}
                  onChange={(e) =>
                    updateExperience(exp.id, "position", e.target.value)
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Input
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(exp.id, "company", e.target.value)
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Input
                  placeholder="Location"
                  value={exp.location}
                  onChange={(e) =>
                    updateExperience(exp.id, "location", e.target.value)
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Start Date (e.g., Jan 2024)"
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

                {/* Bullet Style Selector */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-300">Bullet Style:</label>
                  <Select
                    value={exp.bulletStyle || "disc"}
                    onValueChange={(value) =>
                      updateExperience(exp.id, "bulletStyle", value)
                    }
                  >
                    <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="disc">• Bullet</SelectItem>
                      <SelectItem value="circle">○ Circle</SelectItem>
                      <SelectItem value="square">▪ Square</SelectItem>
                      <SelectItem value="decimal">1. Number</SelectItem>
                      <SelectItem value="dash">- Dash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bullets */}
                <div className="space-y-2 mt-4">
                  <label className="text-sm font-semibold text-gray-300">
                    Achievements & Responsibilities
                  </label>
                  {exp.bullets.map((bullet: string, bulletIdx: number) => (
                    <div key={bulletIdx} className="flex gap-2 items-start">
                      <Textarea
                        placeholder="Describe your achievement or responsibility..."
                        value={bullet}
                        onChange={(e) =>
                          updateBullet(exp.id, bulletIdx, e.target.value)
                        }
                        className="bg-slate-700 border-slate-600 text-white min-h-20"
                      />
                      <div className="flex flex-col gap-1">
                        <Button
                          onClick={() => deleteBullet(exp.id, bulletIdx)}
                          size="sm"
                          variant="ghost"
                          className="h-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={() => addBullet(exp.id)}
                    size="sm"
                    className="w-full bg-slate-700 hover:bg-slate-600 gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Bullet Point
                  </Button>
                </div>
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

        {/* Projects */}
        <TabsContent value="projects" className="space-y-4 mt-4">
          {resumeData.projects.map((proj: any, idx: number) => (
            <Card
              key={proj.id}
              className="bg-slate-800/50 border-slate-700 p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-5 h-5 text-gray-500" />
                  <h3 className="font-bold text-white">Project {idx + 1}</h3>
                </div>
                <Button
                  onClick={() => deleteProject(proj.id)}
                  size="sm"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <Input
                  placeholder="Project Title"
                  value={proj.title}
                  onChange={(e) =>
                    updateProject(proj.id, "title", e.target.value)
                  }
                  className="bg-slate-700 border-slate-600 text-white"
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
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Textarea
                  placeholder="Brief description of what you built and its impact..."
                  value={proj.description}
                  onChange={(e) =>
                    updateProject(proj.id, "description", e.target.value)
                  }
                  className="bg-slate-700 border-slate-600 text-white min-h-24"
                />
                <Input
                  placeholder="Project Link (optional)"
                  value={proj.link}
                  onChange={(e) =>
                    updateProject(proj.id, "link", e.target.value)
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </Card>
          ))}
          <Button
            onClick={addProject}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Plus className="w-4 h-4" /> Add Project
          </Button>
        </TabsContent>

        {/* Education */}
        <TabsContent value="education" className="space-y-4 mt-4">
          {resumeData.education?.map((edu: any, idx: number) => (
            <Card key={edu.id} className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-5 h-5 text-gray-500" />
                  <h3 className="font-bold text-white">Education {idx + 1}</h3>
                </div>
                <Button
                  onClick={() => deleteEducation(edu.id)}
                  size="sm"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <Input
                  placeholder="University/School Name"
                  value={edu.school}
                  onChange={(e) =>
                    updateEducation(edu.id, "school", e.target.value)
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Input
                  placeholder="Degree (e.g., Bachelor of Science in Computer Science)"
                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(edu.id, "degree", e.target.value)
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Input
                  placeholder="Location (optional)"
                  value={edu.location || ""}
                  onChange={(e) =>
                    updateEducation(edu.id, "location", e.target.value)
                  }
                  className="bg-slate-700 border-slate-600 text-white"
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
                    placeholder="GPA (optional)"
                    value={edu.gpa || ""}
                    onChange={(e) =>
                      updateEducation(edu.id, "gpa", e.target.value)
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
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
