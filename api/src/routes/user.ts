import { Elysia, t } from "elysia";
import { CrudService } from "../crud.service";
import { user } from "../../schema";
import { userModel } from "../models/user";

const app = new CrudService(user);
const userRouter = new Elysia({ prefix: "/user" })
  .use(userModel)
  .get("/", ({ query }) => {
    return app.getAll(query)
  }, {
    tags: ['user'],
    detail: {
      summary: 'get all user',
    }
  })
  .get("/searchByField", ({ query }) => {
    return app.searchDataByField(query)
  },
    {
      tags: ['user'],
      detail: { summary: 'search user' }
    }
  )
  .get("/search", ({ query }) => {
    return app.searchDataByValue(query)
  },
    {
      tags: ['user'],
      detail: { summary: 'search user by name' }
    })
  .post(
    "/",
    async ({ body }) => {
      const { password, ...rest } = body;
      const saltRounds = 10;
      const hashedPassword = await Bun.password.hash(password, {
        algorithm: 'bcrypt',
        cost: saltRounds
      });
      const userData = { ...rest, password: hashedPassword };
      return app.post(userData);
    },
    {
      body: 'user.Model',
      tags: ['user'],
      detail: { summary: 'create user' }
    }
  )
  .get("/:id", ({ params }) => {
    return app.getById(parseInt(params.id))
  }, {
    tags: ['user'],
    detail: {
      summary: 'get user by user_id',
    }
  })
  .patch("/:id", async ({ params, body }) => {
    return app.updateById(body, parseInt(params.id))
  }, {
    body: 'user.Model',
    tags: ['user'],
    detail: {
      summary: 'update user by user_id',
    }
  })
  .delete("/:id", ({ params }) => {
    return app.deleteById(parseInt(params.id))
  }, {
    tags: ['user'],
    detail: {
      summary: 'delete user by user id',
    }
  })

export default userRouter;
