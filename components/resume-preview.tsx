"use client";

import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

export default function ResumePreview({ data }: any) {
  // Helper function to render formatted text (bold, italic, underline, color)
  const renderFormattedText = (text: string) => {
    if (!text) return null;

    let formatted = text
      // Color with span tags - UPDATED to match editor format
      .replace(
        /<span style="color:(#[0-9a-fA-F]{6})">(.+?)<\/span>/g,
        '<span style="color:$1">$2</span>'
      )
      // Bold: **text**
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // Italic: *text* (but not **)
      .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
      // Underline: __text__
      .replace(/__(.+?)__/g, "<u>$1</u>");

    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  // Get font size helper - UPDATED to match editor structure
  const getFontSize = (field: string, section?: string, id?: number) => {
    if (section === "personal") {
      return data.personalFontSizes?.[field] || "10.5";
    } else if (section === "experience" && id) {
      return data.experienceFieldFontSizes?.[`${id}-${field}`] || data.experienceFontSize || "11";
    } else if (section === "projects" && id) {
      return data.projectFieldFontSizes?.[`${id}-${field}`] || data.projectsFontSize || "11";
    } else if (section === "education" && id) {
      return data.educationFieldFontSizes?.[`${id}-${field}`] || data.educationFontSize || "11";
    }
    return data[`${section}FontSize`] || "11";
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
        if (!data.summary || !data.summary.trim()) return null;
        const summaryFontSize = getFontSize("summary", "summary");
        return (
          <div style={{ marginBottom: "10px" }}>
            <h2
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              SUMMARY
            </h2>
            <p
              style={{
                fontSize: `${summaryFontSize}px`,
                lineHeight: "1.5",
                margin: 0,
              }}
            >
              {renderFormattedText(data.summary)}
            </p>
          </div>
        );

      case "skills":
        if (!data.skills || Object.keys(data.skills).length === 0) return null;
        const hasSkills = Object.values(data.skills).some(
          (items: any) => items && items.length > 0
        );
        if (!hasSkills) return null;
        const skillsFontSize = getFontSize("skills", "skills");

        return (
          <div style={{ marginBottom: "10px" }}>
            <h2
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              SKILLS
            </h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "3px" }}
            >
              {Object.entries(data.skills).map(([category, items]: any) => {
                if (!items || items.length === 0) return null;
                return (
                  <div
                    key={category}
                    style={{
                      fontSize: `${skillsFontSize}px`,
                      lineHeight: "1.4",
                    }}
                  >
                    <span
                      style={{ fontWeight: "600", textTransform: "capitalize" }}
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
          <div style={{ marginBottom: "10px" }}>
            <h2
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              EXPERIENCE
            </h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {validExperiences.map((exp: any, idx: number) => {
                const positionSize = getFontSize("position", "experience", exp.id);
                const companySize = getFontSize("company", "experience", exp.id);
                const locationSize = getFontSize("location", "experience", exp.id);
                const startDateSize = getFontSize("startDate", "experience", exp.id);
                const bulletSize = data.experienceFontSize || "11";

                return (
                  <div key={exp.id || idx}>
                    {(exp.position || exp.startDate || exp.endDate) && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontWeight: "bold",
                          marginBottom: "2px",
                        }}
                      >
                        <span style={{ fontSize: `${positionSize}px` }}>
                          {exp.position}
                        </span>
                        {(exp.startDate || exp.endDate) && (
                          <span style={{ fontSize: `${startDateSize}px` }}>
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
                          color: "#555",
                          marginBottom: "3px",
                        }}
                      >
                        <span style={{ fontSize: `${companySize}px` }}>
                          {exp.company}
                        </span>
                        <span style={{ fontSize: `${locationSize}px` }}>
                          {exp.location}
                        </span>
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
                                gap: "6px",
                                lineHeight: "1.5",
                                marginBottom: "1px",
                                fontSize: `${bulletSize}px`,
                              }}
                            >
                              <span style={{ flexShrink: 0, minWidth: "8px" }}>
                                {exp.bulletStyle || "•"}
                              </span>
                              <span style={{ flex: 1 }}>
                                {renderFormattedText(bullet)}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })}
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
          <div style={{ marginBottom: "10px" }}>
            <h2
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              PROJECTS
            </h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {validProjects.map((proj: any, idx: number) => {
                const titleSize = getFontSize("title", "projects", proj.id);
                const projFontSize = data.projectsFontSize || "11";

                return (
                  <div key={proj.id || idx}>
                    {(proj.title ||
                      (proj.technologies && proj.technologies.length > 0)) && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontWeight: "bold",
                          marginBottom: "2px",
                        }}
                      >
                        <span style={{ fontSize: `${titleSize}px` }}>
                          {proj.title}
                        </span>
                        {proj.technologies && proj.technologies.length > 0 && (
                          <span
                            style={{
                              color: "#555",
                              fontWeight: "normal",
                              fontSize: `${projFontSize}px`,
                            }}
                          >
                            {proj.technologies.filter(Boolean).join(", ")}
                          </span>
                        )}
                      </div>
                    )}
                    {proj.type && (
                      <p
                        style={{
                          color: "#666",
                          marginBottom: "2px",
                          fontSize: `${parseInt(projFontSize) - 1}px`,
                          margin: "0 0 2px 0",
                        }}
                      >
                        {proj.type}
                      </p>
                    )}
                    {proj.description && (
                      <p
                        style={{
                          color: "#333",
                          marginBottom: "2px",
                          lineHeight: "1.5",
                          margin: "0 0 2px 0",
                          fontSize: `${projFontSize}px`,
                        }}
                      >
                        {renderFormattedText(proj.description)}
                      </p>
                    )}
                    {proj.impact && (
                      <p
                        style={{
                          color: "#333",
                          marginBottom: "2px",
                          lineHeight: "1.5",
                          margin: "0 0 2px 0",
                          fontSize: `${projFontSize}px`,
                        }}
                      >
                        {renderFormattedText(proj.impact)}
                      </p>
                    )}

                    {/* Project bullets */}
                    {proj.bullets && proj.bullets.length > 0 && (
                      <div style={{ marginTop: "3px" }}>
                        {proj.bullets
                          .filter((bullet: string) => bullet && bullet.trim())
                          .map((bullet: string, bidx: number) => (
                            <div
                              key={bidx}
                              style={{
                                display: "flex",
                                gap: "6px",
                                lineHeight: "1.5",
                                marginBottom: "1px",
                                fontSize: `${projFontSize}px`,
                              }}
                            >
                              <span style={{ flexShrink: 0, minWidth: "8px" }}>
                                {proj.bulletStyle || "•"}
                              </span>
                              <span style={{ flex: 1 }}>
                                {renderFormattedText(bullet)}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}

                    {proj.link && (
                      <p
                        style={{
                          color: "#0066cc",
                          fontSize: `${parseInt(projFontSize) - 1}px`,
                          margin: "2px 0 0 0",
                        }}
                      >
                        {proj.link}
                      </p>
                    )}
                  </div>
                );
              })}
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
          <div style={{ marginBottom: "10px" }}>
            <h2
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              EDUCATION
            </h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {validEducation.map((edu: any, idx: number) => {
                const schoolSize = getFontSize("school", "education", edu.id);
                const degreeSize = getFontSize("degree", "education", edu.id);
                const gradDateSize = getFontSize("graduationDate", "education", edu.id);
                const eduFontSize = data.educationFontSize || "11";

                return (
                  <div key={edu.id || idx}>
                    {(edu.school || edu.graduationDate) && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontWeight: "bold",
                          marginBottom: "2px",
                        }}
                      >
                        <span style={{ fontSize: `${schoolSize}px` }}>
                          {edu.school}
                        </span>
                        <span style={{ fontSize: `${gradDateSize}px` }}>
                          {edu.graduationDate}
                        </span>
                      </div>
                    )}
                    {edu.degree && (
                      <div
                        style={{
                          color: "#555",
                          lineHeight: "1.4",
                          fontSize: `${degreeSize}px`,
                        }}
                      >
                        {edu.degree}
                      </div>
                    )}
                    {edu.minor && (
                      <div
                        style={{
                          color: "#555",
                          fontSize: `${parseInt(eduFontSize) - 0.5}px`,
                          lineHeight: "1.4",
                        }}
                      >
                        Minor: {edu.minor}
                      </div>
                    )}
                    {edu.location && (
                      <div
                        style={{
                          color: "#555",
                          fontSize: `${parseInt(eduFontSize) - 0.5}px`,
                          lineHeight: "1.4",
                        }}
                      >
                        {edu.location}
                      </div>
                    )}
                    {edu.gpa && (
                      <div
                        style={{
                          color: "#555",
                          fontSize: `${parseInt(eduFontSize) - 0.5}px`,
                          lineHeight: "1.4",
                        }}
                      >
                        <strong>GPA: {edu.gpa}</strong>
                      </div>
                    )}
                    {edu.honors && (
                      <div
                        style={{
                          color: "#333",
                          marginTop: "2px",
                          lineHeight: "1.4",
                          fontSize: `${eduFontSize}px`,
                        }}
                      >
                        {renderFormattedText(edu.honors)}
                      </div>
                    )}
                    {edu.description && (
                      <div
                        style={{
                          color: "#333",
                          marginTop: "2px",
                          lineHeight: "1.4",
                          fontSize: `${eduFontSize}px`,
                        }}
                      >
                        {renderFormattedText(edu.description)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "15mm 20mm",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        color: "#000",
        fontFamily: "Georgia, serif",
        fontSize: "11px",
        boxSizing: "border-box",
      }}
      className="font-serif"
    >
      {/* Header - Personal Info */}
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <h1
          style={{
            fontSize: `${getFontSize("name", "personal")}px`,
            fontWeight: "bold",
            marginBottom: "6px",
            margin: "0 0 6px 0",
          }}
        >
          {data.personal.name || "Your Name"}
        </h1>

        {/* Contact Info Row 1 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "4px",
          }}
        >
          {data.personal.location && (
            <div
              style={{
                display: "inline-flex",
                gap: "3px",
                alignItems: "center",
                fontSize: `${getFontSize("location", "personal")}px`,
              }}
            >
              <MapPin
                width="11"
                height="11"
                style={{ flexShrink: 0, strokeWidth: 2 }}
              />
              <span>{data.personal.location}</span>
            </div>
          )}
          {data.personal.phone && (
            <div
              style={{
                display: "inline-flex",
                gap: "3px",
                alignItems: "center",
                fontSize: `${getFontSize("phone", "personal")}px`,
              }}
            >
              <Phone
                width="11"
                height="11"
                style={{ flexShrink: 0, strokeWidth: 2 }}
              />
              <span>{data.personal.phone}</span>
            </div>
          )}
          {data.personal.email && (
            <div
              style={{
                display: "inline-flex",
                gap: "3px",
                alignItems: "center",
                fontSize: `${getFontSize("email", "personal")}px`,
              }}
            >
              <Mail
                width="11"
                height="11"
                style={{ flexShrink: 0, strokeWidth: 2 }}
              />
              <span>{data.personal.email}</span>
            </div>
          )}
        </div>

        {/* Contact Info Row 2 */}
        {(data.personal.website ||
          data.personal.linkedin ||
          data.personal.github ||
          Object.entries(data.personal).filter(
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
          ).length > 0) && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "3px",
            }}
          >
            {data.personal.website && (
              <div
                style={{
                  display: "inline-flex",
                  gap: "3px",
                  alignItems: "center",
                  fontSize: `${getFontSize("website", "personal")}px`,
                }}
              >
                <Globe
                  width="11"
                  height="11"
                  style={{ flexShrink: 0, strokeWidth: 2 }}
                />
                <span>{data.personal.website}</span>
              </div>
            )}
            {data.personal.linkedin && (
              <div
                style={{
                  display: "inline-flex",
                  gap: "3px",
                  alignItems: "center",
                  fontSize: `${getFontSize("linkedin", "personal")}px`,
                }}
              >
                <Linkedin
                  width="11"
                  height="11"
                  style={{ flexShrink: 0, strokeWidth: 2 }}
                />
                <span>{data.personal.linkedin}</span>
              </div>
            )}
            {data.personal.github && (
              <div
                style={{
                  display: "inline-flex",
                  gap: "3px",
                  alignItems: "center",
                  fontSize: `${getFontSize("github", "personal")}px`,
                }}
              >
                <Github
                  width="11"
                  height="11"
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
                  <div
                    key={key}
                    style={{
                      display: "inline-flex",
                      gap: "3px",
                      fontSize: `${getFontSize(key, "personal")}px`,
                    }}
                  >
                    <span style={{ textTransform: "capitalize" }}>{key}:</span>
                    <span>{value}</span>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      <hr
        style={{
          margin: "8px 0",
          border: "none",
          borderTop: "1.5px solid #333",
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