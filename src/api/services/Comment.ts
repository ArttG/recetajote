// /src/api/services/Comment.ts (entiteti i dytë CRUD)
import { ObjectId, WithId, Document } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { Comment } from "@/api/models/Comment";

const COLLECTION = "comments";

function serialize(doc: WithId<Document>): Comment {
  const { _id, createdAt, ...rest } = doc;
  return {
    _id: _id.toString(),
    createdAt: createdAt ? new Date(createdAt).toISOString() : undefined,
    ...rest,
  } as unknown as Comment;
}

export async function createComment(data: Omit<Comment, "_id">) {
  const db = await getDb();
  const result = await db.collection(COLLECTION).insertOne({
    ...data,
    createdAt: new Date(),
  });
  return { insertedId: result.insertedId.toString() };
}

export async function getCommentsByRecipe(recipeId: string): Promise<Comment[]> {
  const db = await getDb();
  const comments = await db
    .collection(COLLECTION)
    .find({ recipeId })
    .sort({ createdAt: -1 })
    .toArray();
  return comments.map(serialize);
}

export async function getCommentById(id: string): Promise<Comment | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const c = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return c ? serialize(c) : null;
}

export async function deleteComment(id: string) {
  if (!ObjectId.isValid(id)) return { deletedCount: 0 };
  const db = await getDb();
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return { deletedCount: result.deletedCount };
}
