const express = require("express");
const fs = require("fs");
const path = require("path");
const http = require("http");
const glob = require("glob");

const texturesFolder = "./content/textures/";
const materialsFolder = "./content/materials/";

const textureCategories = glob.sync(`${texturesFolder}*/`, [])
    .map(textureDirPath => textureDirPath
        .replace("./content/textures/", "")
        .replace("/", ""));

const textures = glob.sync(`${texturesFolder}**/*{.jpg,.png}`, [])
    .map(texturePath => {
        return {
            url: texturePath.split("./content/textures")[1],
            name: texturePath.split("/").find((sub, i, arr) => i === arr.length-1),
            type: texturePath.split(".").find((sub, i, arr) => i === arr.length-1)
        };
});

const materialCategories = glob.sync(`${materialsFolder}*/`, [])
    .map(materialDirPath => materialDirPath
        .replace("./content/materials/", "")
        .replace("/", ""));

const materials = glob.sync(`${materialsFolder}**/*.json`, [])
    .map(materialPath => {
        return {
            url: materialPath.split("./content/materials")[1],
            name: materialPath.split("/").find((sub, i, arr) => i === arr.length-1).replace(".json","")
        };
});
console.table(materials);

const config = require("./config.json");

const app = express();

app.use(require("./middleware/cors"));
app.use(express.static(__dirname + "/content"));
app.get("/", (req, res) => res.json("api"));
app.get("/data/world/0.json", (req, res) => res.json(JSON.parse(fs.readFileSync(path.join(__dirname, "content/data/world/0.json")))));

// this is temporary until back end becomes focus
app.get("/materialCategories", (req, res) => res.json(materialCategories));
app.get("/materials", (req, res) => {
    const searchTerm = req.query.search;
    let searchCategories = [];
    if(req.query.categories)
    {
        searchCategories = req.query.categories.split(",");
    }

    const searchCategoryMethod = (material) => {
        if(searchCategories.length === 0) return true;
        const folder = material.url.split("/")[1];
        
        if(!folder || folder.length < 1) return false;
        let sum = 0;
        searchCategories.forEach(category => {
            if(folder.match(category)) sum++;
        });

        return sum > 0;
    };

    const searchTermMethod = (material) => material.name.search(searchTerm) !== -1;

    if(searchTerm && searchTerm.length > 0
    || searchCategories && searchCategories.length > 0)
    {
        res.json(materials
            .filter(searchCategoryMethod)
            .filter(searchTermMethod)
        );
    }
    else
    {
        res.json(materials);
    }
});

app.get("/textureCategories", (req, res) => res.json(textureCategories));
app.get("/textures", (req, res) => {
    const searchTerm = req.query.search;
    let searchCategories = [];
    if(req.query.categories)
    {
        searchCategories = req.query.categories.split(",");
    }

    const searchCategoryMethod = (texture) => {
        if(searchCategories.length === 0) return true;
        const folder = texture.url.split("/")[1];
        
        if(!folder || folder.length < 1) return false;
        let sum = 0;
        searchCategories.forEach(category => {
            if(folder.match(category)) sum++;
        });

        return sum > 0;
    };

    const searchTermMethod = (texture) => texture.name.search(searchTerm) !== -1;

    if(searchTerm && searchTerm.length > 0
    || searchCategories && searchCategories.length > 0)
    {
        res.json(textures
            .filter(searchCategoryMethod)
            .filter(searchTermMethod)
        );
    }
    else
    {
        res.json(textures);
    }
});

app.listen(Number(config.port), () => {
    console.log(`Started on port ${config.port}`);
});