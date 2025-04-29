import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-[var(--color-background)] transition-colors duration-200">
      <Navbar />
      <motion.main
        className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default Layout;
