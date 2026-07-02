// /src/api/services/Favorite.ts (sistemi Favorites)
import { WithId, Document } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { Favorite } from "@/api/models/Favorite";

const COLLECTION = "favorites";

function serialize(doc: WithId<Document>): Favorite {
  const { _id, createdAt, ...rest } = doc;
  return {
    _id: _id.toString(),
    createdAt: createdAt ? new Date(createdAt).toISOString() : undefined,
    ...rest,
  } as unknown as Favorite;
}

export async function getFavoritesByUser(userId: string): Promise<Favorite[]> {
  const db = await getDb();
  const favs = await db
    .collection(COLLECTION)
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
  return favs.map(serialize);
}

// Toggle: nëse ekziston e heq, përndryshe e shton. Kthen gjendjen e re.
export async function toggleFavorite(userId: string, recipeId: string) {
  const db = await getDb();
  const existing = await db.collection(COLLECTION).findOne({ userId, recipeId });
  if (existing) {
    await db.collection(COLLECTION).deleteOne({ _id: existing._id });
    return { favorited: false };
  }
  await db.collection(COLLECTION).insertOne({ userId, recipeId, createdAt: new Date() });
  return { favorited: true };
}
