import { Elysia, t } from 'elysia'
export const invoiceDetailModel = new Elysia({ name: 'invoice.detail.model' })
  .model({
    'invoice.detail.model': t.Object({
      invoice_id: t.Number(),
      date_invoice: t.Date(),
      bill_no: t.String(),
      price: t.Number(),
    }
    )
  })

