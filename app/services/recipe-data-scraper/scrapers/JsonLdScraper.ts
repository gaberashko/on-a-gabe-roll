import logger from "../utils/logger";
import Scraper from "./Scraper";
import type { IJsonLdScraper } from "./types";
import type { JsonLdRecipe } from "../types";
import * as cheerio from "cheerio";

class JsonLdScraper extends Scraper implements IJsonLdScraper {
    override type = "jsonld" as const;
    override meta: JsonLdRecipe | JsonLdRecipe[] | null | undefined = null;
    override recipeItem: JsonLdRecipe | null = null;

    constructor(chtml: cheerio.CheerioAPI) {
        super(chtml);
    }

    private isRecipeType(type: unknown): boolean {
        if (!type) return false;

        if (type === "Recipe") return true;

        if (Array.isArray(type)) {
            return type.indexOf("Recipe") !== -1;
        }

        return false;
    }

    testForMetadata(): void {
        const json: JsonLdRecipe[] = [];
        const jsonLdFromHtml = this.chtml('script[type="application/ld+json"]');

        // Properly iterate over only the DOM elements, not all cheerio object properties
        jsonLdFromHtml.each((_, element) => {
            try {
                // Access the text content of the script tag directly
                const scriptContent = this.chtml(element).text().trim();
                // console.log("script content:", scriptContent);
                if (!scriptContent) return;

                const parsedContent = JSON.parse(scriptContent);
                console.log("parsed JSON content:", parsedContent);

                // Validate that it's a reasonable JSON-LD object
                if (parsedContent && typeof parsedContent === "object") {
                    json.push(parsedContent as JsonLdRecipe);
                }
            } catch (e) {
                logger("JsonLd: error parsing the json data", e);
                // Fail silently, in case there are valid tags
                return;
            }
        });

        if (json.length === 0) {
            logger("Error: No JSON-LD valid script tags present on page");
            return;
        }

        this.meta = json.length > 1 ? json : json[0];
    }

    findRecipeItem(): void {
        if (!this.meta) return;

        if (Array.isArray(this.meta)) {
            // Handle array of JSON-LD objects
            this.recipeItem =
                this.meta.find((item) => {
                    console.log("item:", item);
                    return this.isRecipeType(item?.["@type"]);
                }) || null;
            return;
        }

        if (this.isRecipeType(this.meta["@type"])) {
            // Direct Recipe object: nytimes, food.com, bonappetite, ohsheglows, simplyrecipes, allrecipes
            this.recipeItem = this.meta;
            console.log("We successfully grabbed a direct recipe object");
            return;
        }

        // Handle @graph structure: king arthur, 12tomatoes, sallysbaking, cookie&kate
        // or other nested structures: martha stewart, foodnetwork, eatingwell, myrecipes, seriouseats, skinnytaste
        console.log("Graph structure encountered:");
        const graphLevel = this.meta["@graph"] || this.meta;
        this.recipeItem =
            (Object.values(graphLevel).find((item: any) =>
                this.isRecipeType(item?.["@type"]),
            ) as JsonLdRecipe) || null;
    }
}

export default JsonLdScraper;
