import { Elysia, t } from 'elysia'
export const secretCodeModel = new Elysia({ name: 'secret_code.model'})
  .model({
    'secret_code.model': t.Object({
      secret_code: t.String(),
      code_number: t.String(),
      type: t.String()
    }
    )
  })
