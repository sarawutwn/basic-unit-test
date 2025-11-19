import "reflect-metadata";
import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { jwt } from "@elysiajs/jwt";
import userRouter from "./routes/user";
import routerAuth from "./routes/auth";
import routerProduct from "./routes/product";
import billRouter from "./routes/bill";
import routerStock from "./routes/stock";
import billDetailRouter from "./routes/bill_detail";
import categoryRouter from "./routes/category";
import dealerRouter from "./routes/dealer";
import Improve_stockRouter from "./routes/Improve_stock";
import memberRouter from "./routes/member";
import productTypeRouter from "./routes/product_type";
import purchase_detailRouter from "./routes/purchase_detail";
import receipt_voucherRouter from "./routes/receipt_voucher";
import selling_skuRouter from "./routes/selling_sku";
import invoiceRouter from "./routes/invoice";
import invoice_detailRouter from "./routes/invoice_detail";
import creditRouter from "./routes/credit";
import credit_productRouter from "./routes/credit_product";
import total_bill from "./routes/total_bill";
import payout_record from "./routes/payout_record";
import purchase_orderRouter from "./routes/purchase_order";
import { cors } from "@elysiajs/cors";
import secretCodeRouter from "./routes/secret_code";
import uploadRouter from "./routes/upload";

import { container } from "tsyringe";

import "./modules/products/product.module";
import { ProductsController } from "./modules/products/adapters/controllers/products.controller";
const productsController = container.resolve(ProductsController);

const app = new Elysia()
  .use(cors())
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET as string,
      exp: "1d",
    })
  )
  .use(
    swagger({
      path: "/swagger",
      documentation: {
        info: {
          title: "SPARE-PART-SYSTEM",
          version: "1.0.0",
        },
      },
    })
  )
  .group("/api", (app) =>
    app
      .use(userRouter)
      .use(routerAuth)
      .use(routerProduct)
      .use(billRouter)
      .use(routerStock)
      .use(billDetailRouter)
      .use(categoryRouter)
      .use(dealerRouter)
      .use(Improve_stockRouter)
      .use(memberRouter)
      .use(productTypeRouter)
      .use(purchase_detailRouter)
      .use(purchase_orderRouter)
      .use(receipt_voucherRouter)
      .use(selling_skuRouter)
      .use(invoiceRouter)
      .use(invoice_detailRouter)
      .use(creditRouter)
      .use(credit_productRouter)
      .use(total_bill)
      .use(payout_record)
      .use(secretCodeRouter)
      .use(uploadRouter)
      .use(productsController.getRoutes())
  )
  .listen(3050);

console.log(`Listening at http://localhost:${app?.server?.port}/swagger`);
