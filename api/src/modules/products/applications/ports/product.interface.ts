import type { IProduct } from "../../../../domains/product.domain";

export interface IProductRepository {
  getProductLists(
    page: number,
    limit: number,
    searchType: string,
    searchText: string
  ): Promise<{ data: IProduct[]; total: number }>;
}

const productRepositoryTokenSymbol: unique symbol = Symbol("ProductRepository");
export const productRepositoryToken = productRepositoryTokenSymbol.toString();
