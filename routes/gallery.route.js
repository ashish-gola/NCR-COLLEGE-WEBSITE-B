import express from "express";
import {
  uploadGalleryHandler,
  deletePhotoFromGallery,
  viewGalleries,
  deleteEntireGallery
} from "../controllers/gallery.controller.js";
import { uploadGalleryPhotos } from "../middlewares/uploadGalleryPhotos.multer.js";


const router = express.Router();

// Upload up to 100 photos
router.post("/upload", uploadGalleryPhotos.array("photos", 100), uploadGalleryHandler);

// View galleries
router.get("/view", viewGalleries);

// Delete a specific photo
router.delete("/:title/:filename", deletePhotoFromGallery);

// Delete an entire gallery
router.delete("/delete/:id", deleteEntireGallery);


export default router;
