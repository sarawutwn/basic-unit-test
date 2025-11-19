import { container } from "tsyringe";
import { productRepositoryToken } from "./applications/ports/product.interface";
import { GetProductListsUsecase } from "./applications/usecases/get-product-lists.usecase";
import { ProductsController } from "./adapters/controllers/products.controller";
import { ProductDrizzleRepository } from "./adapters/repository/product.drizzle";

// controllers
container.registerSingleton(ProductsController);

// repositories
container.registerSingleton(productRepositoryToken, ProductDrizzleRepository);

// usecases
container.registerSingleton(GetProductListsUsecase.name, GetProductListsUsecase);

export default container;
