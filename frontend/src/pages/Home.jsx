import React from "react";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HomePage = () => {

  

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-black via-[#1e1e1e] to-gray-900 text-white overflow-hidden">
      
      
      <div
        className="absolute inset-0 opacity-10 bg-repeat"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 0 v10 M0 5 h10' stroke='%23ffffff22' stroke-width='0.5'/%3E%3C/svg%3E\")",
        }}
      ></div>

     
      <div className="text-center max-w-2xl z-10">
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4"
        >
          Real-time collaboration feature coming soon
        </motion.h1>

       
        <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-purple-300 h-10 mb-6">
          <TypeAnimation
            sequence={["Anywhere", 2000, "Anytime", 2000]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
        </h2>

       
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-base sm:text-lg text-gray-300 mb-10"
        >
          Create, share, and collaborate with your team in real-time. Fast, intuitive, and beautiful.
        </motion.p>

        
        <motion.div
          className="flex justify-center gap-4 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          <Link to="/signup">
          <button className="relative px-6 py-3 font-semibold overflow-hidden group border border-white rounded-full">
            <span className="absolute left-0 top-0 w-full h-0 bg-white transition-all duration-300 ease-in-out group-hover:h-full z-0"></span>
            <span className="relative z-10 group-hover:text-black transition duration-300">
              Sign Up
            </span>
          </button>
          </Link>

         <Link to="/login">
          <button className="relative px-6 py-3 font-semibold overflow-hidden group border border-white rounded-full">
            <span className="absolute left-0 top-0 w-full h-0 bg-white transition-all duration-300 ease-in-out group-hover:h-full z-0"></span>
            <span className="relative z-10 group-hover:text-black transition duration-300">
              Login
            </span>
          </button>
         </Link>


        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
