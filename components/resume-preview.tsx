"use client";

import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

export default function ResumePreview({ data }: any) {
  /* ---------------- Render formatted text safely ---------------- */
  const renderFormattedText = (value: any) => {
    if (value === null || value === undefined) return null;

    const text =
      typeof value === "string"
        ? value
        : Array.isArray(value)
        ? value.join(" ")
        : String(value);

    const trimmed = text.trim();
    if (!trimmed) return null;

    const formatted = trimmed
      .replace(
        /<span style="color:(#[0-9a-fA-F]{6})">(.+?)<\/span>/g,
        '<span style="color:$1">$2</span>'
      )
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
      .replace(/__(.+?)__/g, "<u>$1</u>");

    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  /* ---------------- Font size helpers ---------------- */
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

  /* ---------------- Section order ---------------- */
  const sectionOrder = data.sectionOrder || [
    "personal",
    "summary",
    "skills",
    "experience",
    "projects",
    "education",
  ];

  /* ---------------- Reusable layout row ---------------- */
  const layoutRow = (
    left: any,
    right: any,
    layout: "left" | "right",
    fontLeft: any,
    fontRight: any
  ) => {
    if (layout === "left") {
      return (
        <div
          style={{
            fontWeight: "bold",
            display: "flex",
            gap: "6px",
            marginBottom: "0px",
          }}
        >
          <span style={{ fontSize: `${fontLeft}px` }}>{left}</span>
          {right && (
            <>
              <span style={{ fontSize: `${fontLeft}px` }}>|</span>
              <span style={{ fontSize: `${fontRight}px` }}>{right}</span>
            </>
          )}
        </div>
      );
    }

    return (
      <div
        style={{
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0px",
        }}
      >
        <span style={{ fontSize: `${fontLeft}px` }}>{left}</span>
        <span style={{ fontSize: `${fontRight}px` }}>{right}</span>
      </div>
    );
  };

  /* ---------------- Renderers per section ---------------- */
  const renderSection = (section: string) => {
    switch (section) {
      case "summary": {
        if (!data.summary?.trim()) return null;
        const summaryFontSize = getFontSize("summary", "summary");

        return (
          <div style={{ marginBottom: "6px" }}>
            <h2
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                margin: "0 0 2px 0",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Summary
            </h2>

            <p
              style={{
                fontSize: `${summaryFontSize}px`,
                lineHeight: "1.25",
                margin: 0,
              }}
            >
              {renderFormattedText(data.summary)}
            </p>
          </div>
        );
      }

      case "skills": {
        if (!data.skills || Object.keys(data.skills).length === 0) return null;
        const hasSkills = Object.values(data.skills).some(
          (items: any) => items?.length > 0
        );
        if (!hasSkills) return null;
        const skillsFontSize = getFontSize("skills", "skills");

        return (
          <div style={{ marginBottom: "6px" }}>
            <h2
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                margin: "0 0 2px 0",
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
                    lineHeight: "1.25",
                  }}
                >
                  <strong>{cat.replace(/([A-Z])/g, " $1")}:</strong>{" "}
                  {items.join(", ")}
                </p>
              );
            })}
          </div>
        );
      }

      case "experience": {
        if (!data.experience?.length) return null;
        const valid = data.experience.filter(
          (exp: any) => exp.position || exp.company
        );
        if (!valid.length) return null;

        return (
          <div style={{ marginBottom: "6px" }}>
            <h2
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                margin: "0 0 2px 0",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Experience
            </h2>

            {valid.map((exp: any) => {
              const posSize = getFontSize("position", "experience", exp.id);
              const compSize = getFontSize("company", "experience", exp.id);
              const locSize = getFontSize("location", "experience", exp.id);
              const dateSize = getFontSize("startDate", "experience", exp.id);
              const bulletSize = data.experienceFontSize || "11";
              const layout = data?.dateLayout?.experience || "right";

              return (
                <div key={exp.id} style={{ marginBottom: "4px" }}>
                  {(exp.position || exp.startDate) &&
                    layoutRow(
                      exp.position,
                      `${exp.startDate}${
                        exp.startDate && exp.endDate ? " – " : ""
                      }${exp.endDate}`,
                      layout,
                      posSize,
                      dateSize
                    )}

                  {(exp.company || exp.location) && (
                    <div
                      style={{
                        color: "#555",
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "0 0 1px 0",
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

                  {exp.bullets?.map(
                    (b: string, i: number) =>
                      b.trim() && (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            gap: "6px",
                            fontSize: `${bulletSize}px`,
                            lineHeight: "1.25",
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
      }

      case "projects": {
        if (!data.projects?.length) return null;
        const valid = data.projects.filter(
          (p: any) => p.title || p.description
        );
        if (!valid.length) return null;

        return (
          <div style={{ marginBottom: "6px" }}>
            <h2
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                margin: "0 0 2px 0",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Projects
            </h2>

            {valid.map((proj: any) => {
              const titleSize = getFontSize("title", "projects", proj.id);
              const projSize = data.projectsFontSize || "11";
              const layout = data?.dateLayout?.projects || "right";

              return (
                <div key={proj.id} style={{ marginBottom: "4px" }}>
                  {layoutRow(
                    proj.title,
                    proj.technologies?.length
                      ? proj.technologies.join(", ")
                      : "",
                    layout,
                    titleSize,
                    projSize
                  )}

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

                  {proj.description && (
                    <p
                      style={{
                        fontSize: `${projSize}px`,
                        margin: 0,
                        lineHeight: "1.25",
                      }}
                    >
                      {renderFormattedText(proj.description)}
                    </p>
                  )}

                  {proj.impact && (
                    <p
                      style={{
                        fontSize: `${projSize}px`,
                        margin: 0,
                        lineHeight: "1.25",
                      }}
                    >
                      {renderFormattedText(proj.impact)}
                    </p>
                  )}

                  {proj.bullets?.map(
                    (b: string, i: number) =>
                      b.trim() && (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            gap: "6px",
                            fontSize: `${projSize}px`,
                            lineHeight: "1.25",
                          }}
                        >
                          <span>{proj.bulletStyle || "•"}</span>
                          <span>{renderFormattedText(b)}</span>
                        </div>
                      )
                  )}

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
      }

      case "education": {
        if (!data.education?.length) return null;
        const valid = data.education.filter((e: any) => e.school || e.degree);
        if (!valid.length) return null;

        return (
          <div style={{ marginBottom: "6px" }}>
            <h2
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                margin: "0 0 2px 0",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Education
            </h2>

            {valid.map((edu: any) => {
              const schoolSize = getFontSize("school", "education", edu.id);
              const degreeSize = getFontSize("degree", "education", edu.id);
              const gradSize = getFontSize(
                "graduationDate",
                "education",
                edu.id
              );
              const eduSize = data.educationFontSize || "11";
              const layout = data?.dateLayout?.education || "right";

              return (
                <div key={edu.id} style={{ marginBottom: "4px" }}>
                  {layoutRow(
                    edu.school,
                    edu.graduationDate,
                    layout,
                    schoolSize,
                    gradSize
                  )}

                  {edu.degree && (
                    <div style={{ fontSize: `${degreeSize}px`, color: "#555" }}>
                      {edu.degree}
                    </div>
                  )}

                  {edu.minor && (
                    <div
                      style={{ fontSize: `${eduSize - 1}px`, color: "#555" }}
                    >
                      Minor: {edu.minor}
                    </div>
                  )}

                  {edu.location && (
                    <div
                      style={{ fontSize: `${eduSize - 1}px`, color: "#555" }}
                    >
                      {edu.location}
                    </div>
                  )}

                  {edu.gpa && (
                    <div
                      style={{ fontSize: `${eduSize - 1}px`, color: "#555" }}
                    >
                      <strong>GPA: {edu.gpa}</strong>
                    </div>
                  )}

                  {edu.honors && (
                    <p
                      style={{
                        fontSize: `${eduSize}px`,
                        lineHeight: "1.25",
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
                        lineHeight: "1.25",
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
      }

      default: {
        const sectionContent = data[section];
        if (sectionContent === null || sectionContent === undefined)
          return null;

        const title = section.replace(/([A-Z])/g, " $1");
        const customSize = getFontSize(section);

        // Experience-style ARRAY custom section
        if (Array.isArray(sectionContent)) {
          if (!sectionContent.length) return null;
          const layout = data.customDateLayout?.[section] || "right";

          return (
            <div style={{ marginBottom: "6px" }}>
              <h2
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  margin: "0 0 2px 0",
                  textTransform: "uppercase",
                }}
              >
                {title}
              </h2>

              {sectionContent.map((item: any) => {
                const titleSize =
                  data.customFieldFontSizes?.[`${section}:${item.id}-title`] ||
                  customSize;
                const orgSize =
                  data.customFieldFontSizes?.[`${section}:${item.id}-org`] ||
                  customSize;
                const locSize =
                  data.customFieldFontSizes?.[
                    `${section}:${item.id}-location`
                  ] || customSize - 1;
                const dateSize =
                  data.customFieldFontSizes?.[
                    `${section}:${item.id}-startDate`
                  ] || customSize;

                return (
                  <div key={item.id} style={{ marginBottom: "4px" }}>
                    {(item.title || item.startDate) &&
                      layoutRow(
                        item.title,
                        `${item.startDate}${
                          item.startDate && item.endDate ? " – " : ""
                        }${item.endDate}`,
                        layout,
                        titleSize,
                        dateSize
                      )}

                    {(item.org || item.location) && (
                      <div
                        style={{
                          color: "#555",
                          display: "flex",
                          justifyContent: "space-between",
                          margin: "0 0 1px 0",
                        }}
                      >
                        <span style={{ fontSize: `${orgSize}px` }}>
                          {item.org}
                        </span>
                        <span style={{ fontSize: `${locSize}px` }}>
                          {item.location}
                        </span>
                      </div>
                    )}

                    {(item.bullets || []).map(
                      (b: string, i: number) =>
                        b?.trim() && (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              gap: "6px",
                              fontSize: `${customSize}px`,
                              lineHeight: "1.25",
                            }}
                          >
                            <span>{item.bulletStyle || "•"}</span>
                            <span>{renderFormattedText(b)}</span>
                          </div>
                        )
                    )}
                  </div>
                );
              })}
            </div>
          );
        }

        // CATEGORY MAP (legacy)
        if (typeof sectionContent === "object" && sectionContent !== null) {
          const hasContent = Object.values(sectionContent).some(
            (c: any) => c?.length
          );
          if (!hasContent) return null;

          return (
            <div style={{ marginBottom: "6px" }}>
              <h2
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  margin: "0 0 2px 0",
                  textTransform: "uppercase",
                }}
              >
                {title}
              </h2>

              {Object.entries(sectionContent).map(([cat, arr]: any) => {
                if (!arr?.length) return null;
                return (
                  <p
                    key={cat}
                    style={{
                      fontSize: `${customSize}px`,
                      lineHeight: "1.25",
                      margin: 0,
                    }}
                  >
                    <strong>{cat}:</strong>{" "}
                    {Array.isArray(arr) ? arr.join(", ") : arr}
                  </p>
                );
              })}
            </div>
          );
        }

        // PARAGRAPH
        if (typeof sectionContent === "string" && sectionContent.trim()) {
          return (
            <div style={{ marginBottom: "6px" }}>
              <h2
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  margin: "0 0 2px 0",
                }}
              >
                {title}
              </h2>
              <p
                style={{
                  fontSize: `${customSize}px`,
                  lineHeight: "1.25",
                  margin: 0,
                }}
              >
                {renderFormattedText(sectionContent)}
              </p>
            </div>
          );
        }

        return null;
      }
    }
  };

  /* ---------------- MAIN RENDER (tight spacing, no divider) ---------------- */
  return (
    <div
      className="font-serif resume-print-area"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "6mm 8mm",
        backgroundColor: "#ffffff",
        color: "#000",
        fontFamily: "Georgia, serif",
        fontSize: "11px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "6px" }}>
        <h1
          style={{
            fontSize: `${getFontSize("name", "personal")}px`,
            fontWeight: "bold",
            margin: 0,
          }}
        >
          {data.personal.name || "Your Name"}
        </h1>

        {/* Row 1 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "2px",
          }}
        >
          {data.personal.location && (
            <span
              className="inline-icon"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
                fontSize: `${getFontSize("location", "personal")}px`,
              }}
            >
              {data.iconVisibility?.location !== false && <MapPin size={10} />}
              {data.personal.location}
            </span>
          )}

          {data.personal.phone && (
            <span
              className="inline-icon"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
                fontSize: `${getFontSize("phone", "personal")}px`,
              }}
            >
              {data.iconVisibility?.phone !== false && <Phone size={10} />}
              {data.personal.phone}
            </span>
          )}

          {data.personal.email && (
            <span
              className="inline-icon"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
                fontSize: `${getFontSize("email", "personal")}px`,
              }}
            >
              {data.iconVisibility?.email !== false && <Mail size={10} />}
              {data.personal.email}
            </span>
          )}
        </div>

        {/* Row 2 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "2px",
          }}
        >
          {data.personal.website && (
            <span
              className="inline-icon"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
                fontSize: `${getFontSize("website", "personal")}px`,
              }}
            >
              {data.iconVisibility?.website !== false &&
                data.linkDisplay?.website !== "text" && <Globe size={10} />}
              {(data.linkDisplay?.website === "text" ||
                data.linkDisplay?.website === "both") &&
                data.personal.website}
            </span>
          )}

          {data.personal.linkedin && (
            <span
              className="inline-icon"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
                fontSize: `${getFontSize("linkedin", "personal")}px`,
              }}
            >
              {data.iconVisibility?.linkedin !== false &&
                data.linkDisplay?.linkedin !== "text" && <Linkedin size={10} />}
              {(data.linkDisplay?.linkedin === "text" ||
                data.linkDisplay?.linkedin === "both") &&
                data.personal.linkedin}
            </span>
          )}

          {data.personal.github && (
            <span
              className="inline-icon"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
                fontSize: `${getFontSize("github", "personal")}px`,
              }}
            >
              {data.iconVisibility?.github !== false &&
                data.linkDisplay?.github !== "text" && <Github size={10} />}
              {(data.linkDisplay?.github === "text" ||
                data.linkDisplay?.github === "both") &&
                data.personal.github}
            </span>
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
            .map(([key, value]: any) => (
              <span
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  fontSize: `${getFontSize(key, "personal")}px`,
                }}
              >
                <strong>{key}:</strong> {value}
              </span>
            ))}
        </div>
      </div>

      {/* No divider line */}

      {/* Sections */}
      {sectionOrder
        .filter((section: string) => section !== "personal")
        .map((section: string) => (
          <div key={section}>{renderSection(section)}</div>
        ))}
    </div>
  );
}