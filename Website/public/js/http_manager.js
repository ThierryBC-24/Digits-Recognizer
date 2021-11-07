const HTTPInterface = {
  SERVER_URL: "http://localhost:5000/api",

  GET: async function (endpoint) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`);
    return await response.json();
  },

  POST: async function (endpoint, data) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    });

    return await response.json();
  },

  DELETE: async function (endpoint) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
    });
    return await response.status;
  },

  PATCH: async function (endpoint) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "PATCH",
    });
    return response.status;
  },
};

export default class HTTPManager {
  constructor() {
    this.recettes = {};
    this.recipesBaseURL = "recettes";
    this.contactsBaseURL = "contacts";
  }

  /**
   * @todo Fait une requête GET à /api/recettes pour obtenir toutes les recettes
   * @returns les recettes récupérées
   */
  async fetchAllRecipes() {
    //TODO
    return [];
  }

  /**
   * @todo Fait une requête GET à /api/contacts pour obtenir tous les messages de contact
   * @returns les contacts récupérés
   */
  async fetchAllContacts() {
    //TODO
    return [];
  }

  /**
   * Récupérer toutes les recettes
   * @returns toutes les recettes récupérés du serveur
   */
  async getAllRecipes() {
    return new Promise(async (resolve, reject) => {
      try {
        this.recettes = await this.fetchAllRecipes();
        resolve(this.recettes);
      } catch (err) {
        reject("Échec lors de la requête GET /api/recettes");
      }
    });
  }

  /**
   * @todo Récupérer une recette à travers son paramètre id
   * @param {*} id : le id qui correspond à la recette qu'on cherche
   * @returns la recette correspondante ou une rédirection vers la page erreur.html si recettes n'existe pas ou en cas d'erreurs
   */
  async getRecipeByID(id) {
    //TODO
    return {};
  }

  /**
   * @todo Faire une requête vers /recettes/category/:category
   * Filtre les recettes en fonction d'une catégorie et retourne le résultat
   * Si category est undefined ou null, toutes les recettes sont retournées
   * @param {string} category categorie de recette pour le filtre
   * @returns les recettes de la catégorie de recheche
   */
  async getRecipesByCategory(category) {
    if (!category) {
      return await this.getAllRecipes();
    }
    //TODO
    return [];
  }

  /**
   * @todo Faire une requête vers /recettes/ingredient/:ingredient?matchExact
   * Filtre les recettes en fonction d'un ingrédient et retourne le résultat
   * Le paramètre matchExact est passée comme paramètre de query s'il est vrai
   *
   * Ex : /recettes/ingredient/monIngredient?matchExact=true si le paramètre est à true
   * sinon : /recettes/ingredient/monIngredient
   * @param {string} ingredient ingrédient pour le filtre
   * @param {boolean} matchExact recherche exacte ou non pour l'ingrédient
   * @returns les recettes de la catégorie de recheche
   */
  async getRecipesByIngredients(ingredient, matchExact) {
    //TODO
    return [];
  }

  /**
   * @todo Envoyer la nouvelle recette au serveur pour la stocker dans la liste des recettes
   * @param {*} recette
   */
  async addNewRecipe(newRecipe) {
    //TODO
  }

  /**
   * @todo Faire une requête DELETE pour supprimer une recette identifiée par son id
   * @param {*} id: recette à supprimer
   */
  async deleteRecipe(id) {
    //TODO
  }

  /**
   * @todo Faire une requête DELETE pour supprimer un contact identifié par son id
   * @param {*} id: contact à supprimer
   */
  async deleteContact(id) {
    //TODO
  }

  /**
   * Faire une requête PATCH pour réinitialiser la liste des recettes
   */
  async resetRecipes() {
    try {
      await HTTPInterface.PATCH(`${this.recipesBaseURL}/admin/reset`);
    } catch (error) {
      console.log("An error has occured while reseting recipes", error);
    }
  }
}
