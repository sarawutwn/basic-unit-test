import { Elysia} from "elysia";
import { CrudService } from "../crud.service";
import { receipt_voucher } from "../../schema";
import { receipt_voucherModel } from "../models/receipt_voucher";
const app = new CrudService(receipt_voucher);
const tags = ['receipt_voucher'];
const receipt_voucherRouter = new Elysia({ prefix: "/receipt_voucher" })
    .use(receipt_voucherModel)
    .get("/", () => {
        return app.getAll();
    }, {
        tags,
        detail: {
            summary: 'get all receipt_voucher',
        }
    })
    .get("/:id", ({ params }) => {
        return app.getById(parseInt(params.id));
    }, {
        tags,
        detail: {
            summary: 'get receipt_voucher by id',
        }
    })
    .post("/", ({ body }) => {
        return app.post(body as object);
    }, {
        body: 'receipt_voucher.model',
        tags,
        detail: {
            summary: 'create receipt_voucher',
        }
    })
    .patch('/:id', ({ params, body }) => {
        return app.updateById(body as Object, parseInt(params.id));
    }, {
        body: 'receipt_voucher.model',
        tags,
        detail: {
            summary: 'update receipt_voucher by id',
        }
    })
    .delete('/:id', ({ params }) => {
        return app.deleteById(parseInt(params.id));
    }, {
        tags,
        detail: {
            summary: 'delete receipt_voucher by id',
        }
    })
export default receipt_voucherRouter;
