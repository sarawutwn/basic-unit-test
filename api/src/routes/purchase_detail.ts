import { Elysia, t } from "elysia";
import { CrudService } from "../crud.service";
import { purchase_detail } from "../../schema";
import { purchase_detailModel } from "../models/purchase_detail"
const app = new CrudService(purchase_detail);
const tags = ['purchase_detail'];
const purchase_detailRouter = new Elysia({ prefix: "/purchase_detail" })
    .use(purchase_detailModel)
    .get("/", () => {
        return app.getAll()
    }, {
        tags,
        detail: {
            summary: 'get all purchase_detail',
        }
    })
    .get("/:id", ({ params }) => {
        return app.getById(parseInt(params.id))
    }, {
        tags,
        detail: {
            summary: 'get purchase_detail by id',
        }
    })
  .post("/", ({ body }) => {
        return app.post(body as object)
    }, {
        body: 'purchase_detail.model',
        tags,
        detail: {
            summary: 'create purchase_detail',
        }
    })
    .patch('/:id', ({ params, body }) => {
        return app.updateById(body as Object, parseInt(params.id))
    }, {
        body: 'purchase_detail.model',
        tags,
        detail: {
            summary: 'update purchase_detail by id',
        }
    })
    .delete('/:id', ({ params }) => {
        return app.deleteById(parseInt(params.id))
    }, {
        tags,
        detail: {
            summary: 'delete purchase_detail by id',
        }
    })
export default purchase_detailRouter;
