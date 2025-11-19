import { Elysia, t } from "elysia";
import { CrudService } from "../crud.service";
import { dealer } from "../../schema";
import { dealerModel } from "../models/dealer";
import { getAllDealer } from "../controllers/supply";
const app = new CrudService(dealer);
const tags = ['dealer'];
const dealerRouter = new Elysia({ prefix: "/dealer" })
  .use(dealerModel)
  .get("/", ({query}) => {
    return app.getAll(query);
  }, {
    tags,
    detail: {
      summary: 'get dealer',
    }
  })
  .get("/get-all", () => {
    return getAllDealer();
  }, {
    tags,
    detail: {
      summary: 'get all dealer',
    }
  })
  .get("/:id", ({ params }) => {
    return app.getById(parseInt(params.id));
  }, {
    tags,
    detail: {
      summary: 'get dealer by id',
    }
  })
  .get("/search", ({ query }) => {
    return app.searchDataByValue(query);
  }, {
    tags,
    detail: {
      summary: 'search dealer By Value',
    }
  })
    .get("/searchByField", ({ query }) => {
    return app.searchDataByField(query);
  },
    {
      tags,
      detail: { summary: 'search dealer By Field' }
    }
  )
  .post("/", ({ body }) => {
    return app.post(body as object);
  }, {
    body: 'dealer.model',
    tags,
    detail: {
      summary: 'create dealer',
    }
  })
  .patch('/:id', ({ params, body }) => {
    return app.updateById(body as Object, parseInt(params.id))
  }, {
    body: 'dealer.model',
    tags,
    detail: {
      summary: 'update dealer by id',
    }
  })
  .delete('/:id', ({ params }) => {
    return app.deleteById(parseInt(params.id));
  }, {
    tags,
    detail: {
      summary: 'delete dealer by id',
    }
  })

export default dealerRouter;
