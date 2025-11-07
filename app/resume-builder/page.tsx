"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ResumePreview from "@/components/resume-preview"
import ResumeEditor from "@/components/resume-editor"

export default function ResumeBuilder() {
  const [showPreview, setShowPreview] = useState(true)
  const [resumeData, setResumeData] = useState({
    personal: {
      name: "Your Name",
      location: "San Francisco, CA",
      phone: "+1 (XXX) XXX-XXXX",
      email: "email@example.com",
      website: "yourwebsite.com",
      linkedin: "linkedin.com/in/yourprofile",
      github: "github.com/yourprofile",
    },
    summary: "Software engineer with expertise in building scalable applications.",
    skills: {
      languages: ["Java", "Python", "JavaScript", "TypeScript"],
      frontend: ["React", "Next.js", "Tailwind CSS"],
      backend: ["Node.js", "Spring Boot", "Express"],
      databases: ["PostgreSQL", "MongoDB", "MySQL"],
      tools: ["Docker", "AWS", "Git", "CI/CD"],
    },
    experience: [
      {
        id: 1,
        company: "Tech Company",
        position: "Software Engineer",
        location: "San Francisco, CA",
        startDate: "Jan 2024",
        endDate: "Present",
        bullets: [
          "Built scalable backend architecture serving 10,000+ users",
          "Implemented CI/CD pipeline reducing deployment time by 50%",
        ],
      },
    ],
    projects: [
      {
        id: 1,
        title: "Project Title",
        technologies: ["React", "Node.js", "PostgreSQL"],
        description: "Brief description of your project and what you built.",
        link: "github.com/yourprofile/project",
      },
    ],
    education: [
      {
        id: 1,
        school: "University Name",
        degree: "Bachelor of Science in Computer Science",
        gpa: "3.95",
        graduationDate: "December 2025",
        location: "San Francisco, CA",
      },
    ],
  })

  // Function to download resume as PDF
  const downloadResume = async () => {
    const element = document.getElementById("resume-preview")
    if (element) {
      try {
        // Clone the element and remove all Tailwind classes (but skip SVG elements)
        const clonedElement = element.cloneNode(true) as HTMLElement
        const allElements = clonedElement.querySelectorAll("*")
        allElements.forEach((el) => {
          // Skip SVG elements since they have read-only className properties
          if (el.tagName.toLowerCase() !== "svg" && el.tagName.toLowerCase() !== "path") {
            try {
              el.className = ""
            } catch (e) {
              // Silently skip elements that have read-only className
            }
          }
        })

        // Create a temporary container with inline styles
        const tempContainer = document.createElement("div")
        tempContainer.style.backgroundColor = "#ffffff"
        tempContainer.style.padding = "0"
        tempContainer.appendChild(clonedElement)
        document.body.appendChild(tempContainer)

        // Import jsPDF dynamically
        const { jsPDF } = await import("jspdf")
        const html2canvas = (await import("html2canvas")).default

        const canvas = await html2canvas(tempContainer, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowHeight: tempContainer.scrollHeight,
        })

        // Remove temporary container
        document.body.removeChild(tempContainer)

        const pdf = new jsPDF("p", "mm", "a4")
        const imgData = canvas.toDataURL("image/png")
        const imgWidth = 210
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        let heightLeft = imgHeight

        let position = 0

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= 297

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
          heightLeft -= 297
        }

        pdf.save(`${resumeData.personal.name.replace(/\s+/g, "_")}_Resume.pdf`)
      } catch (error) {
        console.error("Error generating PDF:", error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors">
            {/* ArrowLeft icon and text */}
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-white">Resume Builder</h1>
          <div className="flex items-center gap-2">
            <Button onClick={downloadResume} variant="outline" size="sm" className="gap-2 bg-transparent">
              {/* Download icon */}
              Download PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)} className="gap-2">
              {/* EyeOff or Eye icon */}
              {showPreview ? "Hide" : "Show"} Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="order-2 lg:order-1">
            <ResumeEditor resumeData={resumeData} setResumeData={setResumeData} />
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="order-1 lg:order-2 sticky top-20 h-fit">
              {/* Removed Card component and use simple div with inline styles */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.5rem",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div id="resume-preview">
                  <ResumePreview data={resumeData} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
