"use client";

import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

export default function ResumePreview({ data }: any) {
  // -------------------------------
  // Render formatted text (bold, italic, underline, color)
  // -------------------------------
  const renderFormattedText = (text: string) => {
    if (!text) return null;

    let formatted = text
      .replace(
        /<span style="color:(#[0-9a-fA-F]{6})">(.+?)<\/span>/g,
        '<span style="color:$1">$2</span>'
      )
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
      .replace(/__(.+?)__/g, "<u>$1</u>");

    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  // -------------------------------
  // Dynamic font size
  // -------------------------------
  const getFontSize = (field: string, section?: string, id?: number) => {
    if (section === "personal") {
      return data.personalFontSizes?.[field] || "10.5";
    } else if (section === "experience" && id) {
      return (
        data.experienceFieldFontSizes?.[`${id}-${field}`] ||
        data.experienceFontSize ||
        "11"
      );
    } else if (section === "projects" && id) {
      return (
        data.projectFieldFontSizes?.[`${id}-${field}`] ||
        data.projectsFontSize ||
        "11"
      );
    } else if (section === "education" && id) {
      return (
        data.educationFieldFontSizes?.[`${id}-${field}`] ||
        data.educationFontSize ||
        "11"
      );
    }
    return data?.[`${section}FontSize`] || "11";
  };

  // -------------------------------
  // Section Order
  // -------------------------------
  const sectionOrder = data.sectionOrder || [
    "personal",
    "summary",
    "skills",
    "experience",
    "projects",
    "education",
  ];

  // -------------------------------
  // Render Each Section
  // -------------------------------
  const renderSection = (section: string) => {
    switch (section) {
      /*-------------------------------------------*/
      /* SUMMARY */
      /*-------------------------------------------*/
      case "summary":
        if (!data.summary?.trim()) return null;
        const summaryFontSize = getFontSize("summary", "summary");

        return (
          <div style={{ marginBottom: "4px" }}>
            <h2
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                marginBottom: "2px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Summary
            </h2>

            <p
              style={{
                fontSize: `${summaryFontSize}px`,
                lineHeight: "1.3",
                margin: 0,
              }}
            >
              {renderFormattedText(data.summary)}
            </p>
          </div>
        );

      /*-------------------------------------------*/
      /* SKILLS */
      /*-------------------------------------------*/
      case "skills":
        if (!data.skills || Object.keys(data.skills).length === 0) return null;

        const hasSkills = Object.values(data.skills).some(
          (items: any) => items?.length > 0
        );
        if (!hasSkills) return null;

        const skillsFontSize = getFontSize("skills", "skills");

        return (
          <div style={{ marginBottom: "4px" }}>
            <h2
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                marginBottom: "2px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Skills
            </h2>

            {Object.entries(data.skills).map(([cat, items]: any) => {
              if (!items?.length) return null;

              return (
                <p
                  key={cat}
                  style={{
                    fontSize: `${skillsFontSize}px`,
                    margin: 0,
                    lineHeight: "1.3",
                  }}
                >
                  <strong>{cat.replace(/([A-Z])/g, " $1")}:</strong>{" "}
                  {items.join(", ")}
                </p>
              );
            })}
          </div>
        );

      /*-------------------------------------------*/
      /* EXPERIENCE */
      /*-------------------------------------------*/
      case "experience":
        if (!data.experience?.length) return null;

        const validExperiences = data.experience.filter(
          (exp: any) => exp.position || exp.company
        );
        if (!validExperiences.length) return null;

        return (
          <div style={{ marginBottom: "4px" }}>
            <h2
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                marginBottom: "2px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Experience
            </h2>

            {validExperiences.map((exp: any) => {
              const posSize = getFontSize("position", "experience", exp.id);
              const compSize = getFontSize("company", "experience", exp.id);
              const locSize = getFontSize("location", "experience", exp.id);
              const dateSize = getFontSize("startDate", "experience", exp.id);
              const bulletSize = data.experienceFontSize || "11";

              return (
                <div key={exp.id} style={{ marginBottom: "4px" }}>
                  {/* Title + Dates */}
                  {(exp.position || exp.startDate) && (
                    <div
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: `${posSize}px` }}>
                        {exp.position}
                      </span>

                      <span style={{ fontSize: `${dateSize}px` }}>
                        {exp.startDate}
                        {exp.startDate && exp.endDate && " – "}
                        {exp.endDate}
                      </span>
                    </div>
                  )}

                  {/* Company + Location */}
                  {(exp.company || exp.location) && (
                    <div
                      style={{
                        color: "#555",
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "1px",
                      }}
                    >
                      <span style={{ fontSize: `${compSize}px` }}>
                        {exp.company}
                      </span>
                      <span style={{ fontSize: `${locSize}px` }}>
                        {exp.location}
                      </span>
                    </div>
                  )}

                  {/* Bullets */}
                  {exp.bullets?.map(
                    (b: string, i: number) =>
                      b.trim() && (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            gap: "6px",
                            fontSize: `${bulletSize}px`,
                            lineHeight: "1.3",
                          }}
                        >
                          <span>{exp.bulletStyle || "•"}</span>
                          <span>{renderFormattedText(b)}</span>
                        </div>
                      )
                  )}
                </div>
              );
            })}
          </div>
        );

      /*-------------------------------------------*/
      /* PROJECTS */
      /*-------------------------------------------*/
      case "projects":
        if (!data.projects?.length) return null;

        const validProjects = data.projects.filter(
          (p: any) => p.title || p.description
        );
        if (!validProjects.length) return null;

        return (
          <div style={{ marginBottom: "4px" }}>
            <h2
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                marginBottom: "2px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Projects
            </h2>

            {validProjects.map((proj: any) => {
              const titleSize = getFontSize("title", "projects", proj.id);
              const projSize = data.projectsFontSize || "11";

              return (
                <div key={proj.id} style={{ marginBottom: "4px" }}>
                  {/* Title + Tech */}
                  <div
                    style={{
                      fontWeight: "bold",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: `${titleSize}px` }}>
                      {proj.title}
                    </span>

                    {proj.technologies?.length > 0 && (
                      <span
                        style={{ fontSize: `${projSize}px`, color: "#555" }}
                      >
                        {proj.technologies.join(", ")}
                      </span>
                    )}
                  </div>

                  {/* Type */}
                  {proj.type && (
                    <p
                      style={{
                        fontSize: `${projSize - 1}px`,
                        color: "#666",
                        margin: 0,
                      }}
                    >
                      {proj.type}
                    </p>
                  )}

                  {/* Description */}
                  {proj.description && (
                    <p
                      style={{
                        fontSize: `${projSize}px`,
                        margin: 0,
                        lineHeight: "1.3",
                      }}
                    >
                      {renderFormattedText(proj.description)}
                    </p>
                  )}

                  {/* Impact */}
                  {proj.impact && (
                    <p
                      style={{
                        fontSize: `${projSize}px`,
                        margin: 0,
                        lineHeight: "1.3",
                      }}
                    >
                      {renderFormattedText(proj.impact)}
                    </p>
                  )}

                  {/* Bullets */}
                  {proj.bullets?.map(
                    (b: string, i: number) =>
                      b.trim() && (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            gap: "6px",
                            fontSize: `${projSize}px`,
                          }}
                        >
                          <span>{proj.bulletStyle || "•"}</span>
                          <span>{renderFormattedText(b)}</span>
                        </div>
                      )
                  )}

                  {/* Link */}
                  {proj.link && (
                    <p
                      style={{
                        fontSize: `${projSize - 1}px`,
                        color: "#0066cc",
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
        );

      /*-------------------------------------------*/
      /* EDUCATION */
      /*-------------------------------------------*/
      case "education":
        if (!data.education?.length) return null;

        const validEducation = data.education.filter(
          (e: any) => e.school || e.degree
        );
        if (!validEducation.length) return null;

        return (
          <div style={{ marginBottom: "4px" }}>
            <h2
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                marginBottom: "2px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Education
            </h2>

            {validEducation.map((edu: any) => {
              const schoolSize = getFontSize("school", "education", edu.id);
              const degreeSize = getFontSize("degree", "education", edu.id);
              const gradSize = getFontSize(
                "graduationDate",
                "education",
                edu.id
              );
              const eduSize = data.educationFontSize || "11";

              return (
                <div key={edu.id} style={{ marginBottom: "4px" }}>
                  {/* School + Grad Date */}
                  <div
                    style={{
                      fontWeight: "bold",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: `${schoolSize}px` }}>
                      {edu.school}
                    </span>
                    <span style={{ fontSize: `${gradSize}px` }}>
                      {edu.graduationDate}
                    </span>
                  </div>

                  {edu.degree && (
                    <div
                      style={{
                        fontSize: `${degreeSize}px`,
                        color: "#555",
                      }}
                    >
                      {edu.degree}
                    </div>
                  )}

                  {edu.minor && (
                    <div
                      style={{
                        fontSize: `${eduSize - 1}px`,
                        color: "#555",
                      }}
                    >
                      Minor: {edu.minor}
                    </div>
                  )}

                  {edu.location && (
                    <div
                      style={{
                        fontSize: `${eduSize - 1}px`,
                        color: "#555",
                      }}
                    >
                      {edu.location}
                    </div>
                  )}

                  {edu.gpa && (
                    <div
                      style={{
                        fontSize: `${eduSize - 1}px`,
                        color: "#555",
                      }}
                    >
                      <strong>GPA: {edu.gpa}</strong>
                    </div>
                  )}

                  {edu.honors && (
                    <p
                      style={{
                        fontSize: `${eduSize}px`,
                        lineHeight: "1.3",
                        margin: 0,
                      }}
                    >
                      {renderFormattedText(edu.honors)}
                    </p>
                  )}

                  {edu.description && (
                    <p
                      style={{
                        fontSize: `${eduSize}px`,
                        lineHeight: "1.3",
                        margin: 0,
                      }}
                    >
                      {renderFormattedText(edu.description)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        );

      /*-------------------------------------------*/
      /* CUSTOM SECTIONS */
      /*-------------------------------------------*/
      default:
        const sectionContent = data[section];

        if (!sectionContent) return null;

        const customSize = getFontSize(section);

        // CATEGORY MODE
        if (
          typeof sectionContent === "object" &&
          !Array.isArray(sectionContent)
        ) {
          const hasContent = Object.values(sectionContent).some(
            (c: any) => c?.length
          );
          if (!hasContent) return null;

          return (
            <div style={{ marginBottom: "4px" }}>
              <h2
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginBottom: "2px",
                  textTransform: "uppercase",
                }}
              >
                {section.replace(/([A-Z])/g, " $1")}
              </h2>

              {Object.entries(sectionContent).map(([cat, arr]: any) => {
                if (!arr?.length) return null;

                return (
                  <p
                    key={cat}
                    style={{
                      fontSize: `${customSize}px`,
                      lineHeight: "1.3",
                      margin: 0,
                    }}
                  >
                    <strong>{cat}:</strong> {arr.join(", ")}
                  </p>
                );
              })}
            </div>
          );
        }

        // PARAGRAPH MODE
        return (
          <div style={{ marginBottom: "4px" }}>
            <h2
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                textTransform: "uppercase",
                marginBottom: "2px",
              }}
            >
              {section.replace(/([A-Z])/g, " $1")}
            </h2>
            <p
              style={{
                fontSize: `${customSize}px`,
                lineHeight: "1.3",
                margin: 0,
              }}
            >
              {renderFormattedText(sectionContent)}
            </p>
          </div>
        );
    }
  };

  // -------------------------------------------------------
  // MAIN RENDER — VERY NARROW MARGINS (PDF OPTIMIZED)
  // -------------------------------------------------------
  return (
    <div
      className="font-serif resume-print-area"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "4mm 6mm", // REDUCED MARGINS
        backgroundColor: "#ffffff",
        color: "#000",
        fontFamily: "Georgia, serif",
        fontSize: "11px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* ---------------------- */}
      {/* PERSONAL HEADER */}
      {/* ---------------------- */}
      <div style={{ textAlign: "center", marginBottom: "4px" }}>
        <h1
          style={{
            fontSize: `${getFontSize("name", "personal")}px`,
            fontWeight: "bold",
            margin: 0,
          }}
        >
          {data.personal.name || "Your Name"}
        </h1>

        {/* Row 1 — Location / Phone / Email */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "2px",
          }}
        >
          {/* LOCATION */}
          {data.personal.location && (
            <span
              style={{
                fontSize: `${getFontSize("location", "personal")}px`,
                display: "inline-flex",
                gap: "3px",
                alignItems: "center",
              }}
            >
              {data.iconVisibility?.location !== false && <MapPin size={10} />}
              {data.personal.location}
            </span>
          )}

          {/* PHONE */}
          {data.personal.phone && (
            <span
              style={{
                fontSize: `${getFontSize("phone", "personal")}px`,
                display: "inline-flex",
                gap: "3px",
                alignItems: "center",
              }}
            >
              {data.iconVisibility?.phone !== false && <Phone size={10} />}
              {data.personal.phone}
            </span>
          )}

          {/* EMAIL */}
          {data.personal.email && (
            <span
              style={{
                fontSize: `${getFontSize("email", "personal")}px`,
                display: "inline-flex",
                gap: "3px",
                alignItems: "center",
              }}
            >
              {data.iconVisibility?.email !== false && <Mail size={10} />}
              {data.personal.email}
            </span>
          )}
        </div>

        {/* Row 2 — Website / LinkedIn / GitHub */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "2px",
          }}
        >
          {/* WEBSITE */}
          {data.personal.website && (
            <span
              style={{
                fontSize: `${getFontSize("website", "personal")}px`,
                display: "inline-flex",
                gap: "3px",
                alignItems: "center",
              }}
            >
              {data.iconVisibility?.website !== false &&
                data.linkDisplay?.website !== "text" && <Globe size={10} />}

              {(data.linkDisplay?.website === "text" ||
                data.linkDisplay?.website === "both") &&
                data.personal.website}
            </span>
          )}

          {/* LINKEDIN */}
          {data.personal.linkedin && (
            <span
              style={{
                fontSize: `${getFontSize("linkedin", "personal")}px`,
                display: "inline-flex",
                gap: "3px",
                alignItems: "center",
              }}
            >
              {data.iconVisibility?.linkedin !== false &&
                data.linkDisplay?.linkedin !== "text" && <Linkedin size={10} />}

              {(data.linkDisplay?.linkedin === "text" ||
                data.linkDisplay?.linkedin === "both") &&
                data.personal.linkedin}
            </span>
          )}

          {/* GITHUB */}
          {data.personal.github && (
            <span
              style={{
                fontSize: `${getFontSize("github", "personal")}px`,
                display: "inline-flex",
                gap: "3px",
                alignItems: "center",
              }}
            >
              {data.iconVisibility?.github !== false &&
                data.linkDisplay?.github !== "text" && <Github size={10} />}

              {(data.linkDisplay?.github === "text" ||
                data.linkDisplay?.github === "both") &&
                data.personal.github}
            </span>
          )}

          {/* CUSTOM PERSONAL FIELDS */}
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
            .map(([key, value]: any) => (
              <span
                key={key}
                style={{
                  fontSize: `${getFontSize(key, "personal")}px`,
                  display: "inline-flex",
                  gap: "3px",
                }}
              >
                <strong>{key}:</strong> {value}
              </span>
            ))}
        </div>
      </div>

      {/* Divider */}
      <hr
        style={{
          margin: "4px 0",
          border: "none",
          borderTop: "1.2px solid #222",
        }}
      />

      {/* CONTENT */}
      {sectionOrder
        .filter((section: string) => section !== "personal")
        .map((section: string) => (
          <div key={section}>{renderSection(section)}</div>
        ))}
    </div>
  );
}
