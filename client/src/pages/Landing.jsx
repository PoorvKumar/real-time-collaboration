import React from 'react';
import { motion } from 'framer-motion';
import { FaMoon, FaSun, FaCode, FaPencilRuler } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const Landing = () => {
  const { dark: isDarkMode , toggleDarkMode } = useTheme();

  return (
    <div className={`h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-indigo-600 dark:text-indigo-400"
          >
            SkribbleCode
          </motion.div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            >
              {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05 }}
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
              href="/signin"
            >
              Login
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
              href="/signup"
            >
              Sign Up
            </motion.a>
          </div>
        </nav>

        <main className="container mx-auto px-6 py-12 flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-center text-gray-900 dark:text-white mb-6"
          >
            Collaborate in Real-Time
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-center text-gray-600 dark:text-gray-300 mb-12"
          >
            Experience seamless collaboration with our interactive whiteboard and code editor.
          </motion.p>
          <div className="flex justify-center space-x-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col items-center"
            >
              <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-full mb-4">
                <FaPencilRuler className="text-4xl text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-gray-700 dark:text-gray-300">Interactive Whiteboard</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col items-center"
            >
              <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-full mb-4">
                <FaCode className="text-4xl text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-gray-700 dark:text-gray-300">Real-Time Code Editor</p>
            </motion.div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 text-white px-8 py-3 rounded-md text-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            Get Started
          </motion.button>
        </main>
      </div>
    </div>
  );
};

export default Landing;