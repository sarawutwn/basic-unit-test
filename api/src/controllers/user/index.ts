
import { eq } from "drizzle-orm";
import { user } from "../../../schema";
import { db } from "../../db";
export const Login = async (body: Object, jwt) => {
  const { username, password, deviceId } = body;
  const [data] = await db.select().from(user).where(eq(user.username, username))
  if (data) {
    const ok = Bun.password.verify(password, data.password);
    if (!ok) {
      return new Response("รหัสผ่านไม่ถูกต้อง", { status: 401 });
    } else {
      const token = await jwt.sign({ id: data.id, device: deviceId })
      await db.update(user)
        .set({ token: token, updated_at: new Date() })
        .where(eq(user.id, data.id))
      return { ...data, token };
    }
  } else {
    throw {
      status: 401,
      message: "Invalid username or password"
    };
  }
};

export const GetLogin = async (token: string, jwt: any) => {
  if (!token) {
    throw {
      status: 401,
      message: "Unauthorized: token not found"
    };
  }

  try {
    const payload = await jwt.verify(token);
    if (!payload?.id) {
      throw {
        status: 401,
        message: "Invalid token payload"
      };
    }
    const [data] = await db
      .select()
      .from(user)
      .where(eq(user.id, payload.id));
    if (!data) {
      throw {
        status: 404,
        message: "User not found"
      };
    }
    return { ...data, deviceId: payload.device };
  } catch (err) {
    console.error("Auth Error:", err);
    throw {
      status: 401,
      message: "Invalid or expired token"
    };
  }
};


