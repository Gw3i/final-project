import * as z from 'zod';

export const DCAPresetValidator = z.object({
  symbolPairLeft: z
    .string()
    .min(2, {
      message: 'Symbol must be at least 2 characters.',
    })
    .max(5, {
      message: 'Symbol must not be longer than 5 characters.',
    }),
  symbolPairRight: z
    .string()
    .min(2, {
      message: 'Symbol must be at least 2 characters.',
    })
    .max(5, {
      message: 'Symbol must not be longer than 5 characters.',
    }),
  amount: z.string({
    required_error: 'Amount is required.',
  }),
  interval: z.string({
    required_error: 'Please select an interval.',
  }),
});

export type CreateDCAPresetPayload = z.infer<typeof DCAPresetValidator>;
