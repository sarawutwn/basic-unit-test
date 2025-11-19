import "reflect-metadata";
import { beforeEach, describe, expect, it } from "vitest";
import { GetProductListsUsecase } from "./get-product-lists.usecase";
import { mock } from "vitest-mock-extended";
import type { IProductRepository } from "../ports/product.interface";
import { Builder } from "builder-pattern";
import type { IProduct } from "../../../../domains/product.domain";

describe("GetProductListsUsecase", () => {
  let usecase: GetProductListsUsecase;
  const mockProductRepository = mock<IProductRepository>();

  beforeEach(() => {
    usecase = new GetProductListsUsecase(mockProductRepository);
  });

  it("should return product lists", async () => {
    // arrange
    const page = 1;
    const limit = 10;
    const searchType = "name";
    const searchText = "";
    const expected: { data: IProduct[]; total: number } = {
      data: [
        Builder<IProduct>()
          .id(1)
          .name("Product 1")
          .secret_code("SEC001")
          .created_at(new Date())
          .updated_at(new Date())
          .build(),
      ],
      total: 1,
    };
    mockProductRepository.getProductLists.mockResolvedValue(expected);

    // act
    const result = await usecase.execute(page, limit, searchType, searchText);

    // assert
    expect(result).toBeDefined();
    expect(result).toEqual(expected);
    expect(mockProductRepository.getProductLists).toHaveBeenCalledWith(
      page,
      limit,
      searchType,
      searchText
    );
  });
});
