import { Elysia } from "elysia";
import { CrudService } from "../crud.service";
import { product_type } from "../../schema";
import { productTypeModel } from "../models/product_type";
const app = new CrudService(product_type);
const tags = ['product_type'];
const productTypeRouter = new Elysia({ prefix: "/product_type" })
    .use(productTypeModel)
    .get("/", () => {
        return app.getAll()
    }, {
        tags,
        detail: {
            summary: 'get all product_type',
        }
    })
    .get("/:id", ({ params }) => {
        return app.getById(parseInt(params.id))
    }, {
        tags,
        detail: {
            summary: 'get product_type by id',
        }
    })
    .post("/", ({ body }) => {
        return app.post(body as object)
    }, {
        body: 'productType.model',
        tags,
        detail: {
            summary: 'create productType',
        }
    })
    .patch('/:id', ({ params, body }) => {
        return app.updateById(body as Object, parseInt(params.id))
    }, {
        body: 'productType.model',
        tags,
        detail: {
            summary: 'update productType by id',
        }
    })
    .delete('/:id', ({ params }) => {
        return app.deleteById(parseInt(params.id))
    }, {
        tags,
        detail: {
            summary: 'delete productType by id',
        }
    })
export default productTypeRouter;
