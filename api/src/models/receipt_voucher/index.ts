

import { Elysia, t } from 'elysia'
export const receipt_voucherModel = new Elysia({ name: 'receipt_voucher.model' })
    .model({
        'receipt_voucher.model': t.Object({
            order_no: t.String(),
            delivery_number: t.String(),
            sender_name: t.String(),
        }
        )
    })

