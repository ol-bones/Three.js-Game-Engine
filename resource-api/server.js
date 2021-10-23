const express = require("express");
const fs = require("fs");
const path = require("path");
const http = require("http");
const glob = require("glob");

const texturesFolder = "./content/textures/";
const materialsFolder = "./content/materials/";
const entitiesFolder = "./content/entities/";

// this is temporary until back end becomes focus
const entityCategories = glob.sync(`${entitiesFolder}*/`, [])
    .map(entityDirPath => entityDirPath
        .replace("./content/entities/", "")
        .replace("/", ""));

const entities = glob.sync(`${entitiesFolder}**/*.json`, [])
    .map(entityPath => {
        console.log(entityPath);
        return {
            url: entityPath.replace("./content", ""),
            category: entityPath.split("./content/entities")[1].split("/")[1],
            name: entityPath.split("/").find((sub, i, arr) => i === arr.length-1).replace(".json", "")
        };
});

console.table(entityCategories);
console.table(entities);

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
            name: materialPath.replace("./content/materials/","").replace(".json","")
        };
});

const config = require("./config.json");

const app = express();

app.use(require("./middleware/cors"));
app.use(express.json({limit: 1000000}));
app.use(express.static(__dirname + "/content"));
app.get("/", (req, res) => res.json("api"));
app.get("/data/world/0.json", (req, res) => res.json(JSON.parse(fs.readFileSync(path.join(__dirname, "content/data/world/0.json")))));

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

app.get("/entityCategories", (req, res) => res.json(entityCategories));
app.get("/entities/", (req, res) => res.json(entities));

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

const getWorlds = () => fs.readdirSync("./content/data/", { withFileTypes: true })
                            .filter(entry => entry.isDirectory())
                            .map(entry => entry.name);

const getPieces = (world) =>  fs.readdirSync(`./content/data/${world}`, { withFileTypes: true })
                                .filter(entry => entry.isFile())
                                .filter(entry => path.extname(entry.name) === ".json")
                                .map(entry => entry.name);
                                
app.get("/worlds", (req, res) => {
    res.json({
        "worlds": getWorlds() || []
    });
});

app.get("/:world/pieces", (req, res) => {
    res.json({
        "pieces": getPieces(req.params.world) || []
    });
});

app.get("/shaders/TerrainMapMaterial", (req, res) => {
    res.json({
        "fragmentShader": fs.readFileSync("./content/shaders/TerrainMapMaterial/TerrainMapMaterial_fragment.glsl", { encoding: "utf8"}),
        "vertexShader": fs.readFileSync("./content/shaders/TerrainMapMaterial/TerrainMapMaterial_vertex.glsl", { encoding: "utf8"})
    });
});

app.get("/shaders/VegetationMaterial", (req, res) => {
    res.json({
        "fragmentShader": fs.readFileSync("./content/shaders/VegetationMaterial/VegetationMaterial_fragment.glsl", { encoding: "utf8"}),
        "vertexShader": fs.readFileSync("./content/shaders/VegetationMaterial/VegetationMaterial_vertex.glsl", { encoding: "utf8"})
    });
});

app.get("/shaders/FlameShader", (req, res) => {
    res.json({
        "fragmentShader": fs.readFileSync("./content/shaders/FlameShader/FlameShader_fragment.glsl", { encoding: "utf8"}),
        "vertexShader": fs.readFileSync("./content/shaders/FlameShader/FlameShader_vertex.glsl", { encoding: "utf8"})
    });
});

app.post("/save", (req, res) => {
    return;
    const data = req.body;
    fs.writeFileSync(`${data.location}${data.name}`, JSON.stringify(data.world));
});

app.listen(Number(config.port), () => {
    console.log(`Started on port ${config.port}`);
});