import { Schema, Model, model } from "mongoose";
import { IUser, UserSchema } from "./User";

export interface IPTSTimeSlot {
  id: string,
  startTime: Date,
  endTime: Date,
  RSVP?: IUser,
  backupRSVPs?: IUser[]
}

export const PTSTimeSlotSchema = new Schema<IPTSTimeSlot>({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  RSVP: { type: UserSchema, required: false },
  backupRSVPs: { type: [UserSchema], required: false }
});

export const PTSTimeSlot: Model<IPTSTimeSlot> = global.ptsTimeSlotModel = global.ptsTimeSlotModel ?? model<IPTSTimeSlot>("PTSTimeSlot", PTSTimeSlotSchema);