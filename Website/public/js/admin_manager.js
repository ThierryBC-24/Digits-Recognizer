import HTTPManager from "./http_manager.js";

export default class AdminManager {
  constructor() {
    this.httpManager = new HTTPManager();
  }

  /**
   * Afficher toutes les recettes
   */
  async afficherRecettes() {
    const recettes = await this.httpManager.fetchAllRecipes();
    const section = document.querySelector(".admin-main section");
    section.innerHTML = "";

    recettes.forEach((recette) => {
      section.innerHTML += `<div class="section-recettes-item section-item" data-id=${recette.id}>
            <img alt="recette-img" src="${recette.img}" class="section-img" />
            <p class="section-title">${recette.nom}</p>
            <button class="btn section-trash-icon" data-id=${recette.id}>
                <i class="fas fa-trash"></i>
            </button>
        </div>`;
    });
  }

  /**
   * Afficher tous les contacts
   */
  async afficherContacts() {
    const contacts = await this.httpManager.fetchAllContacts();
    const section = document.querySelector(".admin-main section");
    section.innerHTML = "";

    contacts.forEach((contact) => {
      section.innerHTML += `<div class="section-contacts-item section-item" data-id=${contact.id}>
            <div class="section-header">
              <p class="section-contact-name">${contact.name}</p>
              <small>${contact.email}</small>
            </div>
            <p class="section-contact-message">${contact.message}</p>
            <button class="btn section-trash-icon" data-id=${contact.id}>
                <i class="fas fa-trash"></i>
            </button>
        </div>`;
    });
  }

  /**
   * @todo Appeler HTTPManager pour supprimer la recette
   * Enlever la recette correspondante du DOM
   * @param {*} id id de la recette à supprimer
   */
  async supprimerRecette(id) {
    //TODO
  }

  /**
   * @todo Appeler HTTPManager pour supprimer le contact
   * Enlever la recette correspondante du DOM
   * @param {*} id id du contact à supprimer
   */
  async supprimerContact(id) {
    //TODO
  }

  /**
   * @todo Appeler HTTPManger pour réinitialiser les recettes
   */
  async reinitialiserRecettes() {
    //TODO
  }

  /**
   * Enlever un noeud du DOM s'il correspond au id qu'on veut enlever
   * @param {*} className : la classe sur laquelle itérer (soit recettes soit contacts)
   * @param {*} id : le id qui correspond à l'objet supprimé
   */
  removeElementFromDOM(className, id) {
    document.querySelectorAll(className).forEach((element) => {
      if (element.dataset.id === id) {
        element.remove();
      }
    });
  }
}
