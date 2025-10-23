import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import crypto from "crypto";
import path from "path";

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_S3_BUCKET_NAME;

if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
  throw new Error(
    "AWS configuration missing in environment variables (Region, AccessKeyID, SecretAccessKey, BucketName)"
  );
}

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: bucketName,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const randomBytes = crypto.randomBytes(16).toString("hex");
      const timestamp = Date.now();
      const extension = path.extname(file.originalname);
      cb(null, `audio-${timestamp}-${randomBytes}${extension}`);
    },
  }),
  limits: { fileSize: 1024 * 1024 * 20 },
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith("audio/")) {
      return cb(null, false);
    }
    cb(null, true);
  },
});

export const uploadAudio = upload.single("audioFile");
