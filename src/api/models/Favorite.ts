// /src/api/models/Favorite.ts (sistemi i ruajtjes së përzgjedhjeve)
export interface Favorite {
  _id?: string;
  userId: string;
  recipeId: string;
  createdAt?: Date;
}
