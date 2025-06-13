// utils/handleApiResponse.js

/**
 * Gère une réponse fetch standardisée.
 * @param {Response} response
 * @returns {Promise<Object>} - { success, message?, errorCode?, ...data }
 */
export async function handleApiResponse(response) {
  let data;

  try {
    data = await response.json();
  } catch {
    return {
      success: false,
      message: "Réponse invalide du serveur.",
    };
  }

  if (!response.ok) {
    return {
      success: false,
      message: data.message || "Erreur inconnue.",
      errorCode: data.errorCode || null,
    };
  }

  return {
    success: true,
    ...data,
  };
}
