import { inject, injectable } from "tsyringe";
import { GetProductListsUsecase } from "../../applications/usecases/get-product-lists.usecase";
import type Elysia from "elysia";

@injectable()
export class ProductsController {
  constructor(
    @inject(GetProductListsUsecase.name)
    private readonly getProductListsUsecase: GetProductListsUsecase
  ) {}

  registerRoutes(server: Elysia): Elysia {
    return server.group("/products", (app) => {
      
      app.get("/pagination", ({ query }) => {
        return this.getProductListsUsecase.execute(
          Number(query.page),
          Number(query.limit),
          query.searchType as string,
          query.searchText as string
        );
      });

      return app;
    });
  }

  getRoutes() {
    return (app: Elysia) => this.registerRoutes(app);
  }
}
