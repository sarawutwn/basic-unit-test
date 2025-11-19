import { Elysia} from "elysia";
import { CrudService } from "../crud.service";
import { total_bill } from "../../schema";
import { totalBillModel } from "../models/total_bill";
const app = new CrudService(total_bill);
const tags = ['total_bill'];
const total_billRouter = new Elysia({ prefix: "/total_bill" })
.use(totalBillModel)
  .get("/", () => {
    return app.getAll()
  }, {
    tags,
    detail: {
      summary: 'get all total_bill',
    }
  })
  .get("/:id", ({ params }) => {
    return app.getById(parseInt(params.id))
  }, {
    tags,
    detail: {
      summary: 'get total_bill by id',
    }
  })
   .post("/", ({ body }) => {
        return app.post(body as object);
    }, {
        body: 'total_bill.model',
        tags,
        detail: {
            summary: 'create stock',
        }
    })
    .patch('/:id', ({ params, body }) => {
        return app.updateById(body as Object, parseInt(params.id));
    }, {
        body: 'total_bill.model',
        tags,
        detail: {
            summary: 'update total_bill by id',
        }
    })
    .delete('/:id', ({ params }) => {
        return app.deleteById(parseInt(params.id));
    }, {
        tags,
        detail: {
            summary: 'delete total_bill by id',
        }
    })
export default total_billRouter;
