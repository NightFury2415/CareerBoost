"use client";

import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

export default function ResumePreview({ data }: any) {
  // Helper function to auto-highlight important content
  const autoHighlight = (text: string) => {
    if (!text) return text;

    // Highlight numbers (especially percentages, dollars, and metrics)
    text = text.replace(/(\d+[%$]?[\w]*|\$\d+[,\d]*)/g, "<strong>$1</strong>");

    // Highlight common achievement keywords
    const keywords = [
      "increased",
      "decreased",
      "improved",
      "reduced",
      "achieved",
      "implemented",
      "launched",
      "developed",
      "created",
      "built",
      "designed",
      "led",
      "managed",
      "optimized",
      "streamlined",
      "automated",
      "enhanced",
    ];

    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b(${keyword})\\b`, "gi");
      text = text.replace(regex, "<strong>$1</strong>");
    });

    return text;
  };

  // Helper function to render formatted text (bold, italic, underline, color)
  const renderFormattedText = (text: string, autoHighlightEnabled = true) => {
    if (!text) return null;

    // First apply auto-highlighting if enabled
    let formatted = autoHighlightEnabled ? autoHighlight(text) : text;

    // Then apply manual formatting
    formatted = formatted
      // Color: [color:#hex]text[/color]
      .replace(
        /\[color:(#[0-9a-fA-F]{6})\](.+?)\[\/color\]/g,
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

  // Get section order from data or use default
  const sectionOrder = data.sectionOrder || [
    "personal",
    "summary",
    "skills",
    "experience",
    "projects",
    "education",
  ];

  // Get font sizes
  const getFontSize = (section: string, defaultSize: string = "11") => {
    return data[`${section}FontSize`] || defaultSize;
  };

  // Render individual sections based on type
  const renderSection = (section: string) => {
    switch (section) {
      case "personal":
        return null; // Personal is always rendered in header

      case "summary":
        if (!data.summary || !data.summary.trim()) return null;
        const summaryFontSize = getFontSize("summary");
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
        const skillsFontSize = getFontSize("skills");

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
        const expFontSize = getFontSize("experience");

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
              {validExperiences.map((exp: any, idx: number) => (
                <div
                  key={exp.id || idx}
                  style={{ fontSize: `${expFontSize}px` }}
                >
                  {(exp.position || exp.startDate || exp.endDate) && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: "bold",
                        marginBottom: "2px",
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
                        color: "#555",
                        marginBottom: "3px",
                        fontSize: `${parseInt(expFontSize) - 0.5}px`,
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
                              gap: "6px",
                              lineHeight: "1.5",
                              marginBottom: "1px",
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
        const projFontSize = getFontSize("projects");

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
              {validProjects.map((proj: any, idx: number) => (
                <div
                  key={proj.id || idx}
                  style={{ fontSize: `${projFontSize}px` }}
                >
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
                      <span>{proj.title}</span>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <span style={{ color: "#555", fontWeight: "normal" }}>
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
                          "bullets",
                          "bulletStyle",
                        ].includes(key)
                    )
                    .map(([key, value]: any) => {
                      if (!value) return null;
                      return (
                        <p
                          key={key}
                          style={{
                            color: "#333",
                            marginBottom: "2px",
                            fontSize: `${parseInt(projFontSize) - 0.5}px`,
                            margin: "2px 0 0 0",
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
        const eduFontSize = getFontSize("education");

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
              {validEducation.map((edu: any, idx: number) => (
                <div
                  key={edu.id || idx}
                  style={{ fontSize: `${eduFontSize}px` }}
                >
                  {(edu.school || edu.graduationDate) && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: "bold",
                        marginBottom: "2px",
                      }}
                    >
                      <span>{edu.school}</span>
                      <span>{edu.graduationDate}</span>
                    </div>
                  )}
                  {edu.degree && (
                    <div style={{ color: "#555", lineHeight: "1.4" }}>
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
                      }}
                    >
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
                            marginTop: "2px",
                            fontSize: `${parseInt(eduFontSize) - 0.5}px`,
                            lineHeight: "1.4",
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
        // Custom sections - check mode
        if (
          !data[section] ||
          (typeof data[section] === "string" && !data[section].trim())
        )
          return null;

        const customFontSize = getFontSize(section);

        // Check if it's category mode (object with categories)
        if (
          typeof data[section] === "object" &&
          !Array.isArray(data[section]) &&
          data[section] !== null
        ) {
          const hasContent = Object.values(data[section]).some(
            (items: any) => Array.isArray(items) && items.length > 0
          );
          if (!hasContent) return null;

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
                {section.replace(/([A-Z])/g, " $1").toUpperCase()}
              </h2>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "3px" }}
              >
                {Object.entries(data[section]).map(([category, items]: any) => {
                  if (!items || items.length === 0) return null;
                  return (
                    <div
                      key={category}
                      style={{
                        fontSize: `${customFontSize}px`,
                        lineHeight: "1.4",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "600",
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
        }

        // Paragraph mode (string)
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
              {section.replace(/([A-Z])/g, " $1").toUpperCase()}
            </h2>
            <p
              style={{
                fontSize: `${customFontSize}px`,
                lineHeight: "1.5",
                margin: 0,
              }}
            >
              {renderFormattedText(data[section])}
            </p>
          </div>
        );
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
            fontSize: "28px",
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
            fontSize: "10.5px",
            marginTop: "4px",
          }}
        >
          {data.personal.location && (
            <div
              style={{
                display: "inline-flex",
                gap: "3px",
                alignItems: "center",
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
              fontSize: "10.5px",
              marginTop: "3px",
            }}
          >
            {data.personal.website && (
              <div
                style={{
                  display: "inline-flex",
                  gap: "3px",
                  alignItems: "center",
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
                  <div key={key} style={{ display: "inline-flex", gap: "3px" }}>
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
