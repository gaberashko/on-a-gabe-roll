import Big from "big.js";
import { parseNumericToken } from "./NumericTokenParser";
import { findUnitKey, sanitizeWord } from "./StringParser";
import { MEASUREMENT_UNITS } from "../Measurement";

const CONTAINER_WORDS = new Set([
    "package",
    "packages",
    "pkg",
    "pkgs",
    "brick",
    "bricks",
    "can",
    "cans",
    "jar",
    "jars",
    "box",
    "boxes",
    "bag",
    "bags",
    "bottle",
    "bottles",
    "container",
    "containers",
    "carton",
    "cartons",
    "packet",
    "packets",
]);

/**
 *
 * @param str {string} - Ingredient string to be processed
 */
export function parseIngredient(str: string): { name: string; quantity: number; unit: string } {
    let primaryQuantity = new Big(0);
    let primaryUnit = "";
    let acc = 0;
    let isPackageMultiplier = false;
    let skipContainerNoun = false;
    const leftoverTokens: string[] = [];

    let potentialConnector = false;
    console.log("str:", str);
    const tokens = str.split(/\s+/);
    console.log("tokens:", tokens);

    for (const token of tokens) {
        const numValue = parseNumericToken(token);
        const unitKey = findUnitKey(token);
        console.log("token:", token, "unitKey found:", unitKey, "num found:", numValue);

        if (numValue > 0) {
            if (acc > 0 && Number.isInteger(acc) && numValue >= 1) {
                // Two integers of same unit indicate multiplier (e.g. "3 8 oz. of cream cheese")
                acc *= numValue;
                isPackageMultiplier = true;
            } else {
                // Mixed fraction incidates addition of same unit.
                acc += numValue;
            }
        } else if (unitKey) {
            if (primaryUnit === "") {
                primaryQuantity = new Big(acc ? acc : 1);
                primaryUnit = unitKey;
            } else {
                const secondaryQuantity = acc ? acc : 1;

                const fromUnitData = (MEASUREMENT_UNITS as any)[unitKey];
                const toUnitData = (MEASUREMENT_UNITS as any)[primaryUnit];

                if (fromUnitData && toUnitData) {
                    const quantityInBaseUnit = new Big(secondaryQuantity)
                        .times(fromUnitData.baseValue)
                        .div(toUnitData.baseValue);

                    primaryQuantity = primaryQuantity.plus(quantityInBaseUnit);
                }
            }
            acc = 0;
            potentialConnector = true;
            skipContainerNoun = isPackageMultiplier;
            isPackageMultiplier = false;
        } else {
            const word = sanitizeWord(token);

            if (skipContainerNoun && CONTAINER_WORDS.has(word)) {
                potentialConnector = true;
            } else {
                // Skip irrelevant connector words if following unit (e.g. 1 cup 'of'...)
                if (!(potentialConnector && ["of", "and", "plus"].includes(word))) {
                    leftoverTokens.push(token);
                }
                potentialConnector = false;
            }
            skipContainerNoun = false;
        }
    }
    const ingredientName = leftoverTokens.join(" ");

    return { name: ingredientName, quantity: primaryQuantity.toNumber(), unit: primaryUnit };
}
