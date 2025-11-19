import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class GetPresignedUrlUseCase {
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

  async execute(
    key: string,
    options?: { contentType?: string; expiresInSeconds?: number }
  ) {
    const { contentType, expiresInSeconds = 60 * 5 } = options || {};

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key.replace(/^\/+/, ""),
      ContentType: contentType,
    });

    const url = await getSignedUrl(this.s3, command, {
      expiresIn: expiresInSeconds,
    });
    return url;
  }
}
