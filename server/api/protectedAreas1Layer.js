import { mongoose } from "mongoose";

const protectedareas1Schema = new mongoose.Schema({});
const protectedareas1 = mongoose.model('protectedareas1', protectedareas1Schema);

export async function getProtectedAreas1(req, res) {
  try {

    const getProtectedAreas1 = await protectedareas1.find().lean()

    res.status(200).json(getProtectedAreas1);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load ProtectedAreas1" });
  }
}