import { motion } from "framer-motion";
import { Github } from "lucide-react";
import RomajiText from "../components/RomajiText";
import pfp from "../assets/pfp.png";

const AboutPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto"
    >
      <motion.div
        className="bg-[var(--color-card)] rounded-xl shadow-lg overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8">
          <motion.h1
            className="text-3xl font-bold text-center mb-8 text-[var(--color-card-foreground)]"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            About Me
          </motion.h1>

          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              className="w-48 h-48 rounded-full overflow-hidden bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border-4 border-[var(--color-card)] shadow-lg relative"
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={pfp || "/placeholder.svg"}
                  alt="Profile picture"
                  className="w-full h-full object-cover transform scale-125"
                  style={{ transform: "scale(0.8)" }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-[var(--color-card-foreground)]">
                Abdelrahman Athamneh
              </h2>
              <p className="text-[var(--color-muted)] mb-4">
                <RomajiText text="こんにちは！" /> Hello! I'm Abdelrahman, a
                passionate language learner and developer.
              </p>
              <motion.a
                href="https://github.com/AbdelrahmanAthamneh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-400 hover:text-blue-300 bg-blue-900/20 px-4 py-2 rounded-lg border border-transparent hover:bg-blue-900/30 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github size={20} className="mr-2 text-blue-400" />
                GitHub Profile
              </motion.a>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-bold mb-3 text-[var(--color-card-foreground)]">
                Why I Created This App
              </h3>
              <p className="text-[var(--color-muted)]">
                As someone who is learning Japanese, I found that having a
                personalized vocabulary builder would be incredibly helpful. I
                wanted a tool that would allow me to track my progress, review
                words I've learned, and practice kana characters all in one
                place.
              </p>
            </motion.section>

            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-xl font-bold mb-3 text-[var(--color-card-foreground)]">
                Get in Touch
              </h3>
              <p className="text-[var(--color-muted)]">
                I'd love to hear your feedback and suggestions for improving
                this app. Feel free to reach out to me on GitHub!
              </p>
              <p className="text-[var(--color-muted)] mt-4">
                <RomajiText text="ありがとうございます！" /> Thank you for using
                my app!
              </p>
            </motion.section>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AboutPage;
