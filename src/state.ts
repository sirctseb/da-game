import client from "./mongodbClient";

export async function writeHelloWorld() {
  // what is this?
  const actualClient = await client.connect();
  const result = await actualClient
    .db("test")
    .collection("test")
    .insertOne({ hello: "world" });
  console.log("writeHelloWorld result:", { result });
  return result;
}

export async function readHelloWorld() {
  const actualClient = await client.connect();
  const result = await actualClient.db("test").collection("test").findOne();
  console.log("readHelloWorld result:", { result });
  return result;
}
