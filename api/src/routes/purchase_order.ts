import { Elysia, t } from "elysia";
import { CrudService } from "../crud.service";
import { purchase_order } from "../../schema";
import { purchase_orderModel } from "../models/purchase_order";
import GeneratePdfUseCase from "../modules/purchase-orders/generate-pdf.usecase";
const app = new CrudService(purchase_order);
const tags = ["purchase_order"];
const purchase_orderRouter = new Elysia({ prefix: "/purchase_order" })
  .use(purchase_orderModel)
  .get(
    "/",
    () => {
      return app.getAll();
    },
    {
      tags,
      detail: {
        summary: "get all purchase_order",
      },
    }
  )
  .post("/generate-pdf", async ({ body }) => {
    const generatePdfUseCase = new GeneratePdfUseCase();
    const url = await generatePdfUseCase.execute(body.purchase_order);
    return { status: "success", result: url };
  }, {
    body: t.Object({
      purchase_order: t.Object({
        id: t.String(),
        purchase_date: t.String(),
        purchase_order_supplier: t.String(),
        purchase_order_no: t.String(),
        purchase_items: t.Array(t.Object({
          name: t.String(),
          code: t.String(),
          amount: t.Number(),
          unit: t.String(),
        })),
      }),
    }),
  })
  .get(
    "/:id",
    ({ params }) => {
      return app.getById(parseInt(params.id));
    },
    {
      tags,
      detail: {
        summary: "get purchase_order by id",
      },
    }
  )
  .post(
    "/",
    ({ body }) => {
      return app.post(body as object);
    },
    {
      body: "purchase_order.model",
      tags,
      detail: {
        summary: "create purchase_order",
      },
    }
  )
  .patch(
    "/:id",
    ({ params, body }) => {
      return app.updateById(body as Object, parseInt(params.id));
    },
    {
      body: "purchase_order.model",
      tags,
      detail: {
        summary: "update purchase_order by id",
      },
    }
  )
  .delete(
    "/:id",
    ({ params }) => {
      return app.deleteById(parseInt(params.id));
    },
    {
      tags,
      detail: {
        summary: "delete purchase_order by id",
      },
    }
  );

export default purchase_orderRouter;
