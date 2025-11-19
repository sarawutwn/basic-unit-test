import { Elysia, t } from 'elysia'
export const userModel = new Elysia({ name: 'user.Model' })
    .model({
        'user.Model': t.Object({
            first_name: t.String(),
            last_name: t.String(),
            username: t.String(),
            rules: t.String(),
            password: t.String(),
            phone: t.String(),
        }
        )
    })
