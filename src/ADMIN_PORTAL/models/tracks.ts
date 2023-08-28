import { Schema, model } from "mongoose";
import { ITracks } from "../interface/tracks";

const trackSchema: Schema<ITracks> = new Schema(
  {
    trackID: { type: String },
    trackName: { type: String },
    description: { type: String },
    price: { type: Number },
  },
  { versionKey: false }
);

const Track = model<ITracks>("Track", trackSchema);
export default Track;
