import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import {
    Github,
    Linkedin,
    Mail,
    Code2,
    Database,
    Brain,
    Globe,
    Zap,
    Cpu,
} from "lucide-react";

export default function About() {
    const techStack = [
        {
            name: "React.js",
            role: "Frontend",
            icon: <Code2 className="w-5 h-5" />,
            color: "bg-blue-100 text-blue-700",
        },
        {
            name: "Node.js & Express",
            role: "API Gateway",
            icon: <Globe className="w-5 h-5" />,
            color: "bg-green-100 text-green-700",
        },
        {
            name: "FastAPI (Python)",
            role: "AI Microservice",
            icon: <Zap className="w-5 h-5" />,
            color: "bg-teal-100 text-teal-700",
        },
        {
            name: "Scikit-Learn",
            role: "ML Model",
            icon: <Brain className="w-5 h-5" />,
            color: "bg-orange-100 text-orange-700",
        },
        {
            name: "MongoDB",
            role: "Database",
            icon: <Database className="w-5 h-5" />,
            color: "bg-emerald-50 text-emerald-600",
        },
        {
            name: "Tailwind CSS",
            role: "UI Styling",
            icon: <Cpu className="w-5 h-5" />,
            color: "bg-cyan-100 text-cyan-700",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            <Navbar />

            {/* HERO SECTION */}
            <div className="bg-white border-b border-slate-200 py-16">
                <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                        About <span className="text-blue-600">Us</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        Empowering students with AI-driven career guidance using
                        a modern Microservices Architecture.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
                {/* MISSION SECTION */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-slate-800">
                            Our Mission
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            Many students at <strong>RUET</strong> and across
                            Bangladesh struggle to identify which career path
                            aligns best with their skills.
                            <br />
                            <br />
                            <strong>Smart Career Choice</strong> solves this by
                            using advanced Machine Learning trained on
                            real-world datasets (Kaggle) to analyze skills and
                            interests, providing a personalized roadmap and job
                            market insights.
                        </p>
                    </div>
                    <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100 flex items-center justify-center">
                        <Brain className="w-32 h-32 text-blue-200" />
                    </div>
                </section>

                {/* DEVELOPER TEAM SECTION */}
                <section>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-slate-800">
                            Meet the Developer
                        </h2>
                        <div className="h-1 w-20 bg-blue-600 mx-auto mt-4 rounded-full"></div>
                    </div>

                    <div className="flex justify-center">
                        <Card className="w-full max-w-md hover:shadow-xl transition-shadow border-0 ring-1 ring-slate-200 overflow-hidden group">
                            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                                    {/* PROFILE PICTURE PLACEHOLDER */}
                                    <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                                        <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center text-slate-400 font-bold text-2xl overflow-hidden">
                                            {/* Replace "RR" with <img src="..." /> if you have a photo */}
                                            <img src="https://avatars.githubusercontent.com/u/137736985?v=4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="pt-16 pb-8 text-center space-y-2">
                                <h3 className="text-2xl font-bold text-slate-800">
                                    Rizowan Mahmud Rafi
                                </h3>
                                <p className="text-blue-600 font-medium">
                                    Lead Developer
                                </p>
                                <div className="text-slate-500 text-sm space-y-1">
                                    <p>Student ID: 2103073</p>
                                    <p>Dept. of CSE, RUET</p>
                                </div>

                                <div className="flex justify-center gap-4 pt-4">
                                    <a
                                        href="https://github.com/rizowan-rafi"
                                        target="_blank"
                                        className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-700 transition-colors"
                                    >
                                        <Github className="w-5 h-5" />
                                    </a>
                                    <a
                                        href="#"
                                        className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 text-blue-700 transition-colors"
                                    >
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                    <a
                                        href="mailto:rizowanrafi71@gmail.com"
                                        className="p-2 bg-red-50 rounded-full hover:bg-red-100 text-red-600 transition-colors"
                                    >
                                        <Mail className="w-5 h-5" />
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* TECH STACK SECTION (Updated for FastAPI) */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">
                            Technical Architecture
                        </h2>
                        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase">
                            Microservices
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {techStack.map((tech, idx) => (
                            <div
                                key={idx}
                                className={`flex items-center gap-4 p-4 rounded-xl border border-transparent ${tech.color} bg-opacity-50 hover:bg-opacity-100 transition-all cursor-default`}
                            >
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    {tech.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">
                                        {tech.name}
                                    </h4>
                                    <p className="text-xs opacity-80 font-medium uppercase tracking-wide">
                                        {tech.role}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
