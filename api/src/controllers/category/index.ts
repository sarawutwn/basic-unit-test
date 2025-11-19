import { db } from "../../db"
import { category } from "../../../schema"
export const getAllCategory = async () => {
    const result = await db
        .select()
        .from(category)
    if (result) {
        return { data: result };
    }
}