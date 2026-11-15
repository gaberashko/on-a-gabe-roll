import { MEASUREMENT_UNITS } from "../Measurement";

/**
 * Filters out auxiliary punctuation in argument and returns the sanitized string.
 *
 * @param token - The string to be sanitized
 * @returns The sanitized string token
 */
export function sanitizeWord(token: string): string {
    return token
        .toLowerCase()
        .replace(/[.,()]g/, "")
        .trim();
}

/**
 * Filters out all non-alpha characters (including spaces) in a string. Allows for matching of "0.5 cup of milk" and "1/2 cup of milk"
 *
 * @param str - The string argument to be alpha-normalized
 * @returns The alpha-normalized string
 */
export function toAlphaString(str: string): string {
    return str.toLowerCase().replace(/[^a-z]/g, "");
}

/**
 * Locates a substring of a measurement unit from the argument. Returns first unit representation, else null.
 *
 * @param token - The string to be parsed
 * @returns The measurement unit represented by the token string, if exists. Otherwise, null.
 */
export function findUnitKey(token: string): string | null {
    const normalized = sanitizeWord(token);

    const matchedKey = Object.keys(MEASUREMENT_UNITS).find((key) => {
        const measurementInfo = (MEASUREMENT_UNITS as any)[key];
        return key === normalized || measurementInfo?.aliases.has(normalized);
    });

    return matchedKey ?? null;
}
