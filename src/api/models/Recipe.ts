// /src/api/models/Recipe.ts (entiteti kryesor "Products/artikuj")
export interface Recipe {
  _id?: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  imageUrl: string;
  category: string;
  cookTime: number; // minuta
  servings?: number;
  createdBy?: string; // email/id i autorit
  createdAt?: Date;
}

export const RECIPE_CATEGORIES = [
  "Mëngjes",
  "Drekë",
  "Darkë",
  "Ëmbëlsira",
  "Sallata",
  "Supa",
  "Pije",
  "Vegjetariane",
] as const;
