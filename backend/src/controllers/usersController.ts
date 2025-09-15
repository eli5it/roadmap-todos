import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../errors";

const s3 = new S3Client({
  region: "us-east-1",
});

export async function getUploadUrl(req: Request, res: Response) {
  const user = req.user;
  if (!user) {
    throw new UnauthorizedError("Unauthorized");
  }

  const fileType = req.body.fileType;
  if (!fileType || typeof fileType !== "string") {
    throw new BadRequestError("Invalid file type provided");
  }

  const userId = user.id;
  const imageExtension = fileType.split("/")[1];
  const command = new PutObjectCommand({
    Bucket: "myapp-user-assets",
    Key: `profile-pics/${userId}.${imageExtension}`,
    ContentType: fileType,
  });

  const s3Url = await getSignedUrl(s3, command, { expiresIn: 60 });
  return res.json({
    uploadUrl: s3Url,
  });
}
