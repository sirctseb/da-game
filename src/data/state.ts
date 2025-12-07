import { ObjectId, type InsertOneResult, type WithId } from "mongodb";
import client from "./mongodbClient";
import type { GameState } from ".";

const getClient = async () => {
  return await client.connect();
};

export type Serialized<T> = Omit<T, "_id"> & { _id: string };

export function serialized<T extends WithId<P>, P>(entity: T): Serialized<T> {
  return { ...entity, _id: entity._id.toString() };
}

export async function writeHelloWorld() {
  const actualClient = await getClient();
  const result = await actualClient
    .db("test")
    .collection("test")
    .insertOne({ hello: "world" });
  console.log("writeHelloWorld result:", { result });
  return result;
}

export async function readHelloWorld() {
  const actualClient = await getClient();
  const result = await actualClient.db("test").collection("test").findOne();
  console.log("readHelloWorld result:", { result });
  return result;
}

export async function createGame(
  gameState: GameState
): Promise<InsertOneResult<GameState>> {
  const actualClient = await getClient();
  const result = await actualClient
    .db("games")
    .collection<GameState>("games")
    .insertOne(gameState);
  return result;
}

export async function getGame(id: string): Promise<WithId<GameState> | null> {
  const actualClient = await getClient();
  const result = await actualClient
    .db("games")
    .collection<GameState>("games")
    .findOne({ _id: new ObjectId(id) });
  if (!result) {
    return null;
  }
  return result;
}

export async function updateGame(
  gameState: Serialized<GameState>
): Promise<WithId<GameState> | null> {
  const { _id, ...writeableGameState } = gameState;
  const actualClient = await getClient();
  const result = await actualClient
    .db("games")
    .collection<GameState>("games")
    .findOneAndReplace({ _id: new ObjectId(_id) }, writeableGameState, {
      returnDocument: "after",
    });
  return result;
}
