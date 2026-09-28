import { parseNumericToken, fractionUnicodeToDecimal } from "./NumericTokenParser";
import { findUnitKey } from "./StringParser";

export default function transformToIngredients(ingredients: string[]): Ingredient[] {}

/**
 *
 * @param str {string} - Ingredient string to be processed
 */
function parseIngredient(str: string): Ingredient {
    const primaryQuantity = 0;
    const primaryUnit = "";

    const tokens = str.split(/\+s/);

    for (const token of tokens) {
        const numValue = parseNumericToken(token);
        const unitKey = findUn;
    }
}
