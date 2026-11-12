import { z } from "zod";

export const GeneralSchema = z.object({
  step: z.union([z.literal(0), z.literal(1), z.literal(2)]),
});

export const ContactSchema = z.object({
  full_name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(6, "Please enter a valid phone number"),
});

export const PaymentSchema = z.object({
  // Keep in sync with the account list in `../components/PaymentMethod/PaymentMethod.tsx`.
  payment_type: z.enum(["kpay", "wavepay"]),
});

export const ProofSchema = z.object({
  transaction_no: z
    .string()
    .min(6, "Enter the last 6 digits")
    .max(6, "Enter the last 6 digits"),
});

export const CheckoutSchema = GeneralSchema.extend(ContactSchema.shape)
  .extend(PaymentSchema.shape)
  .extend(ProofSchema.shape);

export type CheckoutFormFields = z.infer<typeof CheckoutSchema>;

export const checkoutSteps = [
  {
    title: "Contact",
    fields: ["full_name", "email", "phone"] as const,
    schema: ContactSchema,
  },
  {
    title: "Payment",
    fields: ["payment_type"] as const,
    schema: PaymentSchema,
  },
  {
    title: "Proof",
    fields: ["transaction_no"] as const,
    schema: ProofSchema,
  },
] as const;
