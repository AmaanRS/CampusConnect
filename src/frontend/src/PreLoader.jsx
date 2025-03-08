import { motion } from "framer-motion";
import { BarLoader } from "react-spinners";

export default function Preloader() {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center flex-col items-center justify-center mb-28">
        {/* Logo or Name of the Website */}
        <motion.div
          className="logo mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-4xl font-bold text-blue-700">
            Campus<span className="text-blue-500">Connect</span>
          </h1>
        </motion.div>

        {/* Spinning Loader */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <BarLoader
            color="#1a56db"
            height={"3px"}
            width={"150px"}
            className="m-auto"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
