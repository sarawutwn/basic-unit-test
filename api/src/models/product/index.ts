import { Elysia, t } from 'elysia'
export const productModel = new Elysia({ name: 'product.Model' })
  .model({
    'product.Model': t.Object({
      factory_number: t.String(),
      short_name: t.String({ minLength: 1 }),
      name: t.String({ minLength: 1 }),
      model: t.String(),
      brand: t.String({ minLength: 1 }),
      cost: t.Numeric(),
      sale_price: t.Numeric(),
      technician_price: t.Numeric(),
      price2: t.Numeric(),
      special_price_one: t.Numeric(),
      special_price_two: t.Numeric(),
      authentic_code: t.String(),
      category_id: t.Number(),
      secret_code: t.String(),
      special_search: t.Array(
        t.Object({
          key: t.String(),
          value: t.Number()
        })
      ),
      dealer_id: t.Number(),
      last_price: t.Numeric(),
      unit_big: t.String(),
      unit_small: t.String(),
      storage_location: t.String(),
      substitute_product_name: t.String()
    }
    )
  })

export const productModelUpdate = new Elysia({ name: 'product.update' })
  .model({
    'product.update': t.Object({
      factory_number: t.String(),
      short_name: t.String({ minLength: 1 }),
      name: t.String({ minLength: 1 }),
      model: t.String(),
      brand: t.String({ minLength: 1 }),
      cost: t.Numeric(),
      sale_price: t.Numeric(),
      technician_price: t.Numeric(),
      price2: t.Numeric(),
      special_price_one: t.Numeric(),
      special_price_two: t.Numeric(),
      authentic_code: t.String(),
      category_id: t.Number(),
      secret_code: t.String(),
      special_search: t.Array(
        t.Object({
          key: t.String(),
          value: t.Number()
        })
      ),
      dealer_id: t.Number(),
      last_price: t.Numeric(),
      unit_big: t.String(),
      unit_small: t.String(),
      storage_location: t.String(),
      substitute_product_name: t.String()
    }
    )
  })

