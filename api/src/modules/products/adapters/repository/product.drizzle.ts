import { count, eq, like, or, SQL } from "drizzle-orm";
import { dealer, product } from "../../../../../schema";
import { db } from "../../../../db";
import type { IProduct } from "../../../../domains/product.domain";
import type { IProductRepository } from "../../applications/ports/product.interface";
import { Builder } from "builder-pattern";
import { injectable } from "tsyringe";
import type { IDealer } from "../../../../domains/dealer.domain";
import { getProductListsSchema } from "./schemas/product.drizzle.schema";

@injectable()
export class ProductDrizzleRepository implements IProductRepository {
  async getProductLists(
    page: number,
    limit: number,
    searchType: string,
    searchText: string
  ): Promise<{ data: IProduct[]; total: number }> {
    console.log(page, limit, searchType, searchText);
    let searchCondition: SQL<unknown> | undefined = undefined;
    if (searchText) {
      if (searchType === "name") {
        searchCondition = or(
          like(product.name, `%${searchText}%`),
          like(product.short_name, `%${searchText}%`)
        );
      }
      if (searchType === "authentic_code") {
        searchCondition = like(product.authentic_code, `%${searchText}%`);
      }
      if (searchType === "dealer_name") {
        searchCondition = like(dealer.name, `%${searchText}%`);
      }
    }

    const productLists = await db
      .select(getProductListsSchema)
      .from(product)
      .innerJoin(dealer, eq(product.dealer_id, dealer.id))
      .limit(limit)
      .where(searchCondition ?? undefined)
      .offset((page - 1) * limit);

    const total = await db
      .select({ count: count() })
      .from(product)
      .where(searchCondition ?? undefined);

    console.log(productLists);
    return {
      data: productLists.map(ProductDrizzleRepository.buildToDomain),
      total: total[0]?.count ?? 0,
    };
  }

  private static buildToDomain(product: any): IProduct {
    const productDomain = Builder<IProduct>()
      .id(product.id)
      .running_number(product.running_number)
      .factory_number(product.factory_number)
      .short_name(product.short_name)
      .name(product.name)
      .model(product.model)
      .brand(product.brand)
      .cost(product.cost)
      .sale_price(product.sale_price)
      .technician_price(product.technician_price)
      .price2(product.price2)
      .special_price_one(product.special_price_one)
      .special_price_two(product.special_price_two)
      .authentic_code(product.authentic_code)
      .category_id(product.category_id)
      .secret_code(product.secret_code)
      .special_search(product.special_search)
      .created_by_id(product.created_by_id)
      .dealer_id(product.dealer_id)
      .last_price(product.last_price)
      .unit_big(product.unit_big)
      .unit_small(product.unit_small)
      .substitute_product_name(product.substitute_product_name)
      .storage_location(product.storage_location)
      .created_at(product.created_at)
      .updated_at(product.updated_at)
      .deleted_at(product.deleted_at);

    if (product.dealer) {
      productDomain.dealer(
        Builder<IDealer>()
          .id(product.dealer.id)
          .name(product.dealer.name)
          .address(product.dealer.address)
          .phone(product.dealer.phone)
          .build()
      );
    }

    return productDomain.build();
  }
}
