import { Elysia } from "elysia";
import { CrudService } from "../crud.service";
import { bill_detail } from "../../schema";
const app = new CrudService(bill_detail);
const tags = ['bill_detail'];
import { bill_detail_Model } from "../models/bill_detail";
const billDetailRouter = new Elysia({ prefix: "/bill_detail" })
  .use(bill_detail_Model)
  .get("/", () => {
    return app.getAll()
  }, {
    tags,
    detail: {
      summary: 'get all bill_detail',
    }
  }).post("/", ({ body }) => {
    return app.post(body)
  },
    {
      body: 'billDetail.model',
      tags,
      detail: {
        summary: 'create bill_detail',
      }
    }
  )
  .get("/:id", ({ params }) => {
    return app.getById(parseInt(params.id))
  }, {
    tags,
    detail: {
      summary: 'get bill_detail by id',
    }
  })
  .delete("/:id", ({ params }) => {
    return app.deleteById(parseInt(params.id))
  }, {
    tags,
    detail: {
      summary: 'delete bill_detail by id',
    }
  })
  .patch("/:id", ({ params, body }) => {
    return app.updateById(body as Object, parseInt(params.id))
  }, {
    body: 'billDetail.model',
    tags,
    detail: {
      summary: 'delete bill_detail by id',
    }
  })

export default billDetailRouter;
