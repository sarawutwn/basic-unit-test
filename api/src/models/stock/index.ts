import { Elysia, t } from 'elysia'
export const stockModel = new Elysia({ name: 'stock.model' })
  .model({
    'stock.model': t.Object({
      product_id: t.Number(),
      quantity: t.Number(),
      lead_time: t.Number()
    }
    )
  })
