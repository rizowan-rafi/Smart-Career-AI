import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Menu,
    X,
    FileText,
    LogOut,
    User as UserIcon,
    Users,
    Home,
    Brain, // 1. Added Brain Icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import  useAuth  from "@/context/AuthContext";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/signin");
        setIsOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                    {/* LOGO */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-blue-600 p-1.5 rounded-lg">
                                <FileText className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-black text-xl tracking-tight text-slate-900">
                                Smart
                                <span className="text-blue-600">Career</span>
                            </span>
                        </Link>
                    </div>

                    {/* DESKTOP MENU */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            to="/"
                            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                        >
                            <Home className="w-4 h-4" />
                            Home
                        </Link>

                        {/* NEW: Interview Link */}
                        <Link
                            to="/interview"
                            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                        >
                            <Brain className="w-4 h-4" />
                            Mock Interview
                        </Link>

                        <Link
                            to="/resume"
                            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                        >
                            <FileText className="w-4 h-4" />
                            Resume Builder
                        </Link>

                        <Link
                            to="/about"
                            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                        >
                            <Users className="w-4 h-4" />
                            About Us
                        </Link>

                        <div className="h-6 w-px bg-slate-200 mx-2"></div>

                        {/* User Auth Section */}
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/profile">
                                    <div className="flex items-center gap-2 text-slate-700 font-bold bg-slate-100 px-3 py-1.5 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer">
                                        <UserIcon className="w-4 h-4" />
                                        {user.fullName}
                                    </div>
                                </Link>
                                <Button
                                    variant="ghost"
                                    onClick={handleLogout}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    asChild
                                    className="font-semibold text-slate-700 hover:text-blue-600"
                                >
                                    <Link to="/signin">Sign In</Link>
                                </Button>
                                <Button
                                    asChild
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-100"
                                >
                                    <Link to="/signup">Sign Up</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* MOBILE MENU BUTTON */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <X
                                    className="block h-6 w-6"
                                    aria-hidden="true"
                                />
                            ) : (
                                <Menu
                                    className="block h-6 w-6"
                                    aria-hidden="true"
                                />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU DROPDOWN */}
            {isOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link
                            to="/"
                            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>

                        {/* NEW: Mobile Interview Link */}
                        <Link
                            to="/interview"
                            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                            onClick={() => setIsOpen(false)}
                        >
                            Mock Interview
                        </Link>

                        <Link
                            to="/resume"
                            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                            onClick={() => setIsOpen(false)}
                        >
                            Resume Builder
                        </Link>

                        <Link
                            to="/about"
                            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                            onClick={() => setIsOpen(false)}
                        >
                            About Us
                        </Link>

                        {/* Mobile Profile Link */}
                        {user && (
                            <Link
                                to="/profile"
                                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                                onClick={() => setIsOpen(false)}
                            >
                                My Profile
                            </Link>
                        )}
                    </div>
                    <div className="pt-4 pb-4 border-t border-slate-100">
                        <div className="flex items-center px-5 gap-3">
                            {user ? (
                                <Button
                                    variant="destructive"
                                    className="w-full justify-center"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-center"
                                        asChild
                                    >
                                        <Link to="/signin">Sign In</Link>
                                    </Button>
                                    <Button
                                        className="w-full justify-center bg-blue-600"
                                        asChild
                                    >
                                        <Link to="/signup">Sign Up</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
