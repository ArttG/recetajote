// /src/api/services/User.ts (Ushtrimi Javor 9)
import { ObjectId, WithId, Document } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { User, type Role } from "@/api/models/User";

const COLLECTION = "users";

function serialize(doc: WithId<Document>): User {
  // password hiqet qëllimisht nga objekti i kthyer te klienti.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, password, createdAt, ...rest } = doc;
  return {
    _id: _id.toString(),
    createdAt: createdAt ? new Date(createdAt).toISOString() : undefined,
    ...rest,
  } as unknown as User;
}

export async function createUser(data: Omit<User, "_id">) {
  const db = await getDb();
  const result = await db.collection(COLLECTION).insertOne({
    ...data,
    role: data.role ?? "user",
    createdAt: new Date(),
  });
  return { insertedId: result.insertedId.toString() };
}

// Kthen dokumentin e plotë (me password hash) — përdoret nga NextAuth authorize.
export async function getUserByEmail(email: string) {
  const db = await getDb();
  return db.collection(COLLECTION).findOne({ email });
}

// Kthen të gjithë përdoruesit (pa password), më i riu i pari — për panelin e adminit.
export async function getAllUsers(): Promise<User[]> {
  const db = await getDb();
  const users = await db.collection(COLLECTION).find({}).sort({ createdAt: -1 }).toArray();
  return users.map(serialize);
}

// Ndryshon rolin e një përdoruesi (vetëm admin). Rolet e lejuara: user | blogger | admin.
export async function updateUserRole(id: string, role: Role) {
  if (!ObjectId.isValid(id)) return { modifiedCount: 0 };
  const db = await getDb();
  const result = await db
    .collection(COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: { role } });
  return { modifiedCount: result.modifiedCount };
}

// Fshin një përdorues (vetëm admin).
export async function deleteUser(id: string) {
  if (!ObjectId.isValid(id)) return { deletedCount: 0 };
  const db = await getDb();
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return { deletedCount: result.deletedCount };
}

export async function getUserById(id: string): Promise<User | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const user = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return user ? serialize(user) : null;
}

export async function updateUser(id: string, data: Partial<User>) {
  if (!ObjectId.isValid(id)) return { modifiedCount: 0 };
  const db = await getDb();
  // Nuk lejojmë përditësim direkt të fushave të ndjeshme këtu.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, password, role, email, ...clean } = data;
  const result = await db
    .collection(COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: clean });
  return { modifiedCount: result.modifiedCount };
}
