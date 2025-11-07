"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, X } from "lucide-react"

export default function ResumeEditor({ resumeData, setResumeData }: any) {
  const updatePersonal = (field: string, value: string) => {
    setResumeData({
      ...resumeData,
      personal: { ...resumeData.personal, [field]: value },
    })
  }

  const updateSummary = (value: string) => {
    setResumeData({ ...resumeData, summary: value })
  }

  const updateSkills = (category: string, value: string) => {
    setResumeData({
      ...resumeData,
      skills: {
        ...resumeData.skills,
        [category]: value.split(",").map((item) => item.trim()),
      },
    })
  }

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
        },
      ],
    })
  }

  const updateExperience = (id: number, field: string, value: any) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp: any) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    })
  }

  const deleteExperience = (id: number) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter((exp: any) => exp.id !== id),
    })
  }

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
    })
  }

  const updateProject = (id: number, field: string, value: any) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map((proj: any) => (proj.id === id ? { ...proj, [field]: value } : proj)),
    })
  }

  const deleteProject = (id: number) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.filter((proj: any) => proj.id !== id),
    })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800 text-white">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        {/* Personal */}
        <TabsContent value="personal" className="space-y-4 mt-4">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-300">Full Name</label>
                <Input
                  value={resumeData.personal.name}
                  onChange={(e) => updatePersonal("name", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-300">Location</label>
                <Input
                  value={resumeData.personal.location}
                  onChange={(e) => updatePersonal("location", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-300">Phone</label>
                <Input
                  value={resumeData.personal.phone}
                  onChange={(e) => updatePersonal("phone", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-300">Email</label>
                <Input
                  value={resumeData.personal.email}
                  onChange={(e) => updatePersonal("email", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-300">Website</label>
                <Input
                  value={resumeData.personal.website}
                  onChange={(e) => updatePersonal("website", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-300">LinkedIn</label>
                <Input
                  value={resumeData.personal.linkedin}
                  onChange={(e) => updatePersonal("linkedin", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-300">GitHub</label>
                <Input
                  value={resumeData.personal.github}
                  onChange={(e) => updatePersonal("github", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Summary */}
        <TabsContent value="summary" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <label className="text-sm font-semibold text-gray-300">Professional Summary</label>
            <Textarea
              value={resumeData.summary}
              onChange={(e) => updateSummary(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white mt-2 min-h-32"
              placeholder="Describe your professional background and expertise..."
            />
          </Card>
        </TabsContent>

        {/* Skills */}
        <TabsContent value="skills" className="space-y-4 mt-4">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="space-y-4">
              {Object.entries(resumeData.skills).map(([category, skills]: any) => (
                <div key={category}>
                  <label className="text-sm font-semibold text-gray-300 capitalize">
                    {category.replace(/([A-Z])/g, " $1")}
                  </label>
                  <Input
                    value={skills.join(", ")}
                    onChange={(e) => updateSkills(category, e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="Separate skills with commas"
                  />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Experience */}
        <TabsContent value="experience" className="space-y-4 mt-4">
          {resumeData.experience.map((exp: any, idx: number) => (
            <Card key={exp.id} className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white">Experience {idx + 1}</h3>
                <button onClick={() => deleteExperience(exp.id)} className="text-red-400 hover:text-red-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <Input
                  placeholder="Job Title"
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Input
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Input
                  placeholder="Location"
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Start Date"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Input
                    placeholder="End Date"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </Card>
          ))}
          <Button onClick={addExperience} className="w-full bg-slate-700 hover:bg-slate-600 text-white gap-2">
            <Plus className="w-4 h-4" /> Add Experience
          </Button>
        </TabsContent>

        {/* Projects */}
        <TabsContent value="projects" className="space-y-4 mt-4">
          {resumeData.projects.map((proj: any, idx: number) => (
            <Card key={proj.id} className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white">Project {idx + 1}</h3>
                <button onClick={() => deleteProject(proj.id)} className="text-red-400 hover:text-red-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <Input
                  placeholder="Project Title"
                  value={proj.title}
                  onChange={(e) => updateProject(proj.id, "title", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Input
                  placeholder="Technologies (comma separated)"
                  value={proj.technologies.join(", ")}
                  onChange={(e) =>
                    updateProject(
                      proj.id,
                      "technologies",
                      e.target.value.split(",").map((t) => t.trim()),
                    )
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Textarea
                  placeholder="Description"
                  value={proj.description}
                  onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Input
                  placeholder="Project Link"
                  value={proj.link}
                  onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </Card>
          ))}
          <Button onClick={addProject} className="w-full bg-slate-700 hover:bg-slate-600 text-white gap-2">
            <Plus className="w-4 h-4" /> Add Project
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
