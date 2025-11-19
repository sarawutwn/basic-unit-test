import { Elysia, t } from 'elysia'
export const bill_detail_Model = new Elysia({ name: 'billDetail.model' })
  .model({
    'billDetail.model': t.Object({
      bill_id: t.String(),
      product_name: t.String(),
      product_id: t.Integer(),
      price: t.Number()
    }
    )
  })
