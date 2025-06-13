import { useState } from "react";
import { motion } from "framer-motion";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const TableOfContents = ({ sections, activeSection }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
    >
      <div
        className="flex items-center justify-between cursor-pointer lg:cursor-default"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="font-bold text-lg text-accent-800">Table of Contents</h2>
        <div className="lg:hidden">
          {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </div>
      </div>

      <motion.ul
        className={`space-y-2 ${isExpanded ? "block" : "hidden"} lg:block mt-4`}
      >
        {sections.map((section, index) => (
          <motion.li
            key={section.id}
            variants={itemVariants}
            transition={{ delay: index * 0.05 }}
          >
            <button
              onClick={() => scrollToSection(section.id)}
              className={`text-left w-full py-2 px-3 rounded-md text-sm transition-all duration-200 ${
                activeSection === section.id
                  ? "bg-primary-50 text-primary-700 font-medium"
                  : "text-accent-600 hover:bg-gray-50"
              }`}
            >
              {section.title}
            </button>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
};

export default TableOfContents;
