import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});

// service code
// const avatarLocalPath = req.files?.avatar[0]?.path;
// if (!avatarLocalPath) {
//   throw new ApiError(400, "Avatar file is required");
// }

// let coverImageLocalPath;
// if (
//   req.files &&
//   Array.isArray(req.files.coverImage) &&
//   req.files.coverImage.length > 0
// ) {
//   coverImageLocalPath = req.files.coverImage[0].path;
// }

// const avatar = await uploadOnCloudinary(avatarLocalPath);
// const coverImage = await uploadOnCloudinary(coverImageLocalPath);

// routers
// upload.fields([
//   {
//     name: "avatar",
//     maxCount: 1,
//   },
//   {
//     name: "coverImage",
//     maxCount: 1,
//   },
// ]),
