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

  const downloadResume = async () => {
    const element = document.getElementById("resume-preview");
    if (!element) return;

    const clonedElement = element.cloneNode(true) as HTMLElement;

    // Create hidden iframe for safe rendering
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.left = "-9999px";
    iframe.style.width = "210mm";
    iframe.style.height = "297mm";
    iframe.style.background = "#ffffff";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    // Clean stylesheet with icon alignment fix
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            @page { size: A4; margin: 0; }
           
            * {
              box-sizing: border-box;
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
              font-family: 'Georgia', 'Times New Roman', serif;
              color: #000;
              line-height: 1.5;
              padding: 6mm 8mm;
              font-size: 11px;
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
              margin-top: 6px;
              margin-bottom: 2px;
              border-bottom: 1px solid #333;
              padding-bottom: 2px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
           
            h3 {
              font-size: 11px;
              margin-top: 4px;
              margin-bottom: 2px;
              font-weight: bold;
            }

            p, li {
              font-size: 11px;
              margin: 2px 0;
              line-height: 1.25;
            }
           
            ul {
              margin-left: 18px;
              padding-left: 0;
            }

            strong, b {
              font-weight: 700;
              color: #000;
            }

            /* Icon alignment fix */
            svg {
              vertical-align: baseline;
              position: relative;
              top: 1px;
              display: inline-block;
              height: 10px;
              width: 10px;
            }

            /* Flex container alignment */
            .inline-icon {
              display: inline-flex;
              align-items: center;
              gap: 3px;
            }

            span[style*="display: flex"] {
              align-items: center;
            }
          </style>
        </head>
        <body></body>
      </html>
    `);
    iframeDoc.close();

    iframeDoc.body.appendChild(clonedElement);

    try {
      const jspdfModule = await import("jspdf");
      const html2canvasModule = await import("html2canvas");
      const html2canvas =
        (html2canvasModule && html2canvasModule.default) || html2canvasModule;
      const jsPDF: any =
        (jspdfModule as any)?.jsPDF ||
        (jspdfModule as any)?.default?.jsPDF ||
        (jspdfModule as any)?.default ||
        jspdfModule;

      // Render canvas
      const canvas = await html2canvas(iframeDoc.body, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: 794,
        windowHeight: 1123,
        logging: false,
        ignoreElements: (element) => {
          const computedStyle = window.getComputedStyle(element);
          return (
            computedStyle.backgroundColor?.includes("lab(") ||
            computedStyle.color?.includes("lab(")
          );
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
     
      // Add the image
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);

      pdf.save(`${resumeData.personal.name.replace(/\s+/g, "_")}_Resume.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Error generating PDF. Please try again.");
    } finally {
      if (iframe && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
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
