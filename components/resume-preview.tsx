"use client";

import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";

export default function ResumePreview({ data }: any) {
  return (
    <div
      style={{ padding: "32px", color: "#000", fontFamily: "serif" }}
      className="font-serif"
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h1
          style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "8px" }}
        >
          {data.personal.name}
        </h1>
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
          <div style={{ display: "inline-flex", gap: "4px" }}>
            <MapPin
              width="12"
              height="12"
              style={{ flexShrink: 0, strokeWidth: 2 }}
            />
            <span>{data.personal.location}</span>
          </div>
          <div style={{ display: "inline-flex", gap: "4px" }}>
            <Phone
              width="12"
              height="12"
              style={{ flexShrink: 0, strokeWidth: 2 }}
            />
            <span>{data.personal.phone}</span>
          </div>
          <div style={{ display: "inline-flex", gap: "4px" }}>
            <Mail
              width="12"
              height="12"
              style={{ flexShrink: 0, strokeWidth: 2 }}
            />
            <span>{data.personal.email}</span>
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
            <div style={{ display: "inline-flex", gap: "4px" }}>
              <Globe
                width="12"
                height="12"
                style={{ flexShrink: 0, strokeWidth: 2 }}
              />
              <span>{data.personal.website}</span>
            </div>
          )}
          {data.personal.linkedin && (
            <div style={{ display: "inline-flex", gap: "4px" }}>
              <Linkedin
                width="12"
                height="12"
                style={{ flexShrink: 0, strokeWidth: 2 }}
              />
              <span>{data.personal.linkedin}</span>
            </div>
          )}
          {data.personal.github && (
            <div style={{ display: "inline-flex", gap: "4px" }}>
              <Github
                width="12"
                height="12"
                style={{ flexShrink: 0, strokeWidth: 2 }}
              />
              <span>{data.personal.github}</span>
            </div>
          )}
        </div>
      </div>

      <hr
        style={{
          margin: "10px 0",
          border: "none",
          borderTop: "1px solid #333",
        }}
      />

      {/* Summary */}
      {data.summary && (
        <div style={{ marginBottom: "12px" }}>
          <h2
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "6px",
              borderBottom: "none",
            }}
          >
            SUMMARY
          </h2>
          <p style={{ fontSize: "12px", lineHeight: "1.6" }}>{data.summary}</p>
        </div>
      )}

      {/* Skills */}
      {Object.keys(data.skills).length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          <h2
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "6px",
              borderBottom: "none",
            }}
          >
            SKILLS
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {Object.entries(data.skills).map(([category, items]: any) => (
              <div key={category} style={{ fontSize: "12px" }}>
                <span
                  style={{ fontWeight: "bold", textTransform: "capitalize" }}
                >
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
        <div style={{ marginBottom: "12px" }}>
          <h2
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "6px",
              borderBottom: "none",
            }}
          >
            EXPERIENCE
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {data.experience.map((exp: any, idx: number) => (
              <div key={idx} style={{ fontSize: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
                >
                  <span>{exp.position}</span>
                  <span>
                    {exp.startDate} – {exp.endDate}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#666",
                    marginBottom: "4px",
                  }}
                >
                  <span>{exp.company}</span>
                  <span>{exp.location}</span>
                </div>
                <div>
                  {exp.bullets.map((bullet: string, bidx: number) => (
                    <div
                      key={bidx}
                      style={{
                        display: "flex",
                        gap: "8px",
                        fontSize: "12px",
                        lineHeight: "1.6",
                        marginBottom: "2px",
                      }}
                    >
                      <span style={{ flexShrink: 0 }}>•</span>
                      <span style={{ flex: 1 }}>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          <h2
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "6px",
              borderBottom: "none",
            }}
          >
            PROJECTS
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {data.projects.map((proj: any, idx: number) => (
              <div key={idx} style={{ fontSize: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
                >
                  <span>{proj.title}</span>
                  <span style={{ color: "#666" }}>
                    {proj.technologies.join(", ")}
                  </span>
                </div>
                <p style={{ color: "#666", marginBottom: "4px" }}>
                  {proj.description}
                </p>
                {proj.link && <p style={{ color: "#0066cc" }}>{proj.link}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div>
          <h2
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "6px",
              borderBottom: "none",
            }}
          >
            EDUCATION
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {data.education.map((edu: any, idx: number) => (
              <div key={idx} style={{ fontSize: "12px", marginBottom: "8px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
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
  );
}