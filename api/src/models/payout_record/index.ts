import { Elysia, t } from 'elysia'
export const payoutModel = new Elysia({ name: 'payout.model' })
  .model({
    'payout.model': t.Object({
      total_bill_id: t.String(),
      dealer_id: t.Number(),
      total: t.Number(),
      payment_method: t.String(),
      preference_number: t.Number(),
      paying_bank: t.String(),
      note: t.String(),
    }
    )
  })

