import type { RequestHandler } from 'express';
import type { ZodObject } from 'zod/v4';
import { cloudinaryClient } from './upload.ts';

const cleanupCloudinaryUploads = async (files: Express.Multer.File[] | undefined) => {
  if (!files?.length) return;

  const deletions = files
    .map((file) => file.filename)
    .filter((publicId): publicId is string => Boolean(publicId))
    .map((publicId) => cloudinaryClient.uploader.destroy(publicId));

  await Promise.allSettled(deletions);
};

const validateBodyZod =
  (zodSchema: ZodObject): RequestHandler =>
  async (req, res, next) => {
    const parsed = zodSchema.safeParse(req.body);

    if (!parsed.success) {
      await cleanupCloudinaryUploads(req.files as Express.Multer.File[] | undefined);

      const issues = parsed.error?.issues.map((issue) => ({
        path: issue.path.join(),
        message: issue.message,
      }));

      return res.status(400).json({
        message: 'Validation failed',
        issues,
      });
    }

    req.body = parsed.data;
    next();
  };

export default validateBodyZod;
