import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Recipe } from "@/api/models/Recipe";
import Icon from "@/components/shared/Icon";

interface Props {
  recipe: Recipe;
}

// Komponent i ripërdorshëm "Card" — stilizuar me klasa utility të Tailwind.
const RecipeCard = ({ recipe }: Props) => {
  const { data: session } = useSession();
  const { isFavorite, toggleFavorite } = useFavorites();
  const id = recipe._id as string;
  const favorited = isFavorite(id);

  return (
    <Link
      href={`/recipes/${id}`}
      className="rj-card flex flex-col no-underline text-[var(--ink)] bg-[var(--surface)] border border-[var(--border)] rounded-[20px] overflow-hidden shadow-[var(--shadow-sm)]"
    >
      <div className="relative h-[210px] overflow-hidden">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ objectFit: "cover" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,12,6,.34),rgba(20,12,6,0)_46%)]" />
        <span className="font-mono absolute left-[14px] bottom-[13px] text-[10.5px] font-medium tracking-[.13em] uppercase text-white bg-[rgba(28,18,10,.42)] backdrop-blur-[6px] border border-[rgba(255,255,255,.18)] px-[11px] py-[5px] rounded-full">
          {recipe.category}
        </span>
        {session && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(id);
            }}
            aria-label="Ruaj te favoritet"
            className="rj-fav absolute right-[13px] top-[13px] grid place-items-center w-[38px] h-[38px] rounded-full border border-[rgba(255,255,255,.28)] bg-[rgba(255,255,255,.16)] backdrop-blur-[8px] cursor-pointer"
          >
            <Icon name="favorite" size={20} weight={500} fill={favorited ? 1 : 0} color={favorited ? "var(--accent)" : "#fff"} />
          </button>
        )}
      </div>

      <div className="pt-[17px] px-[18px] pb-[19px] flex flex-col gap-[7px] flex-1">
        <h3 className="font-serif m-0 font-medium text-[21px] leading-[1.15] tracking-[-.01em] text-[var(--ink)] whitespace-nowrap overflow-hidden text-ellipsis">
          {recipe.title}
        </h3>
        <p className="m-0 text-[13.5px] leading-[1.5] text-[var(--muted)] line-clamp-2">
          {recipe.description}
        </p>
        <div className="mt-auto pt-[11px] flex items-center gap-[14px] border-t border-[var(--border)]">
          <span className="inline-flex items-center gap-[5px] text-[12.5px] font-medium text-[var(--ink-2)]">
            <Icon name="schedule" size={17} color="var(--muted)" />
            {recipe.cookTime} min
          </span>
          <span className="ml-auto inline-flex items-center gap-[4px] text-[12.5px] font-semibold text-[var(--accent)]">
            Shiko
            <Icon name="arrow_forward" size={16} weight={500} />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
