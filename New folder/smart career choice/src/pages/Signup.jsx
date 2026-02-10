import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import Swal from "sweetalert2"; // 1. Import SweetAlert2
import {
    Loader2,
    UserPlus,
    User,
    Mail,
    Lock,
    CheckCircle2,
    Eye,
    EyeOff,
} from "lucide-react";

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
const signUpSchema = z
    .object({
        fullName: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export default function Signup() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values) {
        setLoading(true);

        try {
            const { confirmPassword, ...userData } = values;

            const response = await axios.post(
                "http://localhost:3500/users",
                userData
            );

            if (response.status === 201) {
                // 2. Success Alert
                Swal.fire({
                    title: "Account Created!",
                    text: "Your account has been successfully registered.",
                    icon: "success",
                    confirmButtonText: "Login Now",
                    confirmButtonColor: "#2563EB", // Matches your blue theme
                }).then(() => {
                    navigate("/signin");
                });
            }
        } catch (error) {
            console.error("Signup Error:", error);

            // 3. Error Alerts
            if (error.response && error.response.status === 409) {
                Swal.fire({
                    title: "User Exists",
                    text: "An account with this email already exists.",
                    icon: "warning",
                    confirmButtonColor: "#F59E0B",
                });
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to create account. Please check your connection.",
                    icon: "error",
                    confirmButtonColor: "#EF4444",
                });
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div>
                <Navbar />
            </div>
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl border-0 ring-1 ring-slate-200">
                    <CardHeader className="space-y-1 text-center pb-8 border-b border-slate-50 bg-slate-50/50 rounded-t-xl">
                        <div className="mx-auto bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <UserPlus className="w-6 h-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-2xl font-black text-slate-800">
                            Create Account
                        </CardTitle>
                        <CardDescription>
                            Join Smart Career Choice to start your journey
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-8">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                {/* Full Name Field */}
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700">
                                                Full Name
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        placeholder="John Doe"
                                                        className="pl-10 h-11 border-slate-200 focus-visible:ring-blue-500"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Email Field */}
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

                                {/* Password Field */}
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

                                {/* Confirm Password Field */}
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700">
                                                Confirm Password
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <CheckCircle2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        type={
                                                            showConfirmPassword
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
                                                            setShowConfirmPassword(
                                                                !showConfirmPassword
                                                            )
                                                        }
                                                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                                                    >
                                                        {showConfirmPassword ? (
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
                                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-bold text-lg shadow-lg shadow-blue-200 mt-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating Account...
                                        </>
                                    ) : (
                                        "Sign Up"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>

                    <CardFooter className="flex justify-center border-t border-slate-50 pt-6 bg-slate-50/50 rounded-b-xl">
                        <p className="text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link
                                to="/signin"
                                className="text-blue-600 font-bold hover:underline"
                            >
                                Sign In
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
