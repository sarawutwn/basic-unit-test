import {
  productRepositoryToken,
  type IProductRepository,
} from "../ports/product.interface";
import type { IProduct } from "../../../../domains/product.domain";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetProductListsUsecase {
  constructor(
    @inject(productRepositoryToken)
    private productRepository: IProductRepository
  ) {}

  async execute(
    page: number,
    limit: number,
    searchType: string,
    searchText: string
  ): Promise<{ data: IProduct[]; total: number }> {
    return this.productRepository.getProductLists(
      page,
      limit,
      searchType,
      searchText
    );
  }
}
