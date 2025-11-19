import { Elysia, t } from 'elysia'
export const categoryModel = new Elysia({ name: 'category.Model' })
  .model({
    'category.Model': t.Object({
      name: t.String(),
      shelves: t.String(),
      type: t.String(),
      options: t.Object({ inside: t.Boolean(), outer_circle: t.Boolean(), wide: t.Boolean() })
    }
    )
  })
