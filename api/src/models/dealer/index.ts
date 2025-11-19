import { Elysia, t } from 'elysia'
export const dealerModel = new Elysia({ name: 'dealer.model' })
  .model({
    'dealer.model': t.Object({
      name: t.String(),
      phone: t.String(),
      address: t.String(),
      dealer_code: t.String(),
    }
    )
  })

