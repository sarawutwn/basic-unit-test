
import { Elysia, t } from 'elysia'
export const purchase_detailModel = new Elysia({ name: 'purchase_detail.model' })
  .model({
    'purchase_detail.model': t.Object({
      purchase_id: t.Number(),
      product_id: t.Number(),
      price: t.Number(),
      quantity: t.Number(),
    }
    )
  })

