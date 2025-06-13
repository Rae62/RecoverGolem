// src/components/BackArrow.jsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // You can replace with any icon you prefer

export default function BackArrow({ className = "" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`text-gray-700 hover:text-black transition ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft size={24} />
    </button>
  );
}
