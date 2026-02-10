import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
    Download,
    FileText,
    Plus,
    Trash2,
    Github,
    Linkedin,
    Globe,
    Mail,
    Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/NavBar";

// --- RESUME PREVIEW (Classic Academic Style) ---
const ResumePreview = ({ data, targetRef }) => {
    return (
        <div className="w-full overflow-auto bg-slate-100 p-8 flex justify-center">
            {/* A4 Paper Container */}
            <div
                ref={targetRef}
                className="bg-white w-[210mm] min-h-[297mm] shadow-2xl p-[15mm] text-black print:shadow-none print:w-full print:h-full print:m-0"
                style={{ fontFamily: '"Times New Roman", Times, serif' }} // FORCING SERIF FONT
            >
                {/* HEADER */}
                <header className="text-center mb-6">
                    <h1 className="text-3xl font-bold uppercase tracking-wide mb-1">
                        {data.personal.fullName || "Your Name"}
                    </h1>
                    <div className="text-[11pt] space-y-1">
                        {data.personal.location && (
                            <span>{data.personal.location}</span>
                        )}
                        <div className="flex justify-center gap-3 items-center">
                            {data.personal.phone && (
                                <span>{data.personal.phone}</span>
                            )}
                            {data.personal.email && (
                                <>
                                    <span>|</span>
                                    <a
                                        href={`mailto:${data.personal.email}`}
                                        className="text-black no-underline"
                                    >
                                        {data.personal.email}
                                    </a>
                                </>
                            )}
                        </div>
                        <div className="flex justify-center gap-3 items-center">
                            {data.personal.linkedin && (
                                <a
                                    href={data.personal.linkedin}
                                    className="text-black no-underline"
                                >
                                    LinkedIn
                                </a>
                            )}
                            {data.personal.github && (
                                <>
                                    <span>|</span>{" "}
                                    <a
                                        href={data.personal.github}
                                        className="text-black no-underline"
                                    >
                                        GitHub
                                    </a>
                                </>
                            )}
                            {data.personal.portfolio && (
                                <>
                                    <span>|</span>{" "}
                                    <a
                                        href={data.personal.portfolio}
                                        className="text-black no-underline"
                                    >
                                        Portfolio
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* SECTION: PROFILE (Only show if not empty) */}
                {data.summary && (
                    <section className="mb-4">
                        <h3 className="text-[11pt] font-bold uppercase border-b border-black mb-2">
                            Profile
                        </h3>
                        <p className="text-[11pt] leading-relaxed text-justify">
                            {data.summary}
                        </p>
                    </section>
                )}

                {/* SECTION: EDUCATION */}
                {data.education.length > 0 && (
                    <section className="mb-4">
                        <h3 className="text-[11pt] font-bold uppercase border-b border-black mb-2">
                            Education
                        </h3>
                        <div className="space-y-3">
                            {data.education.map((edu, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-baseline">
                                        <h4 className="font-bold text-[11pt]">
                                            {edu.school || "University Name"}
                                        </h4>
                                        <span className="text-[11pt]">
                                            {edu.location}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-baseline italic">
                                        <span className="text-[11pt]">
                                            {edu.degree || "Degree Name"}
                                        </span>
                                        <span className="text-[11pt]">
                                            {edu.year || "Year"}
                                        </span>
                                    </div>
                                    {edu.grade && (
                                        <div className="text-[11pt] mt-0.5">
                                            <span className="font-semibold">
                                                CGPA:
                                            </span>{" "}
                                            {edu.grade}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* SECTION: TECHNICAL SKILLS */}
                {data.skills && (
                    <section className="mb-4">
                        <h3 className="text-[11pt] font-bold uppercase border-b border-black mb-2">
                            Technical Skills
                        </h3>
                        {/* Rendering formatted text line by line */}
                        <div className="text-[11pt] leading-snug">
                            <ul className="list-disc ml-5 space-y-1">
                                {data.skills
                                    .split("\n")
                                    .map(
                                        (line, i) =>
                                            line.trim() && (
                                                <li key={i}>{line}</li>
                                            )
                                    )}
                            </ul>
                        </div>
                    </section>
                )}

                {/* SECTION: EXPERIENCE */}
                {data.experience.length > 0 && (
                    <section className="mb-4">
                        <h3 className="text-[11pt] font-bold uppercase border-b border-black mb-2">
                            Experience
                        </h3>
                        <div className="space-y-4">
                            {data.experience.map((exp, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-baseline">
                                        <h4 className="font-bold text-[11pt]">
                                            {exp.company || "Company Name"}
                                        </h4>
                                        <span className="text-[11pt] italic">
                                            {exp.role || "Role"}
                                        </span>
                                    </div>
                                    {/* We are hiding the date for now to match the style of "Tech Team Member" on right */}
                                    {/* If you want date, uncomment below */}
                                    {/* <div className="text-right text-xs">{exp.date}</div> */}

                                    <ul className="list-disc ml-5 mt-1 text-[11pt] leading-snug text-justify space-y-1">
                                        {exp.description
                                            .split("\n")
                                            .map(
                                                (point, i) =>
                                                    point.trim() && (
                                                        <li key={i}>{point}</li>
                                                    )
                                            )}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* SECTION: KEY PROJECTS */}
                {data.projects.length > 0 && (
                    <section className="mb-4">
                        <h3 className="text-[11pt] font-bold uppercase border-b border-black mb-2">
                            Key Projects
                        </h3>
                        <div className="space-y-4">
                            {data.projects.map((proj, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-baseline">
                                        <h4 className="font-bold text-[11pt]">
                                            {proj.name || "Project Name"}
                                        </h4>
                                        {proj.link && (
                                            <span className="text-[11pt]">
                                                <span className="font-bold mr-1">
                                                    Live Link:
                                                </span>
                                                <a
                                                    href={proj.link}
                                                    className="text-black no-underline"
                                                >
                                                    {proj.link.replace(
                                                        "https://",
                                                        ""
                                                    )}
                                                </a>
                                            </span>
                                        )}
                                    </div>
                                    <ul className="list-disc ml-5 mt-1 text-[11pt] leading-snug text-justify space-y-1">
                                        {proj.description
                                            .split("\n")
                                            .map(
                                                (point, i) =>
                                                    point.trim() && (
                                                        <li key={i}>{point}</li>
                                                    )
                                            )}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
export default function ResumeBuilder() {
    const printRef = useRef();

    // State for Resume Data
    const [data, setData] = useState({
        personal: {
            fullName: "Rizowan Mahmud Rafi",
            email: "rizowanrafi71@gmail.com",
            phone: "+880-1403498822",
            location: "Jashore, Bangladesh",
            linkedin: "linkedin.com/in/rizowan",
            github: "github.com/rizowan",
            portfolio: "portfolio.com",
        },
        summary:
            "Passionate MERN Stack Developer with a solid foundation in building full-stack web applications. Proficient in creating responsive user interfaces with React.js and robust server-side logic with Node.js.",
        education: [
            {
                school: "Rajshahi University of Engineering and Technology",
                location: "Rajshahi, Bangladesh",
                degree: "Bachelor of Engineering in CSE",
                year: "2022 – Present",
                grade: "3.50/4.00",
            },
        ],
        experience: [
            {
                company: "RUET Career Club",
                role: "Tech Team Member",
                date: "",
                description:
                    "Responsible for maintaining and updating the official RUET Career Club website.\nImplemented feature enhancements and UI improvements using React and Next.js.",
            },
        ],
        projects: [
            {
                name: "MedMarket",
                link: "https://medmarket-cd00e.web.app",
                description:
                    "Online medical marketplace enabling users to buy and sell healthcare products.\nSecure authentication system with role-based access control.",
            },
        ],
        skills: "Languages: JavaScript, Python, C++\nTechnologies: React, Node.js, Express, MongoDB, Next.js\nTools: Git, Docker, Firebase",
    });

    // Print Handler
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `${data.personal.fullName}_Resume`,
    });

    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            personal: { ...prev.personal, [name]: value },
        }));
    };

    const updateArrayItem = (section, index, field, value) => {
        const newSection = [...data[section]];
        newSection[index][field] = value;
        setData((prev) => ({ ...prev, [section]: newSection }));
    };

    const addItem = (section, template) => {
        setData((prev) => ({
            ...prev,
            [section]: [...prev[section], template],
        }));
    };

    const removeItem = (section, index) => {
        const newSection = data[section].filter((_, i) => i !== index);
        setData((prev) => ({ ...prev, [section]: newSection }));
    };

    return (
        <>
            <div className="mb-5">
                <Navbar />
            </div>
            <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row h-screen overflow-hidden">
                {/* --- LEFT SIDE: FORM EDITOR --- */}
                <div className="w-full md:w-2/5 h-full overflow-y-auto border-r border-slate-200 bg-white p-6 shadow-xl z-10 scrollbar-thin">
                    <div className="flex items-center justify-between mb-6 sticky top-0 bg-white/95 backdrop-blur py-2 z-20 border-b">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />{" "}
                            Resume Editor
                        </h2>
                        <Button
                            onClick={handlePrint}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                        >
                            <Download className="w-4 h-4" /> Download PDF
                        </Button>
                    </div>

                    <div className="space-y-6 pb-20">
                        {/* Personal Info */}
                        <Card>
                            <CardHeader className="py-3 bg-slate-50">
                                <CardTitle className="text-xs uppercase tracking-wide text-slate-500 font-bold">
                                    Personal Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-4">
                                <div>
                                    <Label>Full Name</Label>
                                    <Input
                                        name="fullName"
                                        value={data.personal.fullName}
                                        onChange={handlePersonalChange}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label>Email</Label>
                                        <Input
                                            name="email"
                                            value={data.personal.email}
                                            onChange={handlePersonalChange}
                                        />
                                    </div>
                                    <div>
                                        <Label>Phone</Label>
                                        <Input
                                            name="phone"
                                            value={data.personal.phone}
                                            onChange={handlePersonalChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>Location</Label>
                                    <Input
                                        name="location"
                                        value={data.personal.location}
                                        onChange={handlePersonalChange}
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <Label>LinkedIn</Label>
                                        <Input
                                            name="linkedin"
                                            value={data.personal.linkedin}
                                            onChange={handlePersonalChange}
                                            placeholder="URL"
                                        />
                                    </div>
                                    <div>
                                        <Label>GitHub</Label>
                                        <Input
                                            name="github"
                                            value={data.personal.github}
                                            onChange={handlePersonalChange}
                                            placeholder="URL"
                                        />
                                    </div>
                                    <div>
                                        <Label>Portfolio</Label>
                                        <Input
                                            name="portfolio"
                                            value={data.personal.portfolio}
                                            onChange={handlePersonalChange}
                                            placeholder="URL"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Summary */}
                        <Card>
                            <CardHeader className="py-3 bg-slate-50">
                                <CardTitle className="text-xs uppercase tracking-wide text-slate-500 font-bold">
                                    Profile Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <Textarea
                                    value={data.summary}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            summary: e.target.value,
                                        })
                                    }
                                    className="h-24"
                                />
                            </CardContent>
                        </Card>

                        {/* Education */}
                        <Card>
                            <CardHeader className="py-3 bg-slate-50 flex flex-row items-center justify-between">
                                <CardTitle className="text-xs uppercase tracking-wide text-slate-500 font-bold">
                                    Education
                                </CardTitle>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-6 w-6"
                                    onClick={() =>
                                        addItem("education", {
                                            school: "",
                                            location: "",
                                            degree: "",
                                            year: "",
                                            grade: "",
                                        })
                                    }
                                >
                                    <Plus className="w-3 h-3" />
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                {data.education.map((edu, index) => (
                                    <div
                                        key={index}
                                        className="p-3 border rounded bg-white relative group"
                                    >
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="absolute top-1 right-1 h-6 w-6 text-red-500 opacity-50 hover:opacity-100"
                                            onClick={() =>
                                                removeItem("education", index)
                                            }
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                        <div className="space-y-2">
                                            <Input
                                                value={edu.school}
                                                onChange={(e) =>
                                                    updateArrayItem(
                                                        "education",
                                                        index,
                                                        "school",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="University Name"
                                                className="font-bold"
                                            />
                                            <Input
                                                value={edu.location}
                                                onChange={(e) =>
                                                    updateArrayItem(
                                                        "education",
                                                        index,
                                                        "location",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Location (e.g. Rajshahi, BD)"
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input
                                                    value={edu.degree}
                                                    onChange={(e) =>
                                                        updateArrayItem(
                                                            "education",
                                                            index,
                                                            "degree",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Degree"
                                                />
                                                <Input
                                                    value={edu.year}
                                                    onChange={(e) =>
                                                        updateArrayItem(
                                                            "education",
                                                            index,
                                                            "year",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Year"
                                                />
                                            </div>
                                            <Input
                                                value={edu.grade}
                                                onChange={(e) =>
                                                    updateArrayItem(
                                                        "education",
                                                        index,
                                                        "grade",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="CGPA (e.g. 3.50/4.00)"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Technical Skills */}
                        <Card>
                            <CardHeader className="py-3 bg-slate-50">
                                <CardTitle className="text-xs uppercase tracking-wide text-slate-500 font-bold">
                                    Technical Skills
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <p className="text-xs text-slate-500 mb-2">
                                    Tip: Use new lines for bullet points.
                                </p>
                                <Textarea
                                    value={data.skills}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            skills: e.target.value,
                                        })
                                    }
                                    className="h-32 font-mono text-sm"
                                    placeholder="Languages: C++, Java&#10;Web: React, Node"
                                />
                            </CardContent>
                        </Card>

                        {/* Experience */}
                        <Card>
                            <CardHeader className="py-3 bg-slate-50 flex flex-row items-center justify-between">
                                <CardTitle className="text-xs uppercase tracking-wide text-slate-500 font-bold">
                                    Experience
                                </CardTitle>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-6 w-6"
                                    onClick={() =>
                                        addItem("experience", {
                                            company: "",
                                            role: "",
                                            description: "",
                                        })
                                    }
                                >
                                    <Plus className="w-3 h-3" />
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                {data.experience.map((exp, index) => (
                                    <div
                                        key={index}
                                        className="p-3 border rounded bg-white relative"
                                    >
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="absolute top-1 right-1 h-6 w-6 text-red-500"
                                            onClick={() =>
                                                removeItem("experience", index)
                                            }
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input
                                                    value={exp.company}
                                                    onChange={(e) =>
                                                        updateArrayItem(
                                                            "experience",
                                                            index,
                                                            "company",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Company/Club"
                                                    className="font-bold"
                                                />
                                                <Input
                                                    value={exp.role}
                                                    onChange={(e) =>
                                                        updateArrayItem(
                                                            "experience",
                                                            index,
                                                            "role",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Role (e.g. Member)"
                                                />
                                            </div>
                                            <Textarea
                                                value={exp.description}
                                                onChange={(e) =>
                                                    updateArrayItem(
                                                        "experience",
                                                        index,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Bullet points (one per line)..."
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Key Projects (NEW SECTION) */}
                        <Card>
                            <CardHeader className="py-3 bg-slate-50 flex flex-row items-center justify-between">
                                <CardTitle className="text-xs uppercase tracking-wide text-slate-500 font-bold">
                                    Key Projects
                                </CardTitle>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-6 w-6"
                                    onClick={() =>
                                        addItem("projects", {
                                            name: "",
                                            link: "",
                                            description: "",
                                        })
                                    }
                                >
                                    <Plus className="w-3 h-3" />
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                {data.projects.map((proj, index) => (
                                    <div
                                        key={index}
                                        className="p-3 border rounded bg-white relative"
                                    >
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="absolute top-1 right-1 h-6 w-6 text-red-500"
                                            onClick={() =>
                                                removeItem("projects", index)
                                            }
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input
                                                    value={proj.name}
                                                    onChange={(e) =>
                                                        updateArrayItem(
                                                            "projects",
                                                            index,
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Project Name"
                                                    className="font-bold"
                                                />
                                                <Input
                                                    value={proj.link}
                                                    onChange={(e) =>
                                                        updateArrayItem(
                                                            "projects",
                                                            index,
                                                            "link",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Live Link URL"
                                                />
                                            </div>
                                            <Textarea
                                                value={proj.description}
                                                onChange={(e) =>
                                                    updateArrayItem(
                                                        "projects",
                                                        index,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Description bullet points..."
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* --- RIGHT SIDE: PREVIEW --- */}
                <div className="hidden md:flex w-3/5 bg-slate-200 justify-center overflow-y-auto py-10">
                    <div className="scale-[0.9] origin-top">
                        <ResumePreview data={data} targetRef={printRef} />
                    </div>
                </div>

                {/* --- MOBILE PREVIEW BUTTON --- */}
                <div className="md:hidden p-4 border-t bg-white fixed bottom-0 w-full z-50">
                    <Button
                        className="w-full bg-blue-600"
                        onClick={handlePrint}
                    >
                        Download Resume PDF
                    </Button>
                </div>
            </div>
        </>
    );
}
