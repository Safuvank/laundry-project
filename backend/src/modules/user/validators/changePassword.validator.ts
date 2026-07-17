import { z } from "zod";

import { PASSWORD_REGEX } from "../../auth/constants/password.js";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().regex(PASSWORD_REGEX),
  })
  .refine(
    (data) => data.currentPassword !== data.newPassword,
    {
      message: "New password must be different.",
      path: ["newPassword"],
    }
  );