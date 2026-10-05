import { parseNumericToken, fractionUnicodeToDecimal } from "./NumericTokenParser";
import { findUnitKey, sanitizeWord } from "./StringParser";
import { MEASUREMENT_UNITS } from "../Measurement";

export default function transformToIngredients(ingredients: string[]): Ingredient[] {}

/**
 *
 * @param str {string} - Ingredient string to be processed
 */
function parseIngredient(str: string): Ingredient {
    let primaryQuantity = 0;
    let primaryUnit = "";
    let acc = 0;
    const leftoverTokens: string[] = [];

    let potentialConnector = false;

    const tokens = str.split(/\+s/);

    for (const token of tokens) {
        const numValue = parseNumericToken(token);
        const unitKey = findUnitKey(token);

        if (numValue > 0) {
            acc += numValue;
        } else if (unitKey) {
            if (primaryUnit === "") {
                primaryQuantity = acc ? acc : 1;
                primaryUnit = unitKey;
            } else {
                const secondaryQuantity = acc ? acc : 1;

                const fromUnitData = (MEASUREMENT_UNITS as any)[unitKey];
                const toUnitData = (MEASUREMENT_UNITS as any)[primaryUnit];

                if (fromUnitData && toUnitData) {
                    const quantityInBaseUnit =
                        (secondaryQuantity * fromUnitData.baseValue) / toUnitData.baseValue;

                    primaryQuantity += quantityInBaseUnit;
                }
            }
            acc = 0;
            potentialConnector = true;
        } else {
            const word = sanitizeWord(token);
            // Skip irrelevant connector words if following unit (e.g. 1 cup 'of'...)
            if (!(potentialConnector && ["of", "and", "plus"].includes(word))) {
                leftoverTokens.push(token);
            }
            potentialConnector = false;
        }
    }
    const ingredientName = leftoverTokens.join(" ");

    return {
        name: ingredientName,
        measurement: 
    }
}
