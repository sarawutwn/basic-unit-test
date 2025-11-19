import { Elysia, t } from "elysia";
import { CrudService } from "../crud.service";
import { credit_product } from "../../schema";
import { creditModel } from "../models/credit_product";
const app = new CrudService(credit_product);
const tags = ['credit_product'];
const credit_productRouter = new Elysia({ prefix: "/credit_product" })
  .use(creditModel)
  .get("/", () => {
    return app.getAll()
  }, {
    tags,
    detail: {
      summary: 'get all credit_product',
    }
  })
  .get("/:id", ({ params }) => {
    return app.getById(parseInt(params.id))
  }, {
    tags,
    detail: {
      summary: 'get credit_product by id',
    }
  })
  .post("/", ({ body }) => {
    return app.post(body)
  }, {
    body: 'credit.product.model',
    tags,
    detail: {
      summary: 'create credit_product',
    }
  })
  .patch('/:id', ({ params, body }) => {
    return app.updateById(body, parseInt(params.id))
  }, {
    body: 'credit.product.model',
    tags,
    detail: {
      summary: 'update credit_product by id',
    }
  })
  .delete('/:id', ({ params }) => {
    return app.deleteById(parseInt(params.id))
  }, {
    tags,
    detail: {
      summary: 'delete credit_product by id',
    }
  })


export default credit_productRouter;
