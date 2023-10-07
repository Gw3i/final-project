import * as z from 'zod';

export const DCAPresetValidator = z.object({
  symbol: z
    .string()
    .min(2, {
      message: 'Symbol must be at least 2 characters.',
    })
    .max(10, {
      message: 'Symbol must not be longer than 10 characters.',
    }),
  amount: z.string({
    required_error: 'Amount is required.',
  }),
  interval: z.string({
    required_error: 'Please select an interval.',
  }),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export type CreateDCAPresetPayload = z.infer<typeof DCAPresetValidator>;
