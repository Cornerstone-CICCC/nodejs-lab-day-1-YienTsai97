"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// export const cookieAuthCheck = (req: Request, res: Response, next: NextFunction) => {
//     const { isAuthenticated } = req.signedCookies
//     if (isAuthenticated) {
//         next()
//     } else {
//         res.status(403).send("403")
//     }
// }
const JWT_SECRET = process.env.JET_SECRET || "default_secret";
function generateToken(user) {
    return jsonwebtoken_1.default.sign(user, JWT_SECRET, { expiresIn: '1h' });
}
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (err) {
        return null;
    }
}
