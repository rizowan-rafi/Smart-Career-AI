import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Users, ShieldAlert, Search } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import Navbar from "@/components/Navbar";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // 1. Fetch Users on Load
    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter users when search changes
    useEffect(() => {
        const result = users.filter(
            (user) =>
                user.fullName.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredUsers(result);
    }, [search, users]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3500/users");
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (error) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    // 2. Handle Delete User
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#3B82F6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:3500/users/${id}`);
                    toast.success("User deleted successfully");
                    // Remove from local state immediately
                    const remaining = users.filter((user) => user._id !== id);
                    setUsers(remaining);
                } catch (error) {
                    toast.error("Failed to delete user");
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* HEADER & STATS */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">
                            Admin Dashboard
                        </h1>
                        <p className="text-slate-500">
                            Manage users and system access
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Card className="w-40 border-l-4 border-l-blue-600 shadow-sm">
                            <CardContent className="p-4">
                                <p className="text-xs font-bold text-slate-400 uppercase">
                                    Total Users
                                </p>
                                <p className="text-2xl font-black text-slate-800">
                                    {users.length}
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="w-40 border-l-4 border-l-purple-600 shadow-sm">
                            <CardContent className="p-4">
                                <p className="text-xs font-bold text-slate-400 uppercase">
                                    Admins
                                </p>
                                <p className="text-2xl font-black text-slate-800">
                                    {
                                        users.filter((u) => u.role === "admin")
                                            .length
                                    }
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <Card className="shadow-lg border-0 ring-1 ring-slate-200">
                    <CardHeader className="bg-white border-b border-slate-100 pb-4">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-600" /> User
                                Management
                            </CardTitle>
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search users..."
                                    className="pl-8 bg-slate-50 border-slate-200"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredUsers.map((user) => (
                                        <tr
                                            key={user._id}
                                            className="hover:bg-blue-50/50 transition-colors group"
                                        >
                                            <td className="px-6 py-4 font-medium text-slate-800">
                                                {user.fullName}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.role === "admin" ? (
                                                    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-0">
                                                        <ShieldAlert className="w-3 h-3 mr-1" />{" "}
                                                        Admin
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-slate-100 text-slate-600"
                                                    >
                                                        Student
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(user._id)
                                                    }
                                                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                                    disabled={
                                                        user.role === "admin"
                                                    } // Prevent deleting admins
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="text-center py-8 text-slate-400"
                                            >
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
