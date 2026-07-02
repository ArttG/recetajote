// /src/api/services/Recipe.ts (Ushtrimi Javor 6/7)
import { ObjectId, WithId, Document } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { Recipe } from "@/api/models/Recipe";

const COLLECTION = "recipes";

// Konverton dokumentin e MongoDB në objekt të serializueshëm (për getStaticProps/SSR).
function serialize(doc: WithId<Document>): Recipe {
  const { _id, createdAt, ...rest } = doc;
  return {
    _id: _id.toString(),
    createdAt: createdAt ? new Date(createdAt).toISOString() : undefined,
    ...rest,
  } as unknown as Recipe;
}

export async function createRecipe(data: Omit<Recipe, "_id">) {
  const db = await getDb();
  const result = await db.collection(COLLECTION).insertOne({
    ...data,
    createdAt: new Date(),
  });
  return { insertedId: result.insertedId.toString() };
}

export async function getRecipes(category?: string): Promise<Recipe[]> {
  const db = await getDb();
  const query = category ? { category } : {};
  const recipes = await db
    .collection(COLLECTION)
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();
  return recipes.map(serialize);
}

// Kthen vetëm recetat e krijuara nga një autor i caktuar (sipas `createdBy`).
// Përdoret nga paneli i blogger-it për të parë/menaxhuar recetat e veta.
export async function getRecipesByAuthor(author: string): Promise<Recipe[]> {
  const db = await getDb();
  const recipes = await db
    .collection(COLLECTION)
    .find({ createdBy: author })
    .sort({ createdAt: -1 })
    .toArray();
  return recipes.map(serialize);
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const recipe = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return recipe ? serialize(recipe) : null;
}

export async function getAllRecipeIds(): Promise<string[]> {
  const db = await getDb();
  const docs = await db.collection(COLLECTION).find({}, { projection: { _id: 1 } }).toArray();
  return docs.map((d) => d._id.toString());
}

export async function updateRecipe(id: string, data: Partial<Recipe>) {
  if (!ObjectId.isValid(id)) return { modifiedCount: 0 };
  const db = await getDb();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...clean } = data;
  const result = await db
    .collection(COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: clean });
  return { modifiedCount: result.modifiedCount };
}

export async function deleteRecipe(id: string) {
  if (!ObjectId.isValid(id)) return { deletedCount: 0 };
  const db = await getDb();
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return { deletedCount: result.deletedCount };
}
