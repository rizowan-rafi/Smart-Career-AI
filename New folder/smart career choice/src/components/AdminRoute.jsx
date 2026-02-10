import { Navigate } from "react-router-dom";
import  useAuth  from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function AdminRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    // If not logged in OR not an admin -> Kick them out
    if (!user || user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}
