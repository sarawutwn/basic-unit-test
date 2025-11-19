

import { Elysia, t } from 'elysia'
export const selling_skuModel = new Elysia({ name: 'selling_sku.model' })
  .model({
    'selling_sku.model': t.Object({
      product_id: t.Number(),
      sku: t.String(),
      percent: t.Number(),
      price_mode:t.String(),
      price_selling: t.Number()
    }
    )
  })

