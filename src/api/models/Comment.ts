// /src/api/models/Comment.ts (entiteti i dytë CRUD — komente/vlerësime)
export interface Comment {
  _id?: string;
  recipeId: string;
  userId: string;
  userName: string;
  text: string;
  rating: number; // 1-5
  createdAt?: Date;
}
