import { Elysia} from "elysia";
import { CrudService } from "../crud.service";
import { credit } from "../../schema";
import { creditModel } from "../models/credit";
const app = new CrudService(credit);
const tags = ['credit'];
const creditRouter = new Elysia({ prefix: "/credit" })
.use(creditModel)
  .get("/", () => {
    return app.getAll()
  }, {
    tags,
    detail: {
      summary: 'get all credit',
    }
  })
  .get("/:id", ({ params }) => {
    return app.getById(parseInt(params.id))
  }, {
    tags,
    detail: {
      summary: 'get credit by id',
    }
  })
  .post("/", ({ body }) => {
    return app.post(body)
  }, {
    body: 'credit.model',
    tags,
    detail: {
      summary: 'create credit',
    }
  })
  .patch('/:id', ({ params, body }) => {
    return app.updateById(body, parseInt(params.id))
  }, {
    body: 'credit.model',
    tags,
    detail: {
      summary: 'update credit by id',
    }
  })
  .delete('/:id', ({ params }) => {
    return app.deleteById(parseInt(params.id))
  }, {
    tags,
    detail: {
      summary: 'delete credit by id',
    }
  })

export default creditRouter;
