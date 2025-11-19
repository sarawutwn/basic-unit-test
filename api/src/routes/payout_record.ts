import { Elysia } from "elysia";
import { CrudService } from "../crud.service";
import { payout_record } from "../../schema";
import { payoutModel } from "../models/payout_record";
const app = new CrudService(payout_record);
const tags = ['payout_record'];
const payout_recordRouter = new Elysia({ prefix: "/payout_record" })
.use(payoutModel)
  .get("/", () => {
    return app.getAll()
  }, {
    tags,
    detail: {
      summary: 'get all payout_record',
    }
  })
  .get("/:id", ({ params }) => {
    return app.getById(parseInt(params.id))
  }, {
    tags,
    detail: {
      summary: 'get payout_record by id',
    }
  })
 .post("/", ({ body }) => {
        return app.post(body as object)
    }, {
        body: 'payout.model',
        tags,
        detail: {
            summary: 'create payout_record',
        }
    })
    .patch('/:id', ({ params, body }) => {
        return app.updateById(body as Object, parseInt(params.id))
    }, {
        body: 'payout.model',
        tags,
        detail: {
            summary: 'update payout_record by id',
        }
    })
    .delete('/:id', ({ params }) => {
        return app.deleteById(parseInt(params.id))
    }, {
        tags,
        detail: {
            summary: 'delete payout_record by id',
        }
    })
export default payout_recordRouter;
