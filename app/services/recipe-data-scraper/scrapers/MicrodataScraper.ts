import microdata from "microdata-node";
import Scraper from "./Scraper";
import type { IMicrodataScraper } from "./types";
import type { MicrodataResponse } from "../types";
import * as cheerio from "cheerio";

class MicrodataScraper extends Scraper implements IMicrodataScraper {
    override type = "microdata" as const;
    override meta: MicrodataResponse | null = null;
    override recipeItem: any | null = null;

    constructor(chtml: cheerio.CheerioAPI) {
        super(chtml);
    }

    testForMetadata(): void {
        const meta = microdata.toJson(this.chtml.html());
        if (!meta || !meta.items || !meta.items[0]) {
            return;
        }
        this.meta = meta as MicrodataResponse;
    }

    findRecipeItem(): void {
        if (!this.meta || !this.meta.items) return;

        const recipe = Object.values(this.meta.items).find(
            (item) => item && item.type && item.type[0] && item.type[0].indexOf("Recipe") > -1,
        );
        this.recipeItem = recipe ? recipe.properties : null;
    }
}

export default MicrodataScraper;
