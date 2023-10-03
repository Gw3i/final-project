import * as z from 'zod';

export const DCAPresetValidator = z.object({
  symbol: z
    .string()
    .min(2, {
      message: 'Symbol must be at least 2 characters.',
    })
    .max(7, {
      message: 'Symbol must not be longer than 30 characters.',
    }),
  amount: z.number({
    required_error: 'A amount is required.',
  }),
  interval: z.string({
    required_error: 'Please select a interval.',
  }),
  endDate: z.date().optional(),
});

export type CreateDCAPresetPayload = z.infer<typeof DCAPresetValidator>;
