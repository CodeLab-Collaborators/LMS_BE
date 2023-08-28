import { model, Schema, Document } from "mongoose";
import { IStudent } from "../interface/auth";
import bcrypt from "bcrypt";

interface IStudenDocument extends Document, IStudent {
  // document level operations
  comparePassword(password: string): Promise<boolean>;
  createJwt(): Promise<void>;
}

const studentSchema: Schema<IStudenDocument> = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  status: { type: String },
  profileImage: { type: String },
  mobileNumber: { type: String },
  address: { type: String },
  dateOfBirth: { type: String },
  gender: { type: String },
  country_of_residence: { type: String },
  state_of_residence: { type: String },
  studentID: { type: String },
  createdAt: { type: String },
  isEmailVerified: { type: Boolean, default: false },
});

studentSchema.pre("save", async function (next) {
  const user = this;
  console.log(`Data before save: ${JSON.stringify(user)}`);

  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);
    user.confirmPassword = user.password;
  }
  next();
});

// this is to compare passwords
studentSchema.methods.comparePassword = async function (
  userPassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

const Student = model<IStudenDocument>("Student", studentSchema);
export default Student;
