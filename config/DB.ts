import mongoose from "mongoose";
import { envVariable } from "./envVariable";

export async function dbConfig() {
  try {
    const conn = await mongoose.connect(envVariable.MONGODB_LOCALHOST);
    console.log(`Connecting to ${conn.connection.host}`);
  } catch (error: any) {
    console.log(error);
  }
}
