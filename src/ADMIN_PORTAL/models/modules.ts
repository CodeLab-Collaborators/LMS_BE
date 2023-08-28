import { Schema, model } from "mongoose";
import { IModule } from "../interface/modules";

const moduleSchema: Schema<IModule> = new Schema(
  {
    moduleID: { type: String },
    material: { type: String },
    description: { type: String },
    title: { type: String },
  },
  { versionKey: false }
);

const Module = model<IModule>("Module", moduleSchema);
export default Module;
