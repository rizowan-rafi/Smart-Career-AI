import { useState,useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios"; // 1. Import Axios
import Swal from "sweetalert2"; // 2. Import SweetAlert
import { toast } from "sonner";
import { Loader2, LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import useAuth from "../context/AuthContext.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import Navbar from "@/components/NavBar";

// Validation Schema
const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // 4. Check for Redirect Message on Page Load
useEffect(() => {
    if (location.state?.message) {
        toast.error(location.state.message); // Shows the red popup

        // Clear the state so it doesn't show again if they refresh
        window.history.replaceState({}, document.title);
    }
}, [location]);

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // 3. Updated Submit Logic
    async function onSubmit(values) {
        setLoading(true);

        try {
            // Send login request to backend
            const response = await axios.post(
                "http://localhost:3500/login",
                values
            );

            if (response.data.success) {
                // 4. Save User Data to LocalStorage (Browser Memory)
                // This allows you to check if a user is logged in later
                login(response.data.user);

                // 5. Success Alert
                Swal.fire({
                    title: "Welcome Back!",
                    text: "Login successful.",
                    icon: "success",
                    timer: 1500, // Auto close after 1.5 seconds
                    showConfirmButton: false,
                }).then(() => {
                    navigate("/"); // Redirect to Home
                });
            }
        } catch (error) {
            console.error("Login Error:", error);

            // 6. Error Alert
            // We try to show the specific error message from the backend
            const errorMessage =
                error.response?.data?.error || "Invalid email or password.";

            Swal.fire({
                title: "Login Failed",
                text: errorMessage,
                icon: "error",
                confirmButtonColor: "#EF4444",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="">
                <Navbar></Navbar>
            </div>
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl border-0 ring-1 ring-slate-200">
                    <CardHeader className="space-y-1 text-center pb-8 border-b border-slate-50 bg-slate-50/50 rounded-t-xl">
                        <div className="mx-auto bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <LogIn className="w-6 h-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-2xl font-black text-slate-800">
                            Welcome Back
                        </CardTitle>
                        <CardDescription>
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-8">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700">
                                                Email
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        placeholder="name@example.com"
                                                        className="pl-10 h-11 border-slate-200 focus-visible:ring-blue-500"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700">
                                                Password
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        type={
                                                            showPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        placeholder="••••••••"
                                                        className="pl-10 pr-10 h-11 border-slate-200 focus-visible:ring-blue-500"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowPassword(
                                                                !showPassword
                                                            )
                                                        }
                                                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-bold text-lg shadow-lg shadow-blue-200"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Signing In...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>

                    <CardFooter className="flex justify-center border-t border-slate-50 pt-6 bg-slate-50/50 rounded-b-xl">
                        <p className="text-sm text-slate-500">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-blue-600 font-bold hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
