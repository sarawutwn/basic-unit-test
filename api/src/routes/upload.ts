import { Elysia, t } from "elysia";
import { GetPresignedUrlUseCase } from "../modules/cloudflare-r2/get-presigned-url.usecase";
import GetSignedUrlUsecase from "../modules/cloudflare-r2/get-signed-url.usecase";

const uploadRouter = new Elysia({ prefix: "/upload" })
  .post(
    "/",
    ({ body }: { body: { key: string; contentType: string } }) => {
      const getPresignedUrlUseCase = new GetPresignedUrlUseCase();
      return getPresignedUrlUseCase.execute(body.key, {
        contentType: body.contentType,
      });
    },
    {
      body: t.Object({
        key: t.String(),
        contentType: t.String(),
      }),
    }
  )
  .get(
    "/signed-url",
    ({ query }: { query: { key: string } }) => {
      const getSignedUrlUseCase = new GetSignedUrlUsecase();
      return getSignedUrlUseCase.execute(query.key);
    },
    {
      query: t.Object({
        key: t.String(),
      }),
    }
  );

export default uploadRouter;
