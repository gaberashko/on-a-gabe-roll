import * as cheerio from "cheerio";
import { toAlphaString } from "./Parsers/StringParser";
import { parseIngredient } from "./Parsers/IngredientsParser";
import type { SectionalIngredients, SectionalInstructions } from "./types";

interface FlattenedDOMNode {
    index: number;
    tagName: string;
    rawText: string;
    alphaOnlyText: string;
    isHeading: boolean;
    isCandidateItem: boolean;
}

// TODO: fill javadocs for function headers
/**
 *
 * @param $
 * @param textContent
 * @returns
 */
function findClosestPrecedingHeader($: cheerio.CheerioAPI, textContent: string): string {
    let matchedHeader = ""; // Default fallback if no headers found
    const cleanJSONText = toAlphaString(textContent);

    if (!cleanJSONText) return matchedHeader;

    let target: cheerio.Cheerio<any> | null = null;

    $("li, p, div").each((_, el) => {
        const cleanDOMText = toAlphaString($(el).text());

        if (
            cleanDOMText &&
            (cleanDOMText.includes(cleanJSONText) || cleanJSONText.includes(cleanDOMText))
        ) {
            if (!target || $(el).is("li")) {
                target = $(el);
            }
        }
    });

    if (!target) return matchedHeader;

    // We have a target element to begin preceding traversal from
    const allTextElements = $("h1, h2, h3, h4, h5, p, strong, b, li, p, div");

    const targetIndex = allTextElements.index(target);

    // Step backwards in doc flow order
    for (let i = targetIndex - 1; i >= 0; --i) {
        const curElement = $(allTextElements[i]);
        const tagName = curElement.prop("tagName")?.toLowerCase() || "";

        if (
            ["h1", "h2", "h3", "h4", "h5"].includes(tagName) ||
            (tagName === "p" && curElement.find("strong, b").length > 0) ||
            curElement.is("strong, b")
        ) {
            const headerText = curElement.text().trim().replace(/:$/, "");

            if (
                headerText &&
                !["ingredients", "directions", "instructions", "method", "preparation"].includes(
                    headerText.toLowerCase(),
                )
            ) {
                matchedHeader = headerText;
                break;
            }
        }
    }
    return matchedHeader;
}

function buildCachedDomList($: cheerio.CheerioAPI): FlattenedDOMNode[] {
    const cachedNodes: FlattenedDOMNode[] = [];
    const allElements = $("h1, h2, h3, h4, h5, h6, p, li, strong, b, div");

    allElements.each((index, el) => {
        const $el = $(el);
        const tagName = $el.prop("tagName")?.toLowerCase() || "";
        const rawText = $el.text().trim();
        const alphaOnlyText = toAlphaString(rawText);

        if (!alphaOnlyText) return;

        const isHeading =
        const 

        cachedNodes.push({
            index,
            tagName,
            rawText,
            alphaOnlyText,
            isHeading,
            isCandidateItem
        })
    });

    return cachedNodes;
}

function findHeader

/**
 *
 * @param flatIngredients
 * @param flatInstructions
 * @param $
 */
function buildSectionalRecipe(
    flatIngredients: string[],
    flatInstructions: string[],
    $: cheerio.CheerioAPI,
) {
    const cachedNodes = buildCachedDomList($);

    const sectionalIngredients: Record<string, any[]> = {};
    const sectionalInstructions: Record<string, string[]> = {};

    // Cluster ingredients dynamically by locating their preceding DOM header
    flatIngredients.forEach((line) => {
        const cleanLine = line.trim();
        if (!cleanLine) continue;
        // TODO: address this bottleneck below V
        // This is a bottleneck. We likely don't need to keep backtracking the DOM until we reach certain markers
        const sectionTitle = findClosestPrecedingHeader($, cleanLine);
        const parsedRow = parseIngredient(cleanLine);

        if (!sectionalIngredients[sectionTitle]) {
            sectionalIngredients[sectionTitle] = [];
        }
        sectionalIngredients[sectionTitle]?.push(parsedRow);
    });

    flatInstructions.forEach((line) => {
        const cleanLine = line.trim();
        if (!cleanLine) continue;

        const sectionTitle = findClosestPrecedingHeader($, cleanLine);
        if (!sectionalInstructions[sectionTitle]) {
            sectionalInstructions[sectionTitle] = [];
        }
        sectionalInstructions[sectionTitle].push(cleanLine);
    })

    return {
        sectionalIngredients:,
        sectionalInstructions:
    }
}
