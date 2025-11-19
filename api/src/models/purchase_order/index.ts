
import { Elysia, t } from 'elysia'
export const purchase_orderModel = new Elysia({ name: 'purchase_order.model' })
  .model({
    'purchase_order.model': t.Object({
      order_no: t.String(),
      dealer_id: t.Number(),
      status: t.String(),
      number_items: t.Number(),
      total_Invoice: t.Number(),
    }
    )
  })

