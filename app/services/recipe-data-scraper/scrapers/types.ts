import * as cheerio from "cheerio";
import type { JsonLdRecipe, MicrodataResponse, RecipeJSON } from "../types";

// Base scraper interface
export interface IScraper {
    chtml: cheerio.CheerioAPI;
    type: string;
    meta: any;
    recipeItem: any;

    testForMetadata(): void;
    findRecipeItem(): void;
    getRecipe(): RecipeJSON;
    print(): void;
}

// JSON-LD specific scraper interface
export interface IJsonLdScraper extends IScraper {
    meta: JsonLdRecipe | JsonLdRecipe[] | null | undefined;
    recipeItem: JsonLdRecipe | null;
    type: "jsonld";
}

// Microdata specific scraper interface
export interface IMicrodataScraper extends IScraper {
    meta: MicrodataResponse | null;
    recipeItem: any | null; // Properties from microdata
    type: "microdata";
}

// Generic scraper constructor type
export type ScraperConstructor<T extends IScraper = IScraper> = new (
    chtml: cheerio.CheerioAPI,
    url?: string,
) => T;
