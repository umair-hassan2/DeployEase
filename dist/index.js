"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const simple_git_1 = __importDefault(require("simple-git"));
const path_1 = __importDefault(require("path"));
const helpers_1 = require("./helpers");
const objectStore_1 = require("./objectStore");
const messageBroker_1 = require("./messageBroker");
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.json({ "message": "server is running" });
});
app.post('/upload', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectUrl = req.body.projectUrl;
        console.log(projectUrl);
        const randomId = (0, helpers_1.randomIdGenerator)(15);
        yield (0, simple_git_1.default)().clone(projectUrl, path_1.default.join(__dirname, `projects/${randomId}`));
        const allFiles = (0, helpers_1.getAllDirFiles)(path_1.default.join(__dirname, `projects/${randomId}`));
        // upload each file to object store
        allFiles.forEach(file => {
            //console.log(file)
            (0, objectStore_1.uploadFile)(file.slice(__dirname.length + 1), file);
        });
        const connection = yield (0, messageBroker_1.connectTOMessageBroker)();
        if (connection) {
            (0, messageBroker_1.sendMessage)(`${randomId}`, connection);
        }
        else {
            console.log("Rabbit MQ connection failed");
        }
        res.json((0, helpers_1.generateMessage)("cloned sucessfuly", [randomId]));
    }
    catch (error) {
        console.log(`ERROR : ${error}`);
        res.status(500).json((0, helpers_1.generateMessage)("server error"));
    }
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
