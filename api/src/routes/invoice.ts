import { Elysia, t } from "elysia";
import { CrudService } from "../crud.service";
import { invoice } from  "../../schema";
import { invoiceModel } from "../models/invoice";
const tags =['invoice'];
const app = new CrudService(invoice);
const invoiceRouter = new Elysia({ prefix: "/invoice" })
.use(invoiceModel)
  .get("/", () => {
    return app.getAll()
  }, {
    tags,
    detail: {
      summary: 'get all invoice',
    }
  })
  .get("/:id", ({ params }) => {
    return app.getById(parseInt(params.id))
  }, {
    tags,
    detail: {
      summary: 'get invoice by id',
    }
  })
 .post("/", ({ body }) => {
        return app.post(body as object)
    }, {
        body: 'invoice.model',
        tags,
        detail: {
            summary: 'create invoice',
        }
    })
    .patch('/:id', ({ params, body }) => {
        return app.updateById(body as Object, parseInt(params.id))
    }, {
        body: 'invoice.model',
        tags,
        detail: {
            summary: 'update invoice by id',
        }
    })
    .delete('/:id', ({ params }) => {
        return app.deleteById(parseInt(params.id))
    }, {
        tags,
        detail: {
            summary: 'delete invoice by id',
        }
    })

export default invoiceRouter;
