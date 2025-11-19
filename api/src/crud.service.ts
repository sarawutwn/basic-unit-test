
import { db } from "./db"
import { asc, count, eq, like } from "drizzle-orm";

export class CrudService<T> {
  constructor(private table: any) {

  }

  async getAll(query?: {
    pagination?: boolean;
    page?: number;
    perPage?: number;
  }): Promise<{
    data: T[];
    total: number;
    page?: number;
    perPage?: number;
    totalPages?: number;
  }> {
    const page = Number(query?.page) && Number(query?.page) > 0 ? Number(query?.page) : 1;
    const perPage = Number(query?.perPage) && Number(query?.perPage) > 0 ? Number(query?.perPage) : 10;
    const offset = (page - 1) * perPage;

    let q = db
      .select({
        ...this.table,
      })
      .from(this.table)
      .orderBy(asc(this.table.id))
      .limit(Number(perPage))
      .offset(offset);

    const data = await q;
    const total = await db
      .select({ count: count() })
      .from(this.table);

    const item: number = total[0]?.count ?? 0;
    const totalPages = Math.ceil(item / perPage);

    return {
      data: data as unknown as T[],
      page,
      total: item,
      perPage,
      totalPages,
    };
  }


  async post(body: Object) {
    const [data] = await db.insert(this.table)
      .values(body)
      .returning() as any[]
    if (data) {
      return { message: "create data success", data }
    }
  }

  async updateById(body: Object, id: Number) {
    const [data] = await db.update(this.table)
      .set(body)
      .where(eq(this.table.id, id))
      .returning();
    if (data) {
      return { message: "update data success", data }
    } else {
      throw {
        message: "ไม่สามารถแก้ไขข้อมูลได้",
        code: 'NOT_FOUND',
        status: 400
      }
    }
  }

  async getById(id: number) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw {
        message: "Invalid id: must be a number",
        data: [],
        status: 400
      };
    }
    const [data] = await db.select().from(this.table).where(eq(this.table.id, id));
    if (data) {
      return { message: "get data by id", data };
    } else {
      throw {
        message: "not found data by id " + id,
        data: [],
        status: 400
      };
    }
  }

  async searchDataByField(query: Record<string, any>) {
    const keys = Object.keys(query);
    if (keys.length === 0) {
      throw {
        message: "No search field provided",
        data: [],
        status: 400
      };
    }

    const field = keys[0];
    if (!field) {
      throw {
        message: "Field is required",
        data: [],
        status: 400
      };
    }
    const value = query[field];

    if (!(field in this.table)) {
      throw {
        message: `Invalid field: ${field}`,
        data: [],
        status: 400
      };
    }

    if (!value) {
      throw {
        message: "Search value cannot be empty",
        data: [],
        status: 400
      };
    }

    if (!field) {
      throw new Error("field is required");
    }
    const data = await db
      .select()
      .from(this.table)
      .orderBy(asc(this.table.id))
      .where(eq((this.table as any)[field], value));

    if (data.length > 0) {
      return { message: `get data by ${field}`, data };
    } else {
      throw {
        message: `Not found data by ${field} = ${value}`,
        data: [],
        status: 400
      };
    }
  }

  async searchDataByValue(query: Record<string, any>) {
    const keys = Object.keys(query);
    if (keys.length === 0) {
      throw {
        message: "No search field provided",
        data: [],
        status: 400
      };
    }

    const field = keys[0];
    if (!field) {
      throw {
        message: "Field is required",
        data: [],
        status: 400
      };
    }
    const value = query[field];


    if (!value) {
      throw {
        message: "Search value cannot be empty",
        data: [],
        status: 400
      };
    }

    const data = await db
      .select()
      .from(this.table)
      .where(like(this.table[field], `%${value}%`));

    if (data.length > 0) {
      return { message: `get data by ${field}`, data };
    } else {
      throw {
        message: `Not found data by ${field} = ${value}`,
        data: [],
        status: 400
      };
    }
  }


  async deleteById(id: number) {
    const [data] = await db.delete(this.table)
      .where(eq(this.table.id, id))
      .returning() as any[]
    if (data) {
      return { message: "deleted data", data }
    } else {
      throw {
        message: "ไม่สามารถลบข้อมูลได้ เนื่องจากไม่พบข้อมูล หรือข้อมูลถูกลบไปแล้ว",
        code: 'NOT_FOUND',
        status: 400
      }

    }
  }

}
