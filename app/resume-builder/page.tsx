"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ResumePreview from "@/components/resume-preview";
import ResumeEditor from "@/components/resume-editor";

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState({
    personal: {
      name: "Dev Modi",
      location: "San Francisco, CA",
      phone: "+1 (XXX) XXX-XXXX",
      email: "email@example.com",
      website: "yourwebsite.com",
      linkedin: "https://linkedin.com/in/yourprofile",
      github: "https://github.com/yourprofile",
    },
    summary:
      "Software engineer with expertise in building scalable applications.",
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
        link: "https://github.com/yourprofile/project",
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
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const downloadResume = async () => {
    const element = document.getElementById("resume-preview");
    if (!element) {
      alert("Resume preview not found!");
      return;
    }

    setIsGenerating(true);

    try {
      // Get all computed styles and inline them
      const clonedElement = element.cloneNode(true) as HTMLElement;

      // Inline all SVG styles
      const svgs = clonedElement.querySelectorAll("svg");
      svgs.forEach((svg) => {
        svg.setAttribute("style", `
          vertical-align: baseline;
          position: relative;
          top: 1px;
          display: inline-block;
          height: 10px;
          width: 10px;
        `);
      });

      // Create full HTML document
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }

              @page {
                size: A4;
                margin: 0;
              }

              html, body {
                width: 210mm;
                height: 297mm;
                margin: 0;
                padding: 0;
                background: #fff;
                overflow: hidden;
              }

              body {
                font-family: Georgia, 'Times New Roman', serif;
                color: #000;
                line-height: 1.5;
                font-size: 11px;
              }

              .font-serif {
                font-family: Georgia, 'Times New Roman', serif;
              }

              .resume-print-area {
                width: 210mm;
                min-height: 297mm;
                padding: 6mm 8mm;
                background-color: #ffffff;
                color: #000;
                box-sizing: border-box;
              }

              h1, h2, h3 {
                font-weight: 700;
                color: #000;
              }

              h1 {
                font-size: 28px;
                margin: 0;
                text-align: center;
              }

              h2 {
                font-size: 12px;
                font-weight: bold;
                margin: 6px 0 2px 0;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }

              h3 {
                font-size: 11px;
                margin-top: 4px;
                margin-bottom: 2px;
                font-weight: bold;
              }

              p {
                font-size: 11px;
                margin: 2px 0;
                line-height: 1.25;
              }

              strong, b {
                font-weight: 700;
                color: #000;
              }

              /* SVG Icons */
              svg {
                vertical-align: baseline;
                position: relative;
                top: 1px;
                display: inline-block;
                width: 10px;
                height: 10px;
              }

              /* Flex containers */
              span[style*="display: flex"],
              span[style*="display:flex"],
              .inline-icon {
                display: inline-flex !important;
                align-items: center !important;
                gap: 3px;
              }

              /* Ensure proper spacing */
              div[style*="marginBottom"] {
                margin-bottom: 6px;
              }
            </style>
          </head>
          <body>
            ${clonedElement.outerHTML}
          </body>
        </html>
      `;

      // Send to API
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html: htmlContent }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "PDF generation failed");
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resumeData.personal.name.replace(/\s+/g, "_")}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert(`Error generating PDF: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Toolbar */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
          >
            ← Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-white">Resume Builder</h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={downloadResume}
              disabled={isGenerating}
              className="gap-2 bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Generating...
                </>
              ) : (
                <>
                  📄 Download PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row lg:gap-8 overflow-hidden">
        <div className="flex-1 min-w-0 overflow-hidden">
          <ResumeEditor
            resumeData={resumeData}
            setResumeData={setResumeData}
          />
        </div>

        <div className="flex-1 lg:max-w-[50%] sticky top-20 h-[calc(100vh-5rem)] overflow-auto">
          <div
            style={{
              padding: "1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              minWidth: "calc(210mm + 2rem)",
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                width: "210mm",
                minHeight: "297mm",
                flexShrink: 0,
              }}
            >
              <div id="resume-preview" className="content-wrapper">
                <ResumePreview data={resumeData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}