
import { Elysia, t } from 'elysia'
export const billModel = new Elysia({ name: 'bill.Model' })
  .model({
    'bill.Model': t.Object({
      bill_no: t.String(),
      member_id: t.Integer(),
      client_type: t.String(),
      total: t.Number(),
      sale_type: t.String(),
      number_car:t.String(),
      created_by_id:t.Number()
    }
    )
  })

