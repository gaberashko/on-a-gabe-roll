import consolidateRecipeProperties from "./consolidateRecipeProperties";
import propertyTransformerMap from "./propertyTransformerMap";
import type { RecipeJSON } from "../types";

interface ProspectiveProperties {
    [key: string]: any;
}

// TODO: FIX THIS
const buildRecipeModel = (prospectiveProperties: ProspectiveProperties): Partial<RecipeJSON> => {
    const recipe = consolidateRecipeProperties(prospectiveProperties);

    // parse and transform the property values
    const transformedRecipe: Partial<RecipeJSON> = {};
    Object.entries(recipe).forEach(([key, value]) => {
        const propertyTransformer = propertyTransformerMap[key];
        if (propertyTransformer && value) {
            (transformedRecipe as any)[key] = propertyTransformer(value, key);
        }
    });

    return transformedRecipe;
};

export default buildRecipeModel;
