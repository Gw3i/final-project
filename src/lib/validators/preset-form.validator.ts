import { SUBSCRIPTION_CYCLE, WEEK_DAY } from '@/constants/binance.constants';
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

export const PresetRangeTradingValidator = z.object({
  symbol: z
    .string()
    .min(2, {
      message: 'Symbol must be at least 2 characters.',
    })
    .max(5, {
      message: 'Symbol must not be longer than 5 characters.',
    }),
  rangeLow: z.string({
    required_error: 'Lowest price of sale is required.',
  }),
  rangeHigh: z.string({
    required_error: 'Highest price of sale is required.',
  }),
});

export const PresetAutoInvestValidator = z.object({
  symbol: z
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
  interval: z.enum(SUBSCRIPTION_CYCLE, { required_error: 'Please select an interval.' }),
  subscriptionStartDay: z.number().optional(),
  subscriptionStartWeekday: z.enum(WEEK_DAY).optional(),
});

export type CreateDCAPresetPayload = z.infer<typeof DCAPresetValidator>;
export type RangeTradingPresetPayload = z.infer<typeof PresetRangeTradingValidator>;
export type PresetAutoInvestPayload = z.infer<typeof PresetAutoInvestValidator>;
