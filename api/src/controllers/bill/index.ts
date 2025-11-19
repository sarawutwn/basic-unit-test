import { db } from "../../db"
import { bill } from "../../../schema"
import { asc, count } from "drizzle-orm";
export const getAll = async (query?: {
    pagination?: boolean;
    page?: number;
    perPage?: number;
}) => {
    const page = Number(query?.page) && Number(query?.page) > 0 ? Number(query?.page) : 1;
    const perPage = Number(query?.perPage) && Number(query?.perPage) > 0 ? Number(query?.perPage) : 10;
    const offset = (page - 1) * perPage;
    const data = await db.query.bill
        .findMany({
            with: {
                member: true    
            },
            orderBy: [asc(bill.id)],
            limit: perPage,
            offset: offset
        },)
    const total = await db
        .select({ count: count() })
        .from(bill);
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
