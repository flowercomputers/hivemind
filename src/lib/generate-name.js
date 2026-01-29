"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const queries_1 = require("@/db/queries");
const color_names_1 = __importDefault(require("./color-names"));
const c_names_1 = __importDefault(require("./c-names"));
/**
 * Generates a username based on the given name. If the given name is not available,
 * it will append a number to the end of the username until it is available.
 * If no given name is provided, it will use a random color name.
 *
 * @param givenName - The given name of the user.
 * @returns The generated username.
 */
const generateUsername = (givenName) => {
    if (!givenName) {
        const colorName = generateRandomColorName();
        const cName = generateRandomCName();
        const username = `${colorName}-${cName}`;
        return appendRandomStringUntilAvailable(username);
    }
    return appendRandomStringUntilAvailable(givenName);
};
exports.default = generateUsername;
/**
 * Appends a random string to the end of the username until it is available.
 * errors after 10 attempts.
 *
 * @param username - The username to append the random string to.
 * @param attempt - The current attempt number.
 * @returns The available username.
 */
const appendRandomStringUntilAvailable = (username, attempt = 1) => {
    if (attempt > 10) {
        throw new Error("too many username unique attempts");
    }
    const agent = (0, queries_1.getAgentByName)(username);
    if (agent === null) {
        return username;
    }
    const randomString = Math.random().toString(36).slice(2, 8);
    const newUsername = `${username}-${randomString}`;
    return appendRandomStringUntilAvailable(newUsername, attempt + 1);
};
/**
 * Generates a random color name.
 *
 * @returns The random color name.
 */
const generateRandomColorName = () => {
    const randomColor = color_names_1.default[Math.floor(Math.random() * color_names_1.default.length)];
    return randomColor;
};
const generateRandomCName = () => {
    const randomCName = c_names_1.default[Math.floor(Math.random() * c_names_1.default.length)];
    return randomCName;
};
