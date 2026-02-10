import { useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // You might need to create this or use standard textarea
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Loader2,
    Brain,
    CheckCircle,
    XCircle,
    BookOpen,
    Send,
} from "lucide-react";
import { toast } from "sonner";

export default function Interview() {
    const [step, setStep] = useState(1); // 1=Topic, 2=Exam, 3=Result
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({}); // Stores answers by index: { 0: "answer...", 1: "answer..." }
    const [result, setResult] = useState(null);

    // --- STEP 1: GET QUESTIONS ---
    const handleGetQuestions = async () => {
        if (!topic.trim()) return toast.error("Please enter a topic");

        setLoading(true);
        try {
            // Connect to your Python Backend
            const res = await axios.post(
                "http://localhost:8000/generate-questions",
                { topic }
            );

            if (res.data.questions && res.data.questions.length > 0) {
                setQuestions(res.data.questions);
                setStep(2);
                toast.success("Questions generated!");
            } else {
                toast.error("Could not generate questions. Try again.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to connect to AI server.");
        } finally {
            setLoading(false);
        }
    };

    // --- STEP 2: SUBMIT ANSWERS ---
    const handleSubmitExam = async () => {
        // Basic validation: Check if they answered at least one
        if (Object.keys(answers).length === 0) {
            return toast.warning("Please answer at least one question.");
        }

        setLoading(true);
        try {
            // Format data for backend
            const qa_list = questions.map((q, idx) => ({
                question: q,
                user_answer: answers[idx] || "No Answer Provided",
            }));

            const res = await axios.post(
                "http://localhost:8000/evaluate-interview",
                {
                    topic,
                    qa_list,
                }
            );

            setResult(res.data);
            setStep(3);
            toast.success("Evaluation complete!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to evaluate answers.");
        } finally {
            setLoading(false);
        }
    };

    // --- RESTART ---
    const handleReset = () => {
        setStep(1);
        setTopic("");
        setQuestions([]);
        setAnswers({});
        setResult(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 py-12">
                {/* HEADER AREA */}
                <div className="text-center mb-10">
                    <div className="bg-white border border-slate-200 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Brain className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                        AI Mock{" "}
                        <span className="text-blue-600">Interviewer</span>
                    </h1>
                    <p className="text-slate-500 mt-3 text-lg">
                        Practice technical questions and get instant feedback.
                    </p>
                </div>

                {/* === STEP 1: TOPIC INPUT === */}
                {step === 1 && (
                    <Card className="shadow-xl border-0 ring-1 ring-slate-200">
                        <CardContent className="pt-8 pb-8 px-6 md:px-10 text-center">
                            <label className="block text-base font-bold text-slate-700 mb-4">
                                What topic do you want to practice?
                            </label>

                            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                                <Input
                                    placeholder="e.g. React, Python, Data Structures..."
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="text-lg h-12 bg-slate-50 border-slate-200"
                                    onKeyDown={(e) =>
                                        e.key === "Enter" &&
                                        handleGetQuestions()
                                    }
                                />
                                <Button
                                    onClick={handleGetQuestions}
                                    disabled={loading}
                                    className="h-12 px-8 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin w-5 h-5" />
                                    ) : (
                                        "Start"
                                    )}
                                </Button>
                            </div>

                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                {[
                                    "JavaScript",
                                    "React",
                                    "Node.js",
                                    "Python",
                                    "SQL",
                                ].map((tag) => (
                                    <span
                                        key={tag}
                                        onClick={() => setTopic(tag)}
                                        className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* === STEP 2: QUESTIONS === */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-bold text-slate-800">
                                Topic: {topic}
                            </h2>
                            <span className="text-sm font-medium text-slate-500">
                                5 Questions
                            </span>
                        </div>

                        {questions.map((q, idx) => (
                            <Card
                                key={idx}
                                className="border-0 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition-shadow"
                            >
                                <CardHeader className="pb-2 bg-slate-50/50 border-b border-slate-100">
                                    <CardTitle className="text-base font-bold text-slate-800 flex gap-3">
                                        <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded flex items-center justify-center text-sm shrink-0">
                                            {idx + 1}
                                        </span>
                                        {q}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <textarea
                                        placeholder="Type your answer here..."
                                        className="w-full min-h-[100px] p-3 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 resize-y"
                                        value={answers[idx] || ""}
                                        onChange={(e) =>
                                            setAnswers({
                                                ...answers,
                                                [idx]: e.target.value,
                                            })
                                        }
                                    />
                                </CardContent>
                            </Card>
                        ))}

                        <Button
                            onClick={handleSubmitExam}
                            disabled={loading}
                            className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 shadow-xl shadow-green-200 mt-4"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />{" "}
                                    Analyzing Your Answers...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-2" /> Submit
                                    Interview
                                </>
                            )}
                        </Button>
                    </div>
                )}

                {/* === STEP 3: RESULTS === */}
                {step === 3 && result && (
                    <div className="space-y-8 animate-in zoom-in-95 duration-500">
                        {/* SCORE CARD */}
                        <Card
                            className={`border-0 shadow-2xl overflow-hidden ${
                                result.is_ready
                                    ? "bg-gradient-to-br from-green-50 to-white ring-1 ring-green-200"
                                    : "bg-gradient-to-br from-red-50 to-white ring-1 ring-red-200"
                            }`}
                        >
                            <CardContent className="pt-10 pb-10 text-center relative">
                                {/* Icon */}
                                <div
                                    className={`mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center ${
                                        result.is_ready
                                            ? "bg-green-100 text-green-600"
                                            : "bg-red-100 text-red-600"
                                    }`}
                                >
                                    {result.is_ready ? (
                                        <CheckCircle className="w-10 h-10" />
                                    ) : (
                                        <XCircle className="w-10 h-10" />
                                    )}
                                </div>

                                <h2
                                    className={`text-3xl font-black mb-2 ${
                                        result.is_ready
                                            ? "text-green-800"
                                            : "text-red-800"
                                    }`}
                                >
                                    {result.is_ready
                                        ? "You are Job Ready!"
                                        : "Needs Improvement"}
                                </h2>

                                <div className="inline-block px-4 py-1 rounded-full bg-white border border-slate-200 text-slate-800 font-bold text-lg mb-6 shadow-sm">
                                    Score: {result.score} / 10
                                </div>

                                <p className="text-slate-600 font-medium text-lg max-w-xl mx-auto leading-relaxed italic">
                                    "{result.feedback}"
                                </p>

                                {/* Reset Button */}
                                <Button
                                    onClick={handleReset}
                                    variant="outline"
                                    className="mt-8 border-slate-200 hover:bg-white hover:text-blue-600"
                                >
                                    Start New Interview
                                </Button>
                            </CardContent>
                        </Card>

                        {/* LEARNING RESOURCES (Only if score is low) */}
                        {!result.is_ready && result.resources && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-blue-600" />{" "}
                                    Recommended Study Plan
                                </h3>

                                <div className="grid gap-3">
                                    {result.resources.map((res, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow hover:border-blue-300 group cursor-pointer"
                                        >
                                            <div className="bg-blue-50 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                                                    {res}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider">
                                                    Recommended Resource
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
