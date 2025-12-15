import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Ghost, Home, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-xl px-6"
      >
        {/* Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="flex justify-center mb-6"
        >
          <Ghost className="w-20 h-20 text-indigo-400" />
        </motion.div>

        {/* 404 Text */}
        <h1 className="text-7xl font-extrabold tracking-tight mb-4">404</h1>
        <p className="text-xl text-slate-300 mb-2">Oops! This page vanished into the void.</p>
        <p className="text-sm text-slate-400 mb-8">
          The page you’re looking for doesn’t exist or was moved.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <Button
            className="rounded-2xl px-6"
            onClick={() => navigate("/auth/profile")}
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>

          <Button
            variant="outline"
            className="rounded-2xl px-6 border-slate-700 text-slate-200 hover:bg-slate-800"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Footer hint */}
        <p className="mt-10 text-xs text-slate-500">
          Lost? Even ghosts need directions sometimes.
        </p>
      </motion.div>
    </div>
  );
}
