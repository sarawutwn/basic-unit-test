import { Elysia } from "elysia";
import { CrudService } from "../crud.service";
import { bill } from "../../schema";
import { billModel } from "../models/bill";
import { getAll } from "../controllers/bill";
const app = new CrudService(bill);
const tags = ['bill'];
const billRouter = new Elysia({ prefix: "/bill" })
  .use(billModel)
  .get("/", ({query}) => {
    return getAll(query)
  }, {
    tags,
    detail: {
      summary: 'get all bill',
    }
  })
  .post("/", ({ body }) => {
    return app.post(body as object)
  },
    {
      body: 'bill.Model',
      tags,
      detail: {
        summary: 'create bill',
      }
    }
  )
  .get("/:id", ({ params }) => {
    return app.getById(parseInt(params.id))
  }, {
    tags,
    detail: {
      summary: 'get bill by bill_id',
    }
  })
  .patch('/:id', ({ params, body }) => {
    return app.updateById(body as Object, parseInt(params.id))
  }, {
    body: 'bill.Model',
    tags,
    detail: {
      summary: 'update bill by id',
    }
  })
  .delete('/:id', ({ params }) => {
    return app.deleteById(parseInt(params.id))
  }, {
    tags,
    detail: {
      summary: 'delete bill by id',
    }
  })
export default billRouter;
