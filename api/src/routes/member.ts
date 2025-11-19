import { Elysia, t } from "elysia";
import { CrudService } from "../crud.service";
import { member } from "../../schema";
import { memberModel } from "../models/member";
import { searchData } from "../controllers/member";
const app = new CrudService(member);
const tags = ['member'];
const memberRouter = new Elysia({ prefix: "/member" })
    .use(memberModel)
    .get("/", ({ query }) => {
        return app.getAll(query);
    }, {
        tags,
        detail: {
            summary: 'get all member',
        }
    })
    .get("/:id", ({ params }) => {
        return app.getById(parseInt(params.id));
    }, {
        tags,
        detail: {
            summary: 'get member by id',
        }
    })
    .get("/search", ({ query }) => {
        return searchData(query.search_query);
    }, {
        query: t.Object({ search_query: t.String() }),
        tags,
        detail: {
            summary: 'search_query',
        }
    })
    .get("/searchByField", ({ query }) => {
        return app.searchDataByField(query);
    }, {
        tags,
        detail: {
            summary: 'search by field',
        }
    })
    .post("/", ({ body }) => {
        return app.post(body as object)
    }, {
        body: 'member.model',
        tags,
        detail: {
            summary: 'create member',
        }
    })
    .patch('/:id', ({ params, body }) => {
        return app.updateById(body as Object, parseInt(params.id))
    }, {
        body: 'member.model',
        tags,
        detail: {
            summary: 'update member by id',
        }
    })
    .delete('/:id', ({ params }) => {
        return app.deleteById(parseInt(params.id))
    }, {
        tags,
        detail: {
            summary: 'delete member by id',
        }
    })
export default memberRouter;
