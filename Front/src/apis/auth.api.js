// api/user.js
import { BASE_URL } from "../utils/url";
import { handleApiResponse } from "../utils/handleApiResponse";

/**
 * Inscription d'utilisateur (envoie mail de confirmation).
 * @param {Object} values - { username, email, password }
 */
export async function signup(values) {
  try {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Erreur réseau signup:", error);
    return {
      success: false,
      message: "Impossible de contacter le serveur. Veuillez réessayer.",
    };
  }
}

/**
 * Vérification de validation d'un email (utilisé ?).
 * @param {string} email
 */
export async function checkEmailValidation(email) {
  try {
    const url = `${BASE_URL}/auth/check-email-validation?email=${encodeURIComponent(
      email
    )}`;
    const response = await fetch(url, { method: "GET" });
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Erreur réseau checkEmailValidation:", error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer." };
  }
}

/**
 * Connexion.
 * @param {Object} param0 - { email, password }
 */
export async function login({ email, password }) {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Erreur réseau login:", error);
    return {
      success: false,
      message: "Impossible de se connecter. Veuillez réessayer.",
    };
  }
}

/**
 * Récupérer l'utilisateur connecté via cookie
 */
export async function getCurrentUser() {
  try {
    const response = await fetch(`${BASE_URL}/auth/current-user`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Erreur getCurrentUser:", error);
    return null;
  }
}

/**
 * Déconnexion
 */
export async function logout() {
  try {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Erreur logout:", error);
    return { success: false, message: "Erreur lors de la déconnexion." };
  }
}

/**
 * Flow mot de passe oublié: étape 1 (demande email)
 */
export async function forgotPassword({ email }) {
  try {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Erreur réseau forgotPassword:", error);
    return { success: false, message: "Impossible de traiter la demande." };
  }
}

/**
 * Flow mot de passe oublié: étape 2 (reset)
 * @param {{password, token}} values
 */
export async function resetPassword(values) {
  try {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
      credentials: "include",
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Erreur réseau resetPassword:", error);
    return {
      success: false,
      message: "Impossible de réinitialiser le mot de passe.",
    };
  }
}

/**
 * Mise à jour du profil (tous champs autorisés par le backend)
 * Nécessite d'être connecté (cookie envoyé).
 */
export async function updateProfile(updates) {
  try {
    const response = await fetch(`${BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
      credentials: "include",
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Erreur updateProfile:", error);
    return {
      success: false,
      message: "Erreur lors de la mise à jour du profil.",
    };
  }
}

/**
 * Changement de mot de passe
 * @param {Object} values - {currentPassword, newPassword, confirmPassword}
 */
export async function changePassword(values) {
  try {
    const response = await fetch(`${BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(values),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Erreur changePassword:", error);
    return {
      success: false,
      message: "Erreur lors du changement de mot de passe.",
    };
  }
}

/**
 * Demande de changement d'email (envoie confirmation)
 * @param {string} newEmail
 */
export async function requestEmailChange(newEmail) {
  try {
    const response = await fetch(`${BASE_URL}/auth/request-email-change`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ newEmail }),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Erreur requestEmailChange:", error);
    return {
      success: false,
      message: "Erreur lors de la demande de changement d’email.",
    };
  }
}

/**
 * Confirmation de changement d'email via lien/token
 * @param {string} token
 */
export async function confirmEmailChange(token) {
  const url = `${BASE_URL}/auth/confirm-email-change?token=${encodeURIComponent(
    token.trim()
  )}`;
  try {
    const response = await fetch(url, { method: "GET" });
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Erreur confirmEmailChange:", error);
    return {
      success: false,
      message: "Erreur lors de la confirmation d'email",
    };
  }
}

/**
 * Pour la route additionnelle d'update des données optionnelles
 * (inscription, ou profil, ou alternative)
 * @param {Object} data - { userId?, gender?, ... }
 */
export async function updateOptionalUserData(data) {
  try {
    const response = await fetch(`${BASE_URL}/auth/update-optional-enhanced`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Erreur réseau updateOptionalUserData:", error);
    return { success: false, message: "Erreur lors de la mise à jour." };
  }
}

/**
 * Enregistre l’URL publique de l’avatar (provenant de Supabase) côté backend.
 * @param {Object} params
 * @param {string} params.avatar - URL publique de l’avatar (retournée par Supabase)
 * @returns {Promise<Object>} objet de réponse du backend
 */
export async function updateAvatar({ avatar }) {
  try {
    const response = await fetch(`${BASE_URL}/auth/avatar`, {
      method: "PATCH",
      body: JSON.stringify({ avatar }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Erreur réseau updateAvatar:", error);
    return {
      success: false,
      message: "Erreur lors de l’envoi de l’avatar. Veuillez réessayer.",
    };
  }
}
