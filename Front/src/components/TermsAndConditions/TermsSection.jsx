import { useState } from "react";
import { motion } from "framer-motion";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const TermsSection = ({ section }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const contentVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { height: "auto", opacity: 1 },
  };

  return (
    <motion.section
      id={section.id}
      data-section={section.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 scroll-mt-24"
    >
      <div
        onClick={toggleExpand}
        className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
      >
        <h2 className="text-xl font-semibold text-accent-800">
          {section.title}
        </h2>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </motion.div>
      </div>

      <motion.div
        variants={contentVariants}
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-4 pt-6 bg-white border-x border-b border-gray-100 rounded-b-lg">
          {section.subsections && section.subsections.length > 0 ? (
            <div className="space-y-6">
              {section.subsections.map((subsection, index) => (
                <div key={index}>
                  <h3 className="text-lg font-medium text-accent-700 mb-3">
                    {subsection.title}
                  </h3>
                  <div className="prose prose-gray text-accent-600 max-w-none">
                    {subsection.content.map((paragraph, i) => (
                      <p key={i} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="prose prose-gray text-accent-600 max-w-none">
              {section.content.map((paragraph, i) => (
                <p key={i} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default TermsSection;
