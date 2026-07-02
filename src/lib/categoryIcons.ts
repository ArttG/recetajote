// Maps each recipe category to a Material Symbols Rounded icon name.
export const CATEGORY_ICONS: Record<string, string> = {
  "Mëngjes": "egg_alt",
  "Drekë": "lunch_dining",
  "Darkë": "dinner_dining",
  "Ëmbëlsira": "cake",
  "Sallata": "grass",
  "Supa": "soup_kitchen",
  "Pije": "local_bar",
  "Vegjetariane": "eco",
};

export const categoryIcon = (category: string) => CATEGORY_ICONS[category] ?? "restaurant";
