import { Elysia } from "elysia";
import { CrudService } from "../crud.service";
import { secret_code } from "../../schema";
import { secretCodeModel } from "../models/secret_code";
const app = new CrudService(secret_code);
const tags = ['secret_code'];
const secretCodeRouter = new Elysia({ prefix: "/secret_code" })
    .use(secretCodeModel)
    .get("/", ({query}) => {
        return app.getAll(query)
    }, {
        tags,
        detail: {
            summary: 'get secret_code',
        }
    })
    .get("/:id", ({ params }) => {
        return app.getById(parseInt(params.id))
    }, {
        tags,
        detail: {
            summary: 'get secret_code by id',
        }
    })
    .get("/filter", ({ query }) => {
        return app.searchDataByField(query)   
    }, {
        tags,
        detail: {
            summary: 'get secret_code by id',
        }
    })
    .post("/", ({ body }) => {
        return app.post(body as object);
    }, {
        body: 'secret_code.model',
        tags,
        detail: {
            summary: 'create secret_code',
        }
    })
    .patch('/:id', ({ params, body }) => {
        return app.updateById(body as Object, parseInt(params.id));
    }, {
        body: 'secret_code.model',
        tags,
        detail: {
            summary: 'update secret_code by id',
        }
    })
    .delete('/:id', ({ params }) => {
        return app.deleteById(parseInt(params.id));
    }, {
        tags,
        detail: {
            summary: 'delete secret_code by id',
        }
    })
export default secretCodeRouter;