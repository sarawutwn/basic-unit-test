import { Elysia, t } from 'elysia'
export const improve_stockModel = new Elysia({ name: 'improve_stock.model' })
  .model({
    'improve_stock.model': t.Object({
     stock_id: t.Number(),
     real_number:t.Number(),
     comment: t.String()
    }
    )
  })

 