import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dszvpb467",
  api_key: "119915167435319",
  api_secret: "0Xyh3cnncUTXwu1_5GOch0Qrl7E",
});

const uploadOnCloudinary = async (base64String, folderName) => {
  try {
    if (!base64String) return null;

    // Check if the base64 string has the prefix, if not, add it
    const prefixedBase64String = base64String.startsWith("data:")
      ? base64String
      : `data:image/jpeg;base64,${base64String}`;

    // Upload the base64 string to Cloudinary
    const response = await cloudinary.uploader.upload(prefixedBase64String, {
      resource_type: "image",
      folder: folderName,
    });

    return response;
  } catch (error) {
    // Handle the error (e.g., log or throw)
    console.error("Error uploading image to Cloudinary:", error);
    return null;
  }
};

export { uploadOnCloudinary };
