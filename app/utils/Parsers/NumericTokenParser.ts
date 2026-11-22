const FRACTION_MAP = {
    "¼": 0.25,
    "½": 0.5,
    "¾": 0.75,
    "⅓": 1 / 3,
    "⅔": 2 / 3,
    "⅕": 0.2,
    "⅖": 0.4,
    "⅗": 0.6,
    "⅘": 0.8,
    "⅙": 1 / 6,
    "⅚": 5 / 6,
    "⅛": 0.125,
    "⅜": 0.375,
    "⅝": 0.625,
    "⅞": 0.875,
    "⅐": 1 / 7,
    "⅑": 1 / 9,
    "⅒": 1 / 10,
};

/**
 * Normalizes an individual token or text fraction into a clean floating-point number
 *
 * @param token - Token string to be parsed for float value
 * @returns Float value represented by token. Returns 0 if unable to parse.
 */
export function parseNumericToken(token: string): number {
    let normalizedNumericToken = fractionUnicodeToDecimal(token);
    console.log("number token?:", token, "normalized:", normalizedNumericToken);
    // Matches standard decimal number representations (e.g. 2, 1.50, 0.25)
    if (/^\d+(\.\d+)?$/.test(normalizedNumericToken)) {
        return parseFloat(normalizedNumericToken);
    }
    // Matches fracitonal number representation (e.g. 1/2)
    if (/^\d+\/\d+$/.test(normalizedNumericToken)) {
        console.log("fractional thing found");
        const [numerator = "", denominator = ""] = normalizedNumericToken.split("/");
        console.log("numerator:", numerator, "denom:", denominator);
        return parseFloat(numerator) / parseFloat(denominator);
    }

    return 0;
}

/**
 * Converts the unicode fractions of a string into their decimal numeric equivalent
 *
 * @param str - The string containing a unicode fraction
 * @returns A copy of str with unicode fractions as numeric decimal representations
 */
export function fractionUnicodeToDecimal(str: string): string {
    let convertedString = str;
    for (const [key, value] of Object.entries(FRACTION_MAP)) {
        convertedString = convertedString.replace(key, value.toString());
    }

    return convertedString;
}
