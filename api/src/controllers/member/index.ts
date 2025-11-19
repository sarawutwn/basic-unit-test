import { db } from "../../db"
import { member } from "../../../schema"
import { or, like } from "drizzle-orm";
export const searchData = async (query: string) => {
    const result = await db
        .select()
        .from(member)
        .where(
            or(
                like(member.phone, `%${query}%`),
                like(member.member_code, `%${query}%`),
                like(member.name, `%${query}%`)
            )
        );

    if (result) {
        return result;
    } else {
        throw {
            message: "not found member by query=" + query,
            status: 400,
        };
    }
};