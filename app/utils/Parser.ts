import type { RecipeData } from "./Recipe";
import type { RecipeJSON } from "~/services/recipe-data-scraper";

class RecipeParser {
    /**
     * Constructor for an HTML parser that accepts pre-filled list of objects.
     * @param data - Container of objects created from parsed data
     */
    constructor(private _data: RecipeJSON) {}

    get data(): RecipeJSON {
        return this._data;
    }

    public parse(recipeData: RecipeJSON): Partial<RecipeData> {
        Object.entries(recipeData).forEach(([key, value]) => {});
        return {};
    }

    /**
     * Takes in a string of HTML and sanitizes it for use by recipe-adjacent classes.
     *
     * @param str - The input string (HTML/Markup) to be sanitized
     * @returns Sanitized string to be utilized by recipe-adjacent classes.
     */
    private sanitize(str: string): string {
        return "";
    }

    private parseLine(line: string): void {}
}
