import { Elysia, t } from "elysia";
import { CrudService } from "../crud.service";
import { category } from "../../schema";
import { categoryModel } from "../models/category";
import { getAllCategory } from "../controllers/category";
const app = new CrudService(category);
const tags = ['category'];
const categoryRouter = new Elysia({ prefix: "/category" })
    .use(categoryModel)
    .get("/", () => {
        return getAllCategory()
    }, {
        tags,
        detail: {
            summary: 'get all category',
        }
    })
     .get("/searchByField", ({ query }) => {
        return app.searchDataByField(query)
      },
        {
          tags,
          detail: { summary: 'search user by username' }
        }
      )
     .get("/search", ({ query }) => {
        return app.searchDataByValue(query)
      },
        {
          tags,
          detail: { summary: 'search in category' }
        }
      )
    .get("/:id", ({ params }) => {
        return app.getById(parseInt(params.id))
    }, {
        tags,
        detail: {
            summary: 'get category by id',
        }
    })
    .post("/", ({ body }) => {
        return app.post(body)
    }, {
        body: 'category.Model',
        tags,
        detail: {
            summary: 'create category',
        }
    })
    .patch('/:id', ({ params, body }) => {
        return app.updateById(body as Object, parseInt(params.id))
    }, {
        body: 'category.Model',
        tags,
        detail: {
            summary: 'update category by id',
        }
    })
    .delete('/:id', ({ params }) => {
        return app.deleteById(parseInt(params.id))
    }, {
        tags,
        detail: {
            summary: 'delete category by id',
        }
    })

export default categoryRouter;
