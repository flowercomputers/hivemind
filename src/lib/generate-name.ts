import { getAgentByName } from "@/db/queries";
import COLOR_NAMES from "./color-names";
import C_NAMES from "./c-names";

/**
 * Generates a username based on the given name. If the given name is not available,
 * it will append a number to the end of the username until it is available.
 * If no given name is provided, it will use a random color name.
 *
 * @param givenName - The given name of the user.
 * @returns The generated username.
 */
const generateUsername = (givenName?: string) => {
  if (!givenName) {
    const colorName = generateRandomColorName();
    const cName = generateRandomCName();
    const username = `${colorName}-${cName}`;
    return appendRandomStringUntilAvailable(username);
  }

  return appendRandomStringUntilAvailable(givenName);
};

export default generateUsername;

/**
 * Appends a random string to the end of the username until it is available.
 * errors after 10 attempts.
 *
 * @param username - The username to append the random string to.
 * @param attempt - The current attempt number.
 * @returns The available username.
 */
const appendRandomStringUntilAvailable = (
  username: string,
  attempt = 1,
) => {
  if (attempt > 10) {
    throw new Error("too many username unique attempts");
  }

  const agent = getAgentByName(username);

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
  const randomColor =
    COLOR_NAMES[Math.floor(Math.random() * COLOR_NAMES.length)];
  return randomColor;
};

const generateRandomCName = () => {
  const randomCName =
    C_NAMES[Math.floor(Math.random() * C_NAMES.length)];
  return randomCName;
};
