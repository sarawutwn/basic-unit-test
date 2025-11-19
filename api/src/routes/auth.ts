import { Elysia, t } from "elysia";
import { GetLogin, Login } from "../controllers/user";

const tags = ['auth'];
const routerAuth = new Elysia({ prefix: "/auth" })
    .post('/login', ({ body, jwt }) => {
        return Login(body, jwt);
    }, {
        body: t.Object({
            username: t.String(),
            password: t.String(),
            deviceId: t.String()
        }),
        tags,
        detail: {
            summary: 'Login with username and password',
        }
    })
    .get('/login', ({ headers, jwt }) => {
        const token: string = headers.authorization as string;
        return GetLogin(token, jwt);
    }, {
        tags,
        detail: {
            summary: 'get user with api key',
        }
    })


export default routerAuth;