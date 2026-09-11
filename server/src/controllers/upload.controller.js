import cloudinary from "../config/cloudinary.js";

// ======================================================
// UPLOAD SINGLE IMAGE
// POST /api/v1/upload/single
// ======================================================

export const uploadSingleImage = async (
  req,
  res
) => {
  try {
    // ==================================================
    // CHECK FILE
    // ==================================================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image.",
      });
    }

    // ==================================================
    // CLOUDINARY RESPONSE
    // ==================================================

    const {
      originalname,
      mimetype,
      size,
      filename,
      path,
    } = req.file;

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully.",

      image: {
        originalName: originalname,

        fileName: filename,

        mimeType: mimetype,

        size,

        url: path,
      },
    });

  } catch (error) {
    console.error(
      "Upload Single Image Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to upload image.",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};
// ======================================================
// UPLOAD MULTIPLE IMAGES
// POST /api/v1/upload/multiple
// ======================================================

export const uploadMultipleImages =
  async (req, res) => {
    try {
      // ================================================
      // CHECK FILES
      // ================================================

      if (
        !req.files ||
        req.files.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please select at least one image.",
        });
      }

      // ================================================
      // FORMAT RESPONSE
      // ================================================

      const images = req.files.map(
        (file) => ({
          originalName:
            file.originalname,

          fileName:
            file.filename,

          mimeType:
            file.mimetype,

          size:
            file.size,

          url:
            file.path,
        })
      );

      return res.status(200).json({
        success: true,

        message: `${images.length} image(s) uploaded successfully.`,

        totalImages:
          images.length,

        images,
      });
    } catch (error) {
      console.error(
        "Upload Multiple Images Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to upload images.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };
  // ======================================================
// DELETE IMAGE
// DELETE /api/v1/upload/:publicId
// ======================================================

export const deleteImage = async (
  req,
  res
) => {
  try {
    const { publicId } = req.params;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required.",
      });
    }

    // ==================================================
    // DELETE FROM CLOUDINARY
    // ==================================================

    const result =
      await cloudinary.uploader.destroy(
        publicId,
        {
          resource_type: "image",
        }
      );

    // ==================================================
    // NOT FOUND
    // ==================================================

    if (
      result.result === "not found"
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Image not found on Cloudinary.",
      });
    }

    // ==================================================
    // SUCCESS
    // ==================================================

    return res.status(200).json({
      success: true,
      message:
        "Image deleted successfully.",
      result,
    });

  } catch (error) {
    console.error(
      "Delete Image Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete image.",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};
