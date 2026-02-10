import { Navigate } from "react-router-dom";
import  useAuth  from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    // 1. Wait until we verify the user session from LocalStorage
    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    // 2. If verification finishes and no user is found, Kick them out!
   if (!user) {
       // 3. Pass "state" with a custom message
       return (
           <Navigate
               to="/signin"
               state={{ message: "Please sign in to access the page." }}
               replace
           />
       );
   }

    // 3. If user exists, let them see the page
    return children;
}
