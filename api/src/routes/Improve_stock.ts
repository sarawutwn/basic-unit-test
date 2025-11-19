import { Elysia } from "elysia";
import { CrudService } from "../crud.service";
import { Improve_stock } from "../../schema";
import { improve_stockModel } from "../models/Improve_stock";
const app = new CrudService(Improve_stock);
const tags = ['Improve_stock'];
const Improve_stockRouter = new Elysia({ prefix: "/improve_stock" })
    .use(improve_stockModel)
    .get("/", () => {
        return app.getAll()
    }, {
        tags,
        detail: {
            summary: 'get all Improve_stock',
        }
    })
    .get("/:id", ({ params }) => {
        return app.getById(parseInt(params.id))
    }, {
        tags,
        detail: {
            summary: 'get Improve_stock by id',
        }
    })
    .post("/", ({ body }) => {
        return app.post(body as object)
    }, {
        body: 'improve_stock.model',
        tags,
        detail: {
            summary: 'create Improve_stock',
        }
    })
    .patch('/:id', ({ params, body }) => {
        return app.updateById(body as Object, parseInt(params.id))
    }, {
        body: 'improve_stock.model',
        tags,
        detail: {
            summary: 'update Improve_stock by id',
        }
    })
    .delete('/:id', ({ params }) => {
        return app.deleteById(parseInt(params.id))
    }, {
        tags,
        detail: {
            summary: 'delete Improve_stock by id',
        }
    })
export default Improve_stockRouter;
