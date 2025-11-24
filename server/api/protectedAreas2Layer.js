import { mongoose } from "mongoose";

const protectedareas2Schema = new mongoose.Schema({});
const protectedareas2 = mongoose.model('protectedareas2', protectedareas2Schema);

export async function getProtectedAreas2(req, res) {
  try {

    const getProtectedAreas2 = await protectedareas2.find();

    res.status(200).json(getProtectedAreas2);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load ProtectedAreas2" });
  }
}