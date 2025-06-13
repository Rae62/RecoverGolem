// email/mail.js
const nodemailer = require("nodemailer");

const { EMAIL_USER, EMAIL_PASS, API_URL, CLIENT_URL } = process.env;

// Transporteur pour Gmail. Pour d’autres services, adapter la config.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

// --------- ENVOIS DE MAILS -----------

/**
 * Envoi le mail de confirmation d’inscription avec lien
 */
const sendConfirmationEmail = async (email, token) => {
  const confirmUrl = `${API_URL}/auth/verify-email/${encodeURIComponent(
    token
  )}`;
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "Confirmation d'inscription",
    html: `
      <p>Bienvenue sur GolemBro's !<br>
      Cliquez pour finaliser la création de votre compte :</p>
      <p><a href="${confirmUrl}">Confirmer mon inscription</a></p>
      <p>Si ce n'est pas vous, ignorez cet email.</p>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Erreur sendConfirmationEmail:", err);
  }
};

/**
 * Confirme à l’utilisateur que son compte est bien validé
 */
const sendValidationAccount = async (email) => {
  const loginUrl = `${CLIENT_URL}/sign-in`;
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "Inscription validée 🚀",
    html: `
      <p>Votre compte est activé !</p>
      <p>Connectez-vous ici : <a href="${loginUrl}">${loginUrl}</a></p>
      <p>Bienvenue et à bientôt sur GolemBro's 💪</p>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Erreur sendValidationAccount:", err);
  }
};

/**
 * Mail d’échec de confirmation (token exp, etc.)
 */
const sendInvalidEmailToken = async (email) => {
  const registerUrl = `${CLIENT_URL}/register`;
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "Lien de validation expiré",
    html: `
      <p>Votre lien d'activation a expiré ou n'est plus valide.</p>
      <p>Merci de recommencer l'inscription :
        <a href="${registerUrl}">${registerUrl}</a>
      </p>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Erreur sendInvalidEmailToken:", err);
  }
};

/**
 * Lien de reset (mot de passe oublié)
 */
const sendForgotPasswordEmail = async (email, token) => {
  const resetUrl = `${CLIENT_URL}/reset-password/${encodeURIComponent(token)}`;
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "Réinitialisation de votre mot de passe",
    html: `
      <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
      <p>Cliquez ici pour le modifier : <a href="${resetUrl}">Changer de mot de passe</a></p>
      <p>Si ce n'était pas vous, ignorez simplement cet email.</p>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Erreur sendForgotPasswordEmail:", err);
  }
};

/**
 * Confirmation de modification de mot de passe (après succès de reset OU de changepassword)
 */
const validateNewPassword = async (email) => {
  const loginUrl = `${CLIENT_URL}/login`;
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "Mot de passe modifié avec succès",
    html: `
      <p>Votre mot de passe a bien été modifié.</p>
      <p>Reconnectez-vous : <a href="${loginUrl}">${loginUrl}</a></p>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Erreur validateNewPassword:", err);
  }
};

/**
 * Confirmation de demande de changement d’email
 */
const sendEmailChangeConfirmation = async (newEmail, token) => {
  const confirmUrl = `${CLIENT_URL}/profile/confirm-email?token=${encodeURIComponent(
    token
  )}`;
  const mailOptions = {
    from: EMAIL_USER,
    to: newEmail,
    subject: "Confirmation de changement d'email",
    html: `
      <p>Pour confirmer votre nouvelle adresse email, cliquez ici :</p>
      <p><a href="${confirmUrl}">${confirmUrl}</a></p>
      <p>Si vous n'êtes pas à l'origine de la demande, ignorez simplement ce message.</p>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Erreur sendEmailChangeConfirmation:", err);
  }
};

/**
 * Confirmation de modification du mot de passe (depuis l’espace utilisateur)
 */
const sendModifyPassword = async (email) => {
  const homeUrl = CLIENT_URL;
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "Votre mot de passe a été modifié",
    html: `
      <p>Votre mot de passe vient d'être modifié.</p>
      <p>Si ce n'était pas vous, <strong>signalez-le rapidement !</strong></p>
      <p>Retourner sur le site : <a href="${homeUrl}">${homeUrl}</a></p>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Erreur sendModifyPassword:", err);
  }
};

module.exports = {
  sendConfirmationEmail,
  sendValidationAccount,
  sendInvalidEmailToken,
  sendForgotPasswordEmail,
  validateNewPassword,
  sendEmailChangeConfirmation,
  sendModifyPassword,
};
