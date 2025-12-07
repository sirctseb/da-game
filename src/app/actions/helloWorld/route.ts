import { readHelloWorld, writeHelloWorld } from "../../../data/state";

export async function GET() {
  // return Response.json({ message: "Hello, World!" });
  return Response.json({ result: await readHelloWorld() });
}

export async function POST() {
  return Response.json({ result: await writeHelloWorld() });
}
