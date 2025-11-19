import { Elysia, t } from 'elysia'
export const memberModel = new Elysia({ name: 'member.model' })
  .model({
    'member.model': t.Object({
      member_code:t.String(),
      name: t.String(),
      level: t.String(),
      address: t.String(),
      phone: t.String(),
      credit:t.Number()
    }
    )
  })


