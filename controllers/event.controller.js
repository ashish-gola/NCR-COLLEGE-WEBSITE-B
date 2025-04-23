import { Event } from "../models/events.model.js";
import { APIresponse } from "../utils/APIresponse.js";
import { APIError } from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new event
export const createEvent = asyncHandler(async (req, res) => {
  const { name, date, time, description, location, organizer, imageUrl } = req.body;

  // Validate required fields
  if (!name || !date || !time || !description) {
    throw new APIError(400, "Missing required fields: name, date, time, or description");
  }

  const event = new Event({
    name,
    date,
    time,
    description,
    location: location || "To be announced",
    organizer: organizer || "Admin",
    imageUrl,
  });

  const savedEvent = await event.save();
  res.status(201).json(new APIresponse(201, savedEvent, "Event created successfully"));
});

// Get all events
export const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find();
  res.status(200).json(new APIresponse(200, events, "Events fetched successfully"));
});

// Get a single event by ID
export const getEventById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id) {
    throw new APIError(400, "Event ID is required");
  }

  const event = await Event.findById(id);
  if (!event) {
    throw new APIError(404, "Event not found");
  }

  res.status(200).json(new APIresponse(200, event, "Event fetched successfully"));
});

// Update an event by ID
export const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, date, time, description, location, organizer, imageUrl } = req.body;

  // Validate ID
  if (!id) {
    throw new APIError(400, "Event ID is required");
  }

  // Validate required fields if provided
  if (name === "" || date === "" || time === "" || description === "") {
    throw new APIError(400, "Required fields cannot be empty");
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    id,
    { name, date, time, description, location, organizer, imageUrl },
    { new: true, runValidators: true }
  );

  if (!updatedEvent) {
    throw new APIError(404, "Event not found");
  }

  res.status(200).json(new APIresponse(200, updatedEvent, "Event updated successfully"));
});

// Delete an event by ID
export const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id) {
    throw new APIError(400, "Event ID is required");
  }

  const deletedEvent = await Event.findByIdAndDelete(id);
  if (!deletedEvent) {
    throw new APIError(404, "Event not found");
  }

  res.status(200).json(new APIresponse(200, null, "Event deleted successfully"));
});


export const uploadEventPhotoHandler = async (req, res) => {
  try {
    const eventId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ error: "No event photo uploaded." });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    // Save photo filename in event document
    event.photo = req.file.filename;
    await event.save();

    res.status(200).json({
      message: "Event photo uploaded and updated.",
      file: req.file,
      event,
    });

  } catch (error) {
    console.error("Upload Event Photo Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
