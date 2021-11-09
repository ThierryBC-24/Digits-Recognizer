const path = require("path");
const express = require("express");
const { HTTP_STATUS } = require("./js/utils/http");
const { FileSystemManager } = require("./js/managers/file_system_manager");

const app = express();
const PORT = 5000;
const SIZE_LIMIT = "10mb";
const PUBLIC_PATH = path.join(__dirname + "/public/");
const fileSystemManager = new FileSystemManager();

/**
 * initialiser les différents middlewares et routes
 */

// afficher chaque nouvelle requête dans la console
app.use((request, response, next) => {
    console.log(`New HTTP request: ${request.method} ${request.url}`);
    next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: SIZE_LIMIT }));
app.use(express.static(PUBLIC_PATH)); // permet de situer les fichiers css, images et scripts qui sont dans /public

/**
 * Middleware qui est exécuté à chaque requête pour retourner le fichier HTML correspondant
 * @todo vérifier dynamiquement si un tel fichier html existe dans le dossier /pages selon le route en question
 * @returns la requête renvoie le fichier correspondant avec un code 200, ou bien une erreur HTTP 404 et la page error.html
 */
app.get("/*", async(request, response) => {
    let currentRoute = request.path.split("/")[1];
    currentRoute = currentRoute === "" ? "index" : currentRoute;
    // TODO
    filePath = path.join(PUBLIC_PATH + "pages/" + currentRoute + ".html");

    fileSystemManager.checkFile(filePath).then(() => {
        // Promesse tenue
        response.sendFile(filePath);
    }, () => {
        // Rejet de la promesse
        response.status(404).sendFile(PUBLIC_PATH + "pages/erreur.html");
    });
});

/**
 * Se produit lorsque le serveur commence à écouter sur le port.
 */
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = server;