import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TableOfContents from "../components/TermsAndConditions/TableOfContents";
import TermsSection from "../components/TermsAndConditions/TermsSection";
import BackToTopButton from "../components/ui/BackToTopButton";
import { termsData } from "../data/termsData";

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section]");

      for (const section of sections) {
        const rect = section.getBoundingClientRect();

        if (rect.top <= 150 && rect.bottom >= 150) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary-800 mb-2">
          Terms and Conditions
        </h1>
        <p className=" text-sm text-gray-400 mb-2">
          Last updated: July 5, 2025
        </p>
        <p className=" text-accent-500">
          Please read these terms and conditions carefully before using our
          service.
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-1/4 shrink-0">
          <div className="sticky top-8">
            <TableOfContents
              sections={termsData}
              activeSection={activeSection}
            />
          </div>
        </aside>

        <motion.main
          className="lg:w-3/4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {termsData.map((section) => (
            <TermsSection key={section.id} section={section} />
          ))}
        </motion.main>
      </div>

      <BackToTopButton />
    </div>
  );
};

export default TermsAndConditions;
