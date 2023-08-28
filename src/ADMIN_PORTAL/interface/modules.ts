import { Document } from "mongoose";

export interface IModule extends Document {
  moduleID: string;
  title: string;
  material: string;
  description: string;
}
