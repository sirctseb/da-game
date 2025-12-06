import { ObjectId, type WithId } from "mongodb";
import type { GameState } from "./model";
import client from "./mongodbClient";

const getClient = async () => {
  return await client.connect();
};

export type Serialized<T> = T & { _id: string };

export function serialized<T extends WithId<P>, P>(
  entity: T
): T & { _id: string } {
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

export async function createGame(gameState: GameState) {
  const actualClient = await getClient();
  const result = await actualClient
    .db("games")
    .collection<GameState>("games")
    .insertOne(gameState);
  console.log("createGame result:", { result });
  return result;
}

export async function getGame(
  id: string
): Promise<Serialized<GameState> | null> {
  const actualClient = await getClient();
  const result = await actualClient
    .db("games")
    .collection<GameState>("games")
    .findOne({ _id: new ObjectId(id) });
  console.log("getGame result:", { result });
  if (!result) {
    return null;
  }
  return serialized(result);
}

// TODO various layers of this state are getting messy

export async function updateGame(
  gameState: Serialized<GameState>,
  id: string
): Promise<WithId<GameState> | null> {
  const { _id, ...writeableGameState } = gameState;
  const actualClient = await getClient();
  const result = await actualClient
    .db("games")
    .collection<GameState>("games")
    .findOneAndReplace({ _id: new ObjectId(id) }, writeableGameState);
  console.log("updateGame result:", { result });
  return result;
}
