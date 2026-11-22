import * as cheerio from "cheerio";
import { toAlphaString } from "./Parsers/StringParser";
import { parseIngredient } from "./Parsers/IngredientsParser";
import type { SectionalIngredients, SectionalInstructions } from "./types";

const DEFAULT_HEADER = "Main Preparation";

interface FlattenedDOMNode {
    alphaOnlyText: string;
    header: string;
    rawLength: number;
    isListItem: boolean;
}

function isStructuralHeading($el: cheerio.Cheerio<any>, tagName: string, rawText: string): boolean {
    if (!rawText) return false;

    if (/^h[1-6]$/.test(tagName)) {
        return true;
    }

    if (tagName === "p") {
        const boldText = $el.find("strong, b").text().trim();
        return boldText.length > 0 && boldText === rawText;
    }

    return false;
}

/**
 *
 * @param $
 * @returns
 */
function buildCachedDomList($: cheerio.CheerioAPI): FlattenedDOMNode[] {
    const cachedNodes: FlattenedDOMNode[] = [];
    const allElements = $("h1, h2, h3, h4, h5, h6, p, li, strong, b, div");
    let activeHeader = DEFAULT_HEADER;

    allElements.each((index, el) => {
        const $el = $(el);
        const tagName = $el.prop("tagName")?.toLowerCase() || "";

        // Ignore obvious <div> wrapper elements and prevent container overmatching
        if (
            tagName === "div" &&
            $el.find("p, li, div, ul, ol, h1, h2, h3, h4, h5, h6").length > 0
        ) {
            return;
        }

        const rawText = $el.text().trim();
        if (!rawText) return;

        if (isStructuralHeading($el, tagName, rawText)) {
            activeHeader = rawText.replace(/:$/, "") || activeHeader;
            return;
        }

        const alphaOnlyText = toAlphaString(rawText);
        if (alphaOnlyText) {
            cachedNodes.push({
                alphaOnlyText,
                header: activeHeader,
                isListItem: tagName === "li",
                rawLength: rawText.length,
            });
        }
    });

    return cachedNodes;
}

function findHeaderWithCursor(
    jsonText: string,
    cachedNodes: FlattenedDOMNode[],
    cursorState: { nextIndex: number },
): string {
    const targetAlpha = toAlphaString(jsonText);
    if (!targetAlpha) return DEFAULT_HEADER;

    let bestMatchIndex = -1;
    let shortestLength = Infinity;
    let matchedNode: FlattenedDOMNode | null = null;

    for (let i = cursorState.nextIndex; i < cachedNodes.length; ++i) {
        const node = cachedNodes[i] as FlattenedDOMNode;

        const isMatch =
            node.alphaOnlyText.includes(targetAlpha) || targetAlpha.includes(node.alphaOnlyText);

        if (isMatch) {
            const effectiveLength = node.rawLength;
            if (effectiveLength < shortestLength) {
                shortestLength = effectiveLength;
                bestMatchIndex = i;
            }
            // TODO: address the arbitrary '40' character limit uncertainty we allow
            if (node.isListItem || node.rawLength < jsonText.length + 40) {
                break;
            }
        }
    }

    if (bestMatchIndex === -1) return DEFAULT_HEADER;

    // Move the cursor so the next ingredient searches the next node.
    cursorState.nextIndex = bestMatchIndex + 1;

    return cachedNodes[bestMatchIndex]?.header || DEFAULT_HEADER;
}

/**
 *
 * @param flatIngredients
 * @param flatInstructions
 * @param $
 */
export function buildSectionalRecipe(
    flatIngredients: string[],
    flatInstructions: string[],
    $: cheerio.CheerioAPI,
) {
    const cachedNodes = buildCachedDomList($);

    // console.log("cached nodes:", cachedNodes);

    const sectionalIngredients: Record<string, any[]> = {};
    const sectionalInstructions: Record<string, string[]> = {};

    const ingredientCursor = { nextIndex: 0 };
    const instructionCursor = { nextIndex: 0 };

    // Cluster ingredients dynamically by locating their associated DOM header from cached nodes.
    flatIngredients.forEach((line) => {
        const cleanLine = line.trim();
        // console.log('clean line:', cleanLine)
        if (cleanLine) {
            // console.log('ingredientCursor:', ingredientCursor)
            const sectionTitle = findHeaderWithCursor(cleanLine, cachedNodes, ingredientCursor);
            // console.log('sectionTitle:', sectionTitle)
            const parsedRow = parseIngredient(cleanLine);

            if (!sectionalIngredients[sectionTitle]) {
                sectionalIngredients[sectionTitle] = [];
            }
            sectionalIngredients[sectionTitle]?.push(parsedRow);
        }
    });

    flatInstructions.forEach((line) => {
        const cleanLine = line.trim();

        if (cleanLine) {
            const sectionTitle = findHeaderWithCursor(cleanLine, cachedNodes, instructionCursor);
            if (!sectionalInstructions[sectionTitle]) {
                sectionalInstructions[sectionTitle] = [];
            }
            sectionalInstructions[sectionTitle].push(cleanLine);
        }
    });

    return {
        sectionalIngredients: Object.entries(sectionalIngredients).map(
            ([sectionTitle, ingredients]) => ({ sectionTitle, ingredients }),
        ),
        sectionalInstructions: Object.entries(sectionalInstructions).map(
            ([sectionTitle, steps]) => ({ sectionTitle, steps }),
        ),
    };
}
