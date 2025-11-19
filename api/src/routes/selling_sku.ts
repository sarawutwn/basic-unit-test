import { Elysia} from "elysia";
import { CrudService } from "../crud.service";
import { selling_sku } from "../../schema";
import { selling_skuModel } from "../models/selling_sku";
const app = new CrudService(selling_sku);
const tags = ['selling_sku'];
const selling_skuRouter = new Elysia({ prefix: "/selling_sku" })
    .use(selling_skuModel)
    .get("/", () => {
        return app.getAll()
    }, {
        tags,
        detail: {
            summary: 'get all selling_sku',
        }
    })
    .get("/:id", ({ params }) => {
        return app.getById(parseInt(params.id))
    }, {
        tags,
        detail: {
            summary: 'get selling_sku by id',
        }
    })
    .post("/", ({ body }) => {
        return app.post(body as object);
    }, {
        body: 'selling_sku.model',
        tags,
        detail: {
            summary: 'create selling_sku',
        }
    })
    .patch('/:id', ({ params, body }) => {
        return app.updateById(body as Object, parseInt(params.id));
    }, {
        body: 'selling_sku.model',
        tags,
        detail: {
            summary: 'update selling_sku by id',
        }
    })
    .delete('/:id', ({ params }) => {
        return app.deleteById(parseInt(params.id));
    }, {
        tags,
        detail: {
            summary: 'delete selling_sku by id',
        }
    })
export default selling_skuRouter;
