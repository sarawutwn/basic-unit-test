
import { Elysia, t } from 'elysia'
export const invoiceModel = new Elysia({ name: 'invoice.model' })
  .model({
    'invoice.model': t.Object({
     bill_id: t.Number(),
     member_id:t.Number(),
     account_name: t.String(),
     invoice_no: t.String(),
    }
    )
  })
