import AdminManager from "./admin_manager.js";

const adminManager = new AdminManager();
/**
 * Afficher toutes les recettes
 * Ajouter événement click sur les boutons pour supprimer recette
 */
const afficherRecettes = async () => {
  await adminManager.afficherRecettes();

  // boutons individuels
  document.querySelectorAll(".section-recettes-item .btn").forEach((element) => {
    element.addEventListener("click", () => adminManager.supprimerRecette(element.dataset.id));
  });
};

/**
 * Afficher tous les contacts
 * Ajouter événement click sur les boutons pour supprimer contacts
 */
const afficherContacts = async () => {
  await adminManager.afficherContacts();

  // boutons individuels
  document.querySelectorAll(".section-contacts-item .btn").forEach((element) => {
    element.addEventListener("click", () => adminManager.supprimerContact(element.dataset.id));
  });
};

/**
 * Réinitialise les recettes à travers adminManager
 * Affiche la nouvelle liste de recettes à travers afficherRecettes()
 */
const resetData = async () => {
  await adminManager.reinitialiserRecettes();
  await afficherRecettes();
};

// 3 boutons principaux
document.getElementById("afficher-recettes-btn").addEventListener("click", afficherRecettes);
document.getElementById("afficher-contacts-btn").addEventListener("click", afficherContacts);
document.getElementById("reinitialiser-contacts-btn").addEventListener("click", resetData);
