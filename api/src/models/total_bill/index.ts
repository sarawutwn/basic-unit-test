import { Elysia, t } from 'elysia'
export const totalBillModel = new Elysia({ name: 'total_bill.model' })
    .model({
        'total_bill.model': t.Object({
            bill_Included_number: t.Number(),
            note: t.String(),
            dealer_id: t.Number(),
            total: t.Number(),
            receipt_voucher_id: t.Number(),
            status: t.String(),
        }
        )
    })

