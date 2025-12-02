import { mongoose } from "mongoose";

const endageredSchema = new mongoose.Schema({});
const endagered = mongoose.model('iucnredmex', endageredSchema);

//getting data about endangered species from database
export async function getMarkers(req, res) {
  try {

    const markers = await endagered.find().lean();

    res.status(200).json(markers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load markers" });
  }
}