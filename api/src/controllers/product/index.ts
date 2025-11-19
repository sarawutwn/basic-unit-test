
import { and, or, sql, eq, like, asc, count } from "drizzle-orm";
import { db } from "../../db";
import { category, product, stock } from "../../../schema";

type SearchCondition = { key: string; value: number };

function buildWhere(
  conditions: SearchCondition[],
  matchAll = true,
  categoryId?: string
) {
  const clauses: any[] = [];

  if (conditions && conditions.length > 0) {
    const searchClauses = conditions.map(
      (c) => sql`${product.special_search} @> ${JSON.stringify([c])}::jsonb`
    );
    clauses.push(matchAll ? and(...searchClauses) : or(...searchClauses));
  }

  if (categoryId) {
    clauses.push(sql`${product.category_id} = ${categoryId}`);
  }

  if (clauses.length === 0) {
    return sql`true`;
  }
  return and(...clauses);
}

export const searchAdvance = async (
  body: SearchCondition[],
  matchAll = true,
  categoryId?: string
) => {
  const result = await db.query.product.findMany({
    where: buildWhere(body, matchAll, categoryId),
    with: {
      category: true,
      stock: true
    },
  });
  return result;
};

export const searchByShortName = async (query: string) => {
  const data = await db.query.product.findMany({
    where: like(product.short_name, `%${query}%`),
    with: {
      category: true,
      stock: true
    },
  });
  if (data.length > 0) {
    return data;
  } else {
    return [];
  }
};


export const searchByName = async (query: string) => {
  const words = query.split(/\s+/).filter(Boolean);

  if (words.length === 0) return [];
  
  let condition = like(product.name, `%${words[0]}%`);
  for (let i = 1; i < words.length; i++) {
    condition = or(condition, like(product.name, `%${words[i]}%`));
  }

  const data = await db.query.product.findMany({
    where: condition,
    with:
    {
      category: true,
      stock: true
    },
  });

  return data.length > 0 ? data : [];
};

export const searchByBrand = async (query: string) => {
  const data = await db.query.product.findMany({
    where: like(product.brand, `%${query}%`),
    with: {
      category: true,
      stock: true
    },
  });
  if (data.length > 0) {
    return data;
  } else {
    return [];
  }
};

export const searchByCategoryId = async (id: string) => {
  const data = await db.query.product.findMany({
    where: eq(product.category_id, Number(id)),
    with: {
      category: true,
      stock: true
    },
  });
  if (data.length > 0) {
    return data;
  } else {
    return [];
  }
};

export const getProductById = async (id: number) => {
  const [data] = await db.query.product.findMany({
    where: eq(product.id, id),
    with: {
      category: true,
      stock: true
    },
  });
  if (data) {
    return data;
  }
}

export const getProducts = async (query?: {
  pagination?: boolean;
  page?: number;
  perPage?: number;
}) => {
  const page = Number(query?.page) && Number(query?.page) > 0 ? Number(query?.page) : 1;
  const perPage = Number(query?.perPage) && Number(query?.perPage) > 0 ? Number(query?.perPage) : 10;
  const offset = (page - 1) * perPage;
  const data = await db.query.product
    .findMany({
      with: {
        category: true,
        stock: true
      },
      orderBy: [asc(product.id)],
      limit: perPage,
      offset: offset
    },)
  const total = await db
    .select({ count: count() })
    .from(product);
  const item: number = total[0]?.count ?? 0;
  const totalPages = Math.ceil(item / perPage);
  if (data) {
    return {
      data,
      page,
      total: item,
      perPage,
      totalPages,
    };
  }
}

export const searchBySku = async (running_number: string, shelves: string) => {
  const [data] = await db
    .select()
    .from(product)
    .leftJoin(category, eq(product.category_id, category.id))
    .leftJoin(stock, eq(product.id, stock.product_id))
    .where(
      and(
        eq(product.running_number, running_number),
        eq(category.shelves, shelves)
      )
    );
  if (data) {
    return [{ ...data?.product, category: { ...data?.category } }];
  } else {
    return [];
  }
};