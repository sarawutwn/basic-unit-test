import { Elysia, t } from 'elysia'
export const productTypeModel = new Elysia({ name: 'productType.model' })
  .model({
    'productType.model': t.Object({
      name: t.String(),
    }
    )
  })

