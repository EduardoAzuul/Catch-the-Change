import { mongoose } from "mongoose";

const economiczoneSchema = new mongoose.Schema({});
const economiczone = mongoose.model('economiczone', economiczoneSchema);

//getting data about economic zone from database
export async function getEconomicZone(req, res) {
  try {

    const getEconomicZone = await economiczone.find().lean();

    res.status(200).json(getEconomicZone);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load economiczone" });
  }
}