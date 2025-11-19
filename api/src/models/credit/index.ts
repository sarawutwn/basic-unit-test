import { Elysia, t } from 'elysia'
export const creditModel = new Elysia({ name: 'credit.model' })
    .model({
        'credit.model': t.Object({
            bill_id: t.Number(),
            credit_code: t.String(),
            amount: t.Number(),
            member_id: t.Number(),
        }
        )
    })
