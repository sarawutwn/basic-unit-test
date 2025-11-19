import { Elysia, t } from "elysia";
import { CrudService } from "../crud.service";
import { invoice_detail } from "../../schema";
import { invoiceDetailModel } from "../models/invoice_detail";
const tags = ['invoice detail'];
const app = new CrudService(invoice_detail);
const invoice_detailRouter = new Elysia({ prefix: "/invoice_detail" })
  .use(invoiceDetailModel)
  .get("/", () => {
    return app.getAll()
  }, {
    tags,
    detail: {
      summary: 'get all invoice detail',
    }
  })
  .get("/:id", ({ params }) => {
    return app.getById(parseInt(params.id))
  }, {
    tags,
    detail: {
      summary: 'get invoice detail by user_id',
    }
  })
  .post("/", ({ body }) => {
    return app.post(body as object)
  }, {
    body: 'invoice.detail.model',
    tags,
    detail: {
      summary: 'create invoice detail',
    }
  })
  .patch('/:id', ({ params, body }) => {
    return app.updateById(body as Object, parseInt(params.id))
  }, {
    body: 'invoice.detail.model',
    tags,
    detail: {
      summary: 'update invoice detail by id',
    }
  })
  .delete('/:id', ({ params }) => {
    return app.deleteById(parseInt(params.id))
  }, {
    tags,
    detail: {
      summary: 'delete invoice detail by id',
    }
  })

export default invoice_detailRouter;
