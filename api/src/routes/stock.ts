import { Elysia } from "elysia";
import { CrudService } from "../crud.service";
import { stock } from "../../schema";
import { stockModel } from "../models/stock";
import { getStockByProduct } from "../controllers/stock";
const app = new CrudService(stock);
const tags = ['stock'];
const routerStock = new Elysia({ prefix: "/stock" })
    .use(stockModel)
    .get("/", () => {
        return app.getAll()
    }, {
        tags,
        detail: {
            summary: 'get stock',
        }
    })
    .get("/getByProductId/:product_id", ({ params }) => {
      return getStockByProduct(Number(params.product_id));
    },
        {
            tags,
            detail: { summary: 'get stock by productId' }
        }
    )
    .get("/:id", ({ params }) => {
        return app.getById(parseInt(params.id))
    }, {
        tags,
        detail: {
            summary: 'get stock by stock_id',
        }
    })
    .post("/", ({ body }) => {
        return app.post(body as object);
    }, {
        body: 'stock.model',
        tags,
        detail: {
            summary: 'create stock',
        }
    })
    .patch('/:id', ({ params, body }) => {
        return app.updateById(body as Object, parseInt(params.id));
    }, {
        body: 'stock.model',
        tags,
        detail: {
            summary: 'update stock by id',
        }
    })
    .delete('/:id', ({ params }) => {
        return app.deleteById(parseInt(params.id));
    }, {
        tags,
        detail: {
            summary: 'delete stock by id',
        }
    })
export default routerStock;