// /src/lib/mongodb.ts — lidhje singleton me MongoDB (Ushtrimi Javor 6).
import { MongoClient, Db } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export const DB_NAME = process.env.MONGODB_DB || "recipeapp";

// Inicializim lazy: nuk lidhemi (as hedhim error) derisa lidhja të përdoret realisht.
// Kjo e mban `next build` të qëndrueshëm edhe kur MONGODB_URI mungon në kohën e build-it.
function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Mungon variabli i ambientit MONGODB_URI (.env.local)");
  }
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise;
}

// Ndihmës: kthen instancën e databazës me emrin e konfiguruar.
export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(DB_NAME);
}

// Për NextAuth MongoDBAdapter, që pret një Promise<MongoClient>.
// E bëjmë "lazy thenable": lidhja fillon vetëm kur dikush e pret realisht promise-in,
// jo në kohën e importit — kështu `next build` nuk dështon kur MONGODB_URI mungon.
const clientPromise: Promise<MongoClient> = {
  then(onFulfilled, onRejected) {
    return getClientPromise().then(onFulfilled, onRejected);
  },
  catch(onRejected) {
    return getClientPromise().catch(onRejected);
  },
  finally(onFinally) {
    return getClientPromise().finally(onFinally);
  },
  [Symbol.toStringTag]: "Promise",
} as Promise<MongoClient>;

export default clientPromise;
