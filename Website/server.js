const path = require("path");
const express = require("express");
const { FileSystemManager } = require("./public/js/file_system_manager");

const app = express();
const PORT = process.env.PORT || 5000;

const PUBLIC_PATH = path.join(__dirname + "/public/");
const fileSystemManager = new FileSystemManager();

app.use((request, response, next) => {
    console.log(`New HTTP request: ${request.method} ${request.url}`);
    next();
});
app.use(express.static(PUBLIC_PATH));

app.get("/*", async(request, response) => {
    let currentRoute = request.path.split("/")[1];
    currentRoute = currentRoute === "" ? "index" : currentRoute;
    filePath = path.join(PUBLIC_PATH + "pages/" + currentRoute + ".html");

    fileSystemManager.checkFile(filePath).then(() => {
        response.sendFile(filePath);
    }, () => {
        response.status(404).sendFile(PUBLIC_PATH + "pages/error.html");
    });
});

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
module.exports = server;