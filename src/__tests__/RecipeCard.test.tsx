import { render, screen } from "@testing-library/react";
import RecipeCard from "@/components/shared/RecipeCard";
import { Recipe } from "@/api/models/Recipe";

// Mock varësitë e jashtme të komponentit.
jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
}));

jest.mock("@/contexts/FavoritesContext", () => ({
  useFavorites: () => ({ isFavorite: () => false, toggleFavorite: jest.fn() }),
}));

jest.mock("next/image", () => {
  const MockImage = (props: React.ComponentProps<"img">) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  };
  return MockImage;
});

const recipe: Recipe = {
  _id: "abc123",
  title: "Byrek me spinaq",
  description: "Byrek tradicional shqiptar.",
  ingredients: ["petë", "spinaq"],
  steps: ["shtro", "piq"],
  imageUrl: "https://placehold.co/400",
  category: "Drekë",
  cookTime: 60,
};

describe("RecipeCard", () => {
  it("shfaq titullin, përshkrimin dhe kategorinë e recetës", () => {
    render(<RecipeCard recipe={recipe} />);
    expect(screen.getByText("Byrek me spinaq")).toBeInTheDocument();
    expect(screen.getByText("Byrek tradicional shqiptar.")).toBeInTheDocument();
    expect(screen.getByText("Drekë")).toBeInTheDocument();
  });

  it("lidhet me faqen e detajeve të recetës", () => {
    render(<RecipeCard recipe={recipe} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/recipes/abc123");
  });

  it("shfaq kohën e gatimit", () => {
    render(<RecipeCard recipe={recipe} />);
    expect(screen.getByText(/60 min/)).toBeInTheDocument();
  });
});
