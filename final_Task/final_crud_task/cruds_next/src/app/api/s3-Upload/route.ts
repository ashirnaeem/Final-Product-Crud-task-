import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { Credentials } from "@aws-sdk/types";

// // Create S3 client
// const s3Client = new S3Client({
//   region: process.env.AWS_S3_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
//   },
// });
const credentials: Credentials = {
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || "",
};

// Create S3 client
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || "",
  credentials,
});

// Function to upload file to S3
async function uploadFileToS3(
  file: Readable,
  fileName: string
): Promise<string> {
  console.log("Uploading file:", fileName);

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: file,
    ContentType: "image/jpg",
    ACL: "public-read",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return fileName;
}

// Handle POST request
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = await uploadFileToS3(buffer, file.name);

    // Construct the URL for the uploaded image
    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}`;

    return NextResponse.json({ success: true, fileName, imageUrl });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

