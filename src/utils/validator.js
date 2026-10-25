import { object, ref, string } from "yup";

export const registerSchema = object({
  email: string().email("Invalid email format").required("Email is required"),
  password: string().min(6, "Password must be at least 6 characters"),
  confirmPassword: string().required("This file cant not Empty").oneOf(
    [ref("password"), null],
    "Passwords do not match"
  ),
});

export const loginSchema = object({
  email: string().email("Invalid email format").required("Email is required"),
  password: string().min(6, "Password must be at least 6 characters"),
});