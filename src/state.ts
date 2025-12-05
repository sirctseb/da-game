import { ObjectId } from "mongodb";
import type { GameState } from "./model";
import client from "./mongodbClient";

const getClient = async () => {
  return await client.connect();
};

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

export async function getGame(id: string): Promise<GameState | null> {
  const actualClient = await getClient();
  const result = await actualClient
    .db("games")
    .collection<GameState>("games")
    .findOne({ _id: new ObjectId(id) });
  console.log("getGame result:", { result });
  return result;
}
