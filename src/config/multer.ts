import multer from "multer";

import path from "path";

const storage = multer.diskStorage({
  destination: (
    req,
    file,
    cb
  ) => {
    cb(null, "uploads/reports");
  },

  filename: (
    req,
    file,
    cb
  ) => {
    const uniqueName =
      Date.now() +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter: multer.Options["fileFilter"] =
  (req, file, cb) => {
    const allowedMimeTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (
      allowedMimeTypes.includes(
        file.mimetype
      )
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only image files are allowed"
        )
      );
    }
  };

export const upload = multer({
  storage,
  fileFilter,
});