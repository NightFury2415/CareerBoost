"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ResumePreview from "@/components/resume-preview";
import ResumeEditor from "@/components/resume-editor";

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState({
    personal: {
      name: "Your Name",
      location: "San Francisco, CA",
      phone: "(415) 555-1234",
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

  // inside your component…
  const downloadResume = async () => {
    const el = document.getElementById("resume-preview");
    if (!el) return;

    const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <base href="${location.origin}/">
    <style>
      @page { size: A4; margin: 0; }
      html, body {
        width: 210mm; height: 297mm; margin: 0; padding: 0; background: #fff;
        -webkit-print-color-adjust: exact; print-color-adjust: exact;
      }
      body {
        font-family: Georgia, "Times New Roman", serif;
        color: #000; line-height: 1.5; padding: 6mm 8mm; font-size: 11px;
      }
      h1, h2, h3 { color: #000; }
      a { color: #0066cc; text-decoration: none; }
      .content-wrapper * { transform: none !important; }
      svg { height: 10px; width: 10px; vertical-align: baseline; position: relative; top: 1px; }
    </style>
  </head>
  <body>
    <div class="content-wrapper" style="width:210mm; min-height:297mm;">
      ${el.outerHTML}
    </div>
  </body>
</html>`;

    // Abort fetch if server takes too long
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 60000); // 60s

    try {
      const apiBase =
        process.env.NEXT_PUBLIC_PDF_API_BASE ??
        "https://careerboost-8521.onrender.com";

      const res = await fetch(`${apiBase}/api/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
        signal: controller.signal,
      });

      clearTimeout(t);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("PDF error", err);
        alert(`Error generating PDF${err?.details ? `: ${err.details}` : ""}`);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const nameParts = resumeData.personal.name.trim().split(/\s+/);
      const firstName = nameParts[0] || "Resume";
      const lastName = nameParts[nameParts.length - 1] || "";
      a.download = lastName
        ? `${firstName}_${lastName}_Resume.pdf`
        : `${firstName}_Resume.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      clearTimeout(t);
      if (e?.name === "AbortError") {
        alert("PDF generation timed out. Please try again.");
      } else {
        console.error(e);
        alert("PDF generation failed.");
      }
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
              className="gap-2 bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 text-sm rounded-lg"
            >
              📄 Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row lg:gap-8 overflow-hidden">
        <div className="flex-1 min-w-0 overflow-hidden">
          <ResumeEditor resumeData={resumeData} setResumeData={setResumeData} />
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
