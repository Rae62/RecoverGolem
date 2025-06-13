import React, { useRef } from "react";
import { Camera } from "lucide-react";
import { supabase } from "../../../../utils/supabaseClient.js";
import { updateAvatar } from "../../../../apis/auth.api.js";
import { useUser } from "../../../../contexts/UserContext.jsx";
import { toast } from "react-toastify";

const VALID_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "svg"];
const MAX_SIZE_KO = 7000;

const ProfileAvatar = ({ avatarUrl, onChange, id }) => {
  const fileInputRef = useRef(null);
  const { setUser, user } = useUser();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.name) {
      toast.error("Aucun fichier valide sélectionné.");
      return;
    }
    // Vérifie l'extension
    const fileExt = file.name.split(".").pop().toLowerCase();
    if (!VALID_EXTENSIONS.includes(fileExt)) {
      toast.error(
        `Le fichier doit être une image (${VALID_EXTENSIONS.join(", ")})`
      );
      return;
    }
    // Vérifie la taille max : 7000ko
    if (file.size > MAX_SIZE_KO * 1024) {
      toast.error("Image trop volumineuse (max 7Mo).");
      return;
    }

    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = fileName;
    const loadingToast = toast.loading("Upload de l'avatar en cours...");

    try {
      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatar")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get public URL from Supabase
      const { data: urlData, error: urlError } = await supabase.storage
        .from("avatar")
        .getPublicUrl(filePath);

      if (urlError || !urlData?.publicUrl) {
        throw new Error("Impossible de récupérer l'URL publique.");
      }

      const publicUrl = urlData.publicUrl;

      // 3. Notify backend to save the URL for this user
      const res = await updateAvatar({ avatar: publicUrl });
      if (res?.success === false) throw new Error(res?.message);

      // 4. Update state/context and parent
      onChange && onChange(publicUrl);
      setUser((prev) => ({ ...prev, avatar: publicUrl }));

      toast.update(loadingToast, {
        render: "Avatar mis à jour avec succès ! 🎉",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Erreur Supabase ou API :", error);
      toast.update(loadingToast, {
        render: "Erreur pendant l'upload de l'avatar : " + error.message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative rounded-full overflow-hidden h-32 w-32 border-4 border-white shadow-lg transition duration-300 cursor-pointer hover:opacity-90"
        onClick={handleAvatarClick}
      >
        <img
          src={user.avatar || avatarUrl}
          alt="Profile"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <Camera size={36} className="text-white" />
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={VALID_EXTENSIONS.map((ext) => "." + ext).join(",")}
        className="hidden"
        onChange={handleFileChange}
      />
      <p className="text-sm text-blue-500 mt-2">
        Cliquez pour changer l'avatar
      </p>
    </div>
  );
};

export default ProfileAvatar;
