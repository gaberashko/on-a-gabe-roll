import * as cheerio from "cheerio";
import { parseIngredient } from "./Parsers/IngredientsParser";
import type { SectionalIngredients, SectionalInstructions } from "./types";

/**
 * Extracts structural headings inside a section class
 *
 * @param token - Token string to be parsed for float value
 * @returns Float value represented by token. Returns 0 if unable to parse.
 */
function extractPageHeaders(chtml: cheerio.CheerioAPI, containerSelector: string): string[] {

}