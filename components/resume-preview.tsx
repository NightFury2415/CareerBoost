"use client";

import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

export default function ResumePreview({ data }: any) {
  // Helper function to render formatted text (bold, italic, underline)
  const renderFormattedText = (text: string) => {
    if (!text) return null;

    // Replace markdown-style formatting with HTML
    let formatted = text
      // Bold: **text**
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // Italic: *text*
      .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
      // Underline: __text__
      .replace(/__(.+?)__/g, "<u>$1</u>");

    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  // Get section order from data or use default
  const sectionOrder = data.sectionOrder || [
    "personal",
    "summary",
    "skills",
    "experience",
    "projects",
    "education",
  ];

  // Render individual sections based on type
  const renderSection = (section: string) => {
    switch (section) {
      case "personal":
        return null; // Personal is always rendered in header

      case "summary":
        if (!data.summary) return null;
        return (
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
            <p style={{ fontSize: "12px", lineHeight: "1.6" }}>
              {renderFormattedText(data.summary)}
            </p>
          </div>
        );

      case "skills":
        if (!data.skills || Object.keys(data.skills).length === 0) return null;
        return (
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
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              {Object.entries(data.skills).map(([category, items]: any) => {
                if (!items || items.length === 0) return null;
                return (
                  <div key={category} style={{ fontSize: "12px" }}>
                    <span
                      style={{
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {category.replace(/([A-Z])/g, " $1")}:
                    </span>{" "}
                    {items.join(", ")}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "experience":
        if (!data.experience || data.experience.length === 0) return null;
        const validExperiences = data.experience.filter(
          (exp: any) => exp.position || exp.company
        );
        if (validExperiences.length === 0) return null;

        return (
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
              {validExperiences.map((exp: any, idx: number) => (
                <div key={exp.id || idx} style={{ fontSize: "12px" }}>
                  {(exp.position || exp.startDate || exp.endDate) && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: "bold",
                        marginBottom: "4px",
                      }}
                    >
                      <span>{exp.position}</span>
                      {(exp.startDate || exp.endDate) && (
                        <span>
                          {exp.startDate} {exp.startDate && exp.endDate && "–"}{" "}
                          {exp.endDate}
                        </span>
                      )}
                    </div>
                  )}
                  {(exp.company || exp.location) && (
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
                  )}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <div>
                      {exp.bullets
                        .filter((bullet: string) => bullet && bullet.trim())
                        .map((bullet: string, bidx: number) => (
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
                            <span style={{ flex: 1 }}>
                              {renderFormattedText(bullet)}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "projects":
        if (!data.projects || data.projects.length === 0) return null;
        const validProjects = data.projects.filter(
          (proj: any) => proj.title || proj.description
        );
        if (validProjects.length === 0) return null;

        return (
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
              {validProjects.map((proj: any, idx: number) => (
                <div key={proj.id || idx} style={{ fontSize: "12px" }}>
                  {(proj.title ||
                    (proj.technologies && proj.technologies.length > 0)) && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: "bold",
                        marginBottom: "4px",
                      }}
                    >
                      <span>{proj.title}</span>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <span style={{ color: "#666" }}>
                          {proj.technologies.filter(Boolean).join(", ")}
                        </span>
                      )}
                    </div>
                  )}
                  {proj.type && (
                    <p
                      style={{
                        color: "#666",
                        marginBottom: "4px",
                        fontSize: "11px",
                      }}
                    >
                      {proj.type}
                    </p>
                  )}
                  {proj.description && (
                    <p style={{ color: "#333", marginBottom: "4px" }}>
                      {renderFormattedText(proj.description)}
                    </p>
                  )}
                  {proj.impact && (
                    <p style={{ color: "#333", marginBottom: "4px" }}>
                      {renderFormattedText(proj.impact)}
                    </p>
                  )}
                  {proj.link && (
                    <p style={{ color: "#0066cc", fontSize: "11px" }}>
                      {proj.link}
                    </p>
                  )}

                  {/* Custom fields */}
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
                    .map(([key, value]: any) => {
                      if (!value) return null;
                      return (
                        <p
                          key={key}
                          style={{
                            color: "#333",
                            marginBottom: "4px",
                            fontSize: "11px",
                          }}
                        >
                          <strong style={{ textTransform: "capitalize" }}>
                            {key}:
                          </strong>{" "}
                          {value}
                        </p>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        );

      case "education":
        if (!data.education || data.education.length === 0) return null;
        const validEducation = data.education.filter(
          (edu: any) => edu.school || edu.degree
        );
        if (validEducation.length === 0) return null;

        return (
          <div style={{ marginBottom: "12px" }}>
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
              {validEducation.map((edu: any, idx: number) => (
                <div
                  key={edu.id || idx}
                  style={{ fontSize: "12px", marginBottom: "8px" }}
                >
                  {(edu.school || edu.graduationDate) && (
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
                  )}
                  {edu.degree && (
                    <div style={{ color: "#666" }}>{edu.degree}</div>
                  )}
                  {edu.minor && (
                    <div style={{ color: "#666", fontSize: "11px" }}>
                      Minor: {edu.minor}
                    </div>
                  )}
                  {edu.location && (
                    <div style={{ color: "#666", fontSize: "11px" }}>
                      {edu.location}
                    </div>
                  )}
                  {edu.gpa && (
                    <div style={{ color: "#666" }}>GPA: {edu.gpa}</div>
                  )}
                  {edu.honors && (
                    <div style={{ color: "#333", marginTop: "4px" }}>
                      {renderFormattedText(edu.honors)}
                    </div>
                  )}
                  {edu.description && (
                    <div style={{ color: "#333", marginTop: "4px" }}>
                      {renderFormattedText(edu.description)}
                    </div>
                  )}

                  {/* Custom fields */}
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
                    .map(([key, value]: any) => {
                      if (!value) return null;
                      return (
                        <div
                          key={key}
                          style={{
                            color: "#333",
                            marginTop: "4px",
                            fontSize: "11px",
                          }}
                        >
                          <strong style={{ textTransform: "capitalize" }}>
                            {key}:
                          </strong>{" "}
                          {value}
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        // Custom sections
        if (!data[section]) return null;
        return (
          <div style={{ marginBottom: "12px" }}>
            <h2
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "6px",
                borderBottom: "none",
                textTransform: "uppercase",
              }}
            >
              {section.replace(/([A-Z])/g, " $1").toUpperCase()}
            </h2>
            <p style={{ fontSize: "12px", lineHeight: "1.6" }}>
              {renderFormattedText(data[section])}
            </p>
          </div>
        );
    }
  };

  return (
    <div
      style={{ padding: "32px", color: "#000", fontFamily: "serif" }}
      className="font-serif"
    >
      {/* Header - Personal Info */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h1
          style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "8px" }}
        >
          {data.personal.name || "Your Name"}
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
          {data.personal.location && (
            <div style={{ display: "inline-flex", gap: "4px" }}>
              <MapPin
                width="12"
                height="12"
                style={{ flexShrink: 0, strokeWidth: 2 }}
              />
              <span>{data.personal.location}</span>
            </div>
          )}
          {data.personal.phone && (
            <div style={{ display: "inline-flex", gap: "4px" }}>
              <Phone
                width="12"
                height="12"
                style={{ flexShrink: 0, strokeWidth: 2 }}
              />
              <span>{data.personal.phone}</span>
            </div>
          )}
          {data.personal.email && (
            <div style={{ display: "inline-flex", gap: "4px" }}>
              <Mail
                width="12"
                height="12"
                style={{ flexShrink: 0, strokeWidth: 2 }}
              />
              <span>{data.personal.email}</span>
            </div>
          )}
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

          {/* Custom personal fields */}
          {Object.entries(data.personal)
            .filter(
              ([key]) =>
                ![
                  "name",
                  "location",
                  "phone",
                  "email",
                  "website",
                  "linkedin",
                  "github",
                ].includes(key)
            )
            .map(([key, value]: any) => {
              if (!value) return null;
              return (
                <div key={key} style={{ display: "inline-flex", gap: "4px" }}>
                  <span style={{ textTransform: "capitalize" }}>{key}:</span>
                  <span>{value}</span>
                </div>
              );
            })}
        </div>
      </div>

      <hr
        style={{
          margin: "10px 0",
          border: "none",
          borderTop: "1px solid #333",
        }}
      />

      {/* Render sections in custom order */}
      {sectionOrder
        .filter((section) => section !== "personal")
        .map((section) => (
          <div key={section}>{renderSection(section)}</div>
        ))}
    </div>
  );
}
