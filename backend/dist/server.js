"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Create your server
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//create server
const app = (0, express_1.default)();
//Middleware
app.use((0, cors_1.default)({
    origin: "http://localhost:4321",
    credentials: true,
}));
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SIGNKEY)); //need to put on top because of the express.json() need to read it
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//Router
const user_routes_1 = __importDefault(require("./routes/user.routes"));
app.use('/', user_routes_1.default);
//404 Fallback
app.use((req, res) => {
    res.status(404).send("Invalid route!");
});
//Start Server
const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}...`);
});
