import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
    Award,
    BookOpen,
    Briefcase,
    CheckCircle2,
    ExternalLink,
    GraduationCap,
    Loader2,
    Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// shadcn components
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import NavBar from "./components/NavBar.jsx";

// 1. Validation Schema
const formSchema = z.object({
    education: z.string().min(1, "Please select an education level"),
    skills: z.string().min(2, "Please enter at least one skill"),
    interests: z.string().min(2, "Please enter at least one interest"),
});

// --- COMPONENT: CAREER FORM ---
function CareerForm({ onResult, loading, setLoading }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { education: "Bachelor's", skills: "", interests: "" },
    });

    async function onSubmit(values) {
        setLoading(true);
        try {
            const payload = {
                education: values.education,
                skills: values.skills.split(",").map((s) => s.trim()),
                interests: values.interests.split(",").map((i) => i.trim()),
            };

            const response = await axios.post(
                "http://localhost:3500/profession",
                payload
            );
            onResult(response.data);
        } catch (error) {
            console.error("Error:", error);
            alert(
                "Backend Error: Make sure your Node.js and Python servers are both running!"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-lg mx-auto shadow-2xl border-0 ring-1 ring-slate-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                <div className="mx-auto bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-black text-slate-800">
                    Discover Your Path
                </CardTitle>
                <CardDescription className="text-base">
                    AI Analysis based on your skills & education
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        {/* Improved Education Selector: Cards instead of simple radios */}
                        <FormField
                            control={form.control}
                            name="education"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="text-base font-bold text-slate-800 flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4" />{" "}
                                        Education Level
                                    </FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="grid grid-cols-3 gap-3"
                                        >
                                            {[
                                                "Bachelor's",
                                                "Master's",
                                                "PhD",
                                            ].map((level) => (
                                                <FormItem key={level}>
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            value={level}
                                                            className="peer sr-only" // Hide the actual radio circle
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-slate-100 bg-white p-4 hover:bg-slate-50 hover:border-blue-200 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 cursor-pointer transition-all text-center h-full">
                                                        <span className="font-semibold text-sm">
                                                            {level}
                                                        </span>
                                                    </FormLabel>
                                                </FormItem>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="skills"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-bold text-slate-800">
                                        Technical Skills
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. react, python, sql"
                                            className="h-12 border-slate-200 focus-visible:ring-blue-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        Separate skills with commas.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="interests"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-bold text-slate-800">
                                        Personal Interests
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. robotics, design, data"
                                            className="h-12 border-slate-200 focus-visible:ring-blue-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-200 transition-all active:scale-95"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Analyzing Profile...
                                </>
                            ) : (
                                "Analyze My Career"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

// --- COMPONENT: APP (Main Page) ---
export default function App() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [jobsLoading, setJobsLoading] = useState(false);

    useEffect(() => {
        if (result && result.career) {
            fetchLatestJobs(result.career);
        }
    }, [result]);

    const fetchLatestJobs = async (careerName) => {
        setJobsLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:3500/api/live-jobs?career=${careerName}`
            );
            setJobs(response.data);
        } catch (error) {
            console.error("Job API Error:", error);
        } finally {
            setJobsLoading(false);
        }
    };
    // console.log(jobs)

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900 font-sans text-slate-900 pb-20">
            {/* Header Section */}
            <NavBar />
            <div className="bg-white border-b border-slate-200 py-12 mb-12">
                <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-2xl mb-2">
                        <span className="px-3 py-1 text-xs font-bold text-blue-600 uppercase tracking-widest">
                            RUET CSE Project
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">
                        Smart <span className="text-blue-600">Career</span>{" "}
                        Choice
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        An intelligent guidance system that maps your skills to
                        industry demands using Machine Learning.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 space-y-12">
                {/* FORM SECTION */}
                <CareerForm
                    onResult={setResult}
                    loading={loading}
                    setLoading={setLoading}
                />

                {/* RESULTS SECTION */}
                {result && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700 fill-mode-both">
                        {/* 1. HERO RECOMMENDATION */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Career Card */}
                            <Card className="md:col-span-2 overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative">
                                <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                <CardHeader className="relative z-10 flex flex-row items-start justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-blue-100 uppercase tracking-widest text-sm font-bold opacity-80">
                                            AI Prediction
                                        </CardTitle>
                                        <div className="text-5xl md:text-6xl font-black tracking-tight mt-2">
                                            {result.career}
                                        </div>
                                    </div>
                                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md hidden sm:block">
                                        <Award className="h-10 w-10 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent className="relative z-10 pt-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm">
                                        <span className="text-blue-100 font-medium">
                                            Target Senior Role:
                                        </span>
                                        <span className="font-bold text-white uppercase tracking-wide">
                                            {result.details?.senior_role ||
                                                "Lead Specialist"}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* 2. ROADMAP */}
                            <Card className="shadow-lg border-0 ring-1 ring-slate-100 h-full">
                                <CardHeader className="border-b border-slate-50 bg-slate-50/50 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                                        </div>
                                        <CardTitle className="text-xl font-bold text-slate-800">
                                            Upskilling Roadmap
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="relative border-l-2 border-slate-100 ml-3 space-y-6 pb-2">
                                        {result.details?.upskill_steps.map(
                                            (step, i) => (
                                                <div
                                                    key={i}
                                                    className="mb-6 ml-6 relative"
                                                >
                                                    <span className="absolute -left-[37px] flex h-8 w-8 items-center justify-center rounded-full bg-white ring-4 ring-green-50 border-2 border-green-500 text-xs font-bold text-green-700">
                                                        {i + 1}
                                                    </span>
                                                    <p className="text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                        {step}
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* 3. COMPETENCIES & RESOURCES */}
                            <div className="space-y-6 flex flex-col h-full">
                                {/* Competencies */}
                                <Card className="shadow-md border-0 ring-1 ring-slate-100 flex-1">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="h-5 w-5 text-purple-500" />
                                            <CardTitle className="text-lg font-bold">
                                                Core Skills Needed
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex flex-wrap gap-2">
                                        {result.details?.core_skills.map(
                                            (skill, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-md text-xs font-bold uppercase tracking-wider"
                                                >
                                                    {skill}
                                                </span>
                                            )
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Resources */}
                                <Card className="shadow-md border-0 ring-1 ring-slate-100 flex-1">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-5 w-5 text-orange-500" />
                                            <CardTitle className="text-lg font-bold">
                                                Recommended Resources
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {result.details?.recommended_resources.map(
                                            (res, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-2 text-sm text-slate-600 bg-orange-50/50 p-2 rounded border border-orange-100/50"
                                                >
                                                    <div className="h-1.5 w-1.5 rounded-full bg-orange-400"></div>
                                                    {res}
                                                </div>
                                            )
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* 4. LIVE JOBS SECTION */}
                        <div className="pt-8 border-t border-slate-200">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                                    Live Job Market
                                </h3>
                            </div>

                            {jobsLoading ? (
                                <div className="flex flex-col items-center justify-center p-20 bg-white rounded-2xl border border-dashed border-slate-300">
                                    <Loader2 className="animate-spin h-10 w-10 text-blue-500 mb-4" />
                                    <p className="text-slate-500 font-medium">
                                        Fetching live opportunities...
                                    </p>
                                </div>
                            ) : jobs.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {jobs.map((job) => (
                                        <Card
                                            key={job.job_id}
                                            className="group hover:border-blue-400 hover:shadow-xl transition-all duration-300 h-full flex flex-col border-slate-200"
                                        >
                                            <CardHeader className="pb-3">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                        {/* 1. Updated Company Name Field */}
                                                        {job.company_name}
                                                    </div>
                                                </div>
                                                <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-blue-700 transition-colors">
                                                    {job.title}
                                                </CardTitle>
                                                <CardDescription className="text-xs font-medium flex items-center gap-1 mt-1">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                    {/* 2. Updated Location Field */}
                                                    {job.location}
                                                </CardDescription>
                                            </CardHeader>

                                            <CardContent className="flex-grow">
                                                <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                                                    {job.description}
                                                </p>
                                            </CardContent>

                                            <CardFooter className="pt-0 mt-auto">
                                                <Button
                                                    variant="outline"
                                                    className="w-full border-slate-200 group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all"
                                                    asChild
                                                >
                                                    <a
                                                        href={
                                                            job
                                                                .apply_options?.[0]
                                                                ?.link ||
                                                            job.share_link
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        View Opening
                                                        <ExternalLink className="ml-2 h-3 w-3" />
                                                    </a>
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                    <p className="text-slate-500">
                                        No live jobs found for this specific
                                        role right now.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
