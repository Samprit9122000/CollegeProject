import mongoose from "mongoose";
import colors from "colors";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://localhost:27017/FurnitureDB");
    console.log(
      `Conneted To Mongodb Databse `
    );
  } catch (error) {
    console.log(`Errro in Mongodb`);
  }
};

export default connectDB;
