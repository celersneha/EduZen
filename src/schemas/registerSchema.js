import { z } from "zod";

export const registerSchema = z
  .object({
    studentName: z
      .string()
      .trim()
      .min(1, "Student name is required")
      .regex(
        /^[^\s].*[^\s]$/,
        "Student name must not contain leading or trailing spaces"
      ),
    studentEmail: z
      .string()
      .trim()
      .email("Invalid email address")
      .regex(/^[^\s]*$/, "Email must not contain any spaces"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .trim()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?& ]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .regex(/^\S*$/, "Password must not contain spaces"),
    confirmPassword: z
      .string()
      .trim()
      .min(8, "Confirm password must be at least 8 characters")
      .regex(
        /^\S.*\S$|^\S$/,
        "Confirm password must not contain trailing spaces"
      )
      .regex(/^\S*$/, "Confirm password must not contain spaces"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Ye confirmPassword field pe error show karega
  });
