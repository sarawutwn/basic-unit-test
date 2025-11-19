import { db } from "../../db"
import { stock } from "../../../schema"
import { eq } from "drizzle-orm";

export const getStockByProduct = async (id: number) => {
    const [result] = await db
        .select()
        .from(stock)
        .where(eq(stock.product_id, id));
    if (result) {
        return result;
    } else {
        throw {
            message: "not  found stock by product id=" + id
            , status: 400
        }
    }

}