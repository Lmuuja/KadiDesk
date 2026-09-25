import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["extra_admin", "admin", "user"],
      default: "user",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // معرف الحساب الذي قام بإنشاء هذا الحساب
    },
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);
export default User;