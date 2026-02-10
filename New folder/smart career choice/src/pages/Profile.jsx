import  useAuth  from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, Calendar, LogOut, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Ensure you have Badge, or swap for a span
import Navbar from "@/components/Navbar";

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Redirect if not logged in
    if (!user) {
        navigate("/signin");
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate("/signin");
    };

    // Format Date (e.g., "2024-01-05" -> "Jan 05, 2024")
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Get Initials for Avatar (e.g. "John Doe" -> "JD")
    const getInitials = (name) => {
        return name
            ? name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
            : "U";
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-800">
                        My Profile
                    </h1>
                    <p className="text-slate-500">
                        Manage your account settings and preferences.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: User Identity Card */}
                    <Card className="md:col-span-1 shadow-lg border-0 ring-1 ring-slate-200 h-fit">
                        <CardContent className="pt-8 flex flex-col items-center text-center">
                            {/* Avatar Circle */}
                            <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-black mb-4 ring-4 ring-white shadow-lg">
                                {getInitials(user.fullName)}
                            </div>

                            <h2 className="text-xl font-bold text-slate-800">
                                {user.fullName}
                            </h2>
                            <p className="text-sm text-slate-500 mb-4">
                                {user.email}
                            </p>

                            <div className="flex gap-2 mb-6">
                                <Badge
                                    variant="secondary"
                                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 uppercase tracking-wider text-[10px]"
                                >
                                    {user.role || "Student"}
                                </Badge>
                            </div>

                            <Button
                                variant="outline"
                                onClick={handleLogout}
                                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </Button>
                        </CardContent>
                    </Card>

                    {/* RIGHT COLUMN: Details & Stats */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Account Details */}
                        <Card className="shadow-md border-0 ring-1 ring-slate-200">
                            <CardHeader className="border-b border-slate-100 pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-bold text-slate-800">
                                        Personal Information
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-blue-600"
                                    >
                                        <Edit className="w-4 h-4 mr-2" /> Edit
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 grid gap-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                                            <User className="w-3 h-3" /> Full
                                            Name
                                        </label>
                                        <div className="font-medium text-slate-800 bg-slate-50 p-3 rounded-md border border-slate-100">
                                            {user.fullName}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                                            <Mail className="w-3 h-3" /> Email
                                            Address
                                        </label>
                                        <div className="font-medium text-slate-800 bg-slate-50 p-3 rounded-md border border-slate-100">
                                            {user.email}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                                            <Shield className="w-3 h-3" /> Role
                                        </label>
                                        <div className="font-medium text-slate-800 bg-slate-50 p-3 rounded-md border border-slate-100 capitalize">
                                            {user.role || "User"}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />{" "}
                                            Joined On
                                        </label>
                                        <div className="font-medium text-slate-800 bg-slate-50 p-3 rounded-md border border-slate-100">
                                            {formatDate(user.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Placeholder for Future Features (Like Saved Roadmaps) */}
                        <Card className="shadow-md border-0 ring-1 ring-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                            <CardContent className="p-8">
                                <h3 className="text-xl font-bold mb-2">
                                    My Saved Roadmaps
                                </h3>
                                <p className="text-slate-300 mb-6 text-sm">
                                    You haven't saved any career paths yet. Use
                                    the Smart Career tool to discover and save
                                    your path.
                                </p>
                                <Button
                                    onClick={() => navigate("/")}
                                    className="bg-white text-slate-900 hover:bg-slate-100 font-bold"
                                >
                                    Discover Career Path
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
