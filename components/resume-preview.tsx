"use client"

import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react"
import { useRef } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { Button } from "@/components/ui/button"

export default function ResumePreview({ data }: any) {
  return (
    <div style={{ padding: "32px", color: "#000", fontFamily: "serif" }} className="font-serif">
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h1 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "8px" }}>{data.personal.name}</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
            fontSize: "12px",
            marginTop: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <MapPin width="12" height="12" />
            {data.personal.location}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Phone width="12" height="12" />
            {data.personal.phone}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Mail width="12" height="12" />
            {data.personal.email}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
            fontSize: "12px",
            marginTop: "4px",
          }}
        >
          {data.personal.website && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Globe width="12" height="12" />
              {data.personal.website}
            </div>
          )}
          {data.personal.linkedin && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Linkedin width="12" height="12" />
              {data.personal.linkedin}
            </div>
          )}
          {data.personal.github && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Github width="12" height="12" />
              {data.personal.github}
            </div>
          )}
        </div>
      </div>

      <hr style={{ margin: "12px 0", borderColor: "#ccc" }} />

      {/* Summary */}
      {data.summary && (
        <div style={{ marginBottom: "16px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "4px" }}>SUMMARY</h2>
          <p style={{ fontSize: "12px", lineHeight: "1.6" }}>{data.summary}</p>
        </div>
      )}

      {/* Skills */}
      {Object.keys(data.skills).length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "4px" }}>SKILLS</h2>
          <div style={{ space: "4px" }}>
            {Object.entries(data.skills).map(([category, items]: any) => (
              <div key={category} style={{ fontSize: "12px", marginBottom: "4px" }}>
                <span style={{ fontWeight: "bold", textTransform: "capitalize" }}>
                  {category.replace(/([A-Z])/g, " $1")}:
                </span>{" "}
                {items.join(", ")}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>EXPERIENCE</h2>
          <div style={{ space: "12px" }}>
            {data.experience.map((exp: any, idx: number) => (
              <div key={idx} style={{ fontSize: "12px", marginBottom: "12px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", marginBottom: "4px" }}
                >
                  <span>{exp.position}</span>
                  <span>
                    {exp.startDate} – {exp.endDate}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#666", marginBottom: "4px" }}>
                  <span>{exp.company}</span>
                  <span>{exp.location}</span>
                </div>
                <ul style={{ marginLeft: "16px", space: "2px" }}>
                  {exp.bullets.map((bullet: string, bidx: number) => (
                    <li key={bidx} style={{ listStyleType: "disc", marginBottom: "2px" }}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>PROJECTS</h2>
          <div style={{ space: "12px" }}>
            {data.projects.map((proj: any, idx: number) => (
              <div key={idx} style={{ fontSize: "12px", marginBottom: "12px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", marginBottom: "4px" }}
                >
                  <span>{proj.title}</span>
                  <span style={{ color: "#666" }}>{proj.technologies.join(", ")}</span>
                </div>
                <p style={{ color: "#666", marginBottom: "4px" }}>{proj.description}</p>
                {proj.link && <p style={{ color: "#0066cc" }}>{proj.link}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div>
          <h2 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>EDUCATION</h2>
          <div style={{ space: "8px" }}>
            {data.education.map((edu: any, idx: number) => (
              <div key={idx} style={{ fontSize: "12px", marginBottom: "8px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", marginBottom: "4px" }}
                >
                  <span>{edu.school}</span>
                  <span>{edu.graduationDate}</span>
                </div>
                <div style={{ color: "#666" }}>{edu.degree}</div>
                {edu.gpa && <div style={{ color: "#666" }}>GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
