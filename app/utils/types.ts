export interface SectionalIngredients {
    sectionTitle: string;
    ingredients: { name: string; quantity: number; unit: string }[];
}

export interface SectionalInstructions {
    sectionTitle: string;
    steps: string[];
}

export interface SectionalRecipeData {
    recipeId: string;
    title: string;
    servings: number;
    sectionalIngredients: SectionalIngredients[];
    sectionalInstructions: SectionalInstructions[];
}
