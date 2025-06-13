import React from "react";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import Button from "../../../ui/Button";
import { useUser } from "../../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import ProfileAvatar from "./ProfileAvatar";
import { toast } from "react-toastify";

const UserInfo = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  // Handler called after avatar successfully updated (via ProfileAvatar)
  const handleChangeAvatar = (url) => {
    setUser({ ...user, avatar: url });
    // Optionally, show a toast here (unless already shown in ProfileAvatar)
    // toast.success("Avatar mis à jour !");
  };

  return (
    <motion.div
      className="bg-white p-6 rounded-2xl shadow-md transition-transform hover:scale-[1.03] relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Edit icon in top-right corner */}
      <button
        onClick={() => navigate("/profile/update")}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Edit Profile"
      >
        <Pencil className="w-5 h-5 text-gray-500" />
      </button>
      <div className="flex flex-col items-center text-center">
        <ProfileAvatar
          avatarUrl={user.avatar}
          id={user._id}
          onChange={handleChangeAvatar}
        />
        <h2 className="text-2xl font-semibold mt-4">{user.username}</h2>
        <p className="text-gray-500">{user.email}</p>
        <div className="mt-4 text-gray-700 text-left w-full max-w-xs">
          <p>
            <strong>Age:</strong> {user.age}
          </p>
          <p>
            <strong>Gender:</strong> {user.gender}
          </p>
          <p>
            <strong>Height:</strong> {user.height} cm
          </p>
          <p>
            <strong>Weight:</strong> {user.weight} kg
          </p>
          <p>
            <strong>Goal Weight:</strong> {user.goalWeight} kg
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-6 w-full max-w-xs">
          <Button
            whileTap={{ scale: 0.95 }}
            className="w-full bg-black text-white py-4 rounded-xl font-medium mt-2"
            onClick={() => navigate("/profile/change-email")}
          >
            Change email
          </Button>
          <Button
            whileTap={{ scale: 0.95 }}
            className="w-full bg-black text-white py-4 rounded-xl font-medium mt-2"
            onClick={() => navigate("/profile/change-password")}
          >
            Change password
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserInfo;
