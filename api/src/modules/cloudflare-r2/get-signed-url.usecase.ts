import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class GetSignedUrlUseCase {
  private s3: S3Client;
  private bucketName: string;
  constructor() {
    this.s3 = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
    this.bucketName = process.env.R2_BUCKET_NAME!;
  }

  async execute(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key.replace(/^\/+/, ""),
      ResponseContentDisposition: "inline",
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 60 });
    return url;
  }
}

export default GetSignedUrlUseCase;
