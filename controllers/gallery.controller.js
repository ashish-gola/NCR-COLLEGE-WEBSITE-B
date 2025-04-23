import { Gallery } from "../models/gallery.model.js";
import fs from "fs";
import path from "path";

// Upload photos to gallery
export const uploadGalleryHandler = async (req, res) => {
  const title = req.body.title;
  const files = req.files;

  if (!title || !files.length) {
    return res.status(400).json({ message: "Title and photos are required" });
  }

  try {
    let gallery = await Gallery.findOne({ title });

    const photoFilenames = files.map(file => file.filename);

    if (gallery) {
      gallery.photos.push(...photoFilenames);
      await gallery.save();
    } else {
      gallery = await Gallery.create({
        title,
        photos: photoFilenames,
      });
    }

    res.status(200).json({ message: "Photos uploaded", gallery });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// View all galleries
export const viewGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find();
    res.status(200).json({ galleries });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Delete one photo by gallery + filename
export const deletePhotoFromGallery = async (req, res) => {
  const { title, filename } = req.params;
  const filePath = `./uploads/galleryPhotos/${title}/${filename}`;

  try {
    const gallery = await Gallery.findOne({ title });
    if (!gallery) return res.status(404).json({ message: "Gallery not found" });

    gallery.photos = gallery.photos.filter(photo => photo !== filename);
    await gallery.save();

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({ message: "Photo deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Delete entire gallery
export const deleteEntireGallery = async (req, res) => {
  const { title } = req.params;

  try {
    const gallery = await Gallery.findOne({ title });
    if (!gallery) return res.status(404).json({ message: "Gallery not found" });

    const dir = `./uploads/galleryPhotos/${title}`;
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true });
    }

    await Gallery.deleteOne({ title });

    res.status(200).json({ message: "Gallery deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
