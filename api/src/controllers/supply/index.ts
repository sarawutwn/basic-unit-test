import { db } from "../../db"
import { dealer } from "../../../schema"
export const getAllDealer = async () => {
    const result = await db
        .select()
        .from(dealer)
    if (result) {
        return { data: result };
    }
}