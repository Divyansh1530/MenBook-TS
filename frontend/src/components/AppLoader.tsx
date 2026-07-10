import { motion } from "motion/react";

function AppLoader() {
  return (
    <div className="min-h-screen bg-[#fdfaf3] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-14 h-14 rounded-full border-4 border-black/10 border-t-[#120f0a]"
        />

        <h2 className="font-serif text-2xl text-[#1a1a1a]">
          MenBook
        </h2>
      </div>
    </div>
  );
}

export default AppLoader;