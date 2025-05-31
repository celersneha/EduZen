import mongoose from "mongoose";

const connection = {};

async function dbConnect() {
  if (connection.isConnected) {
    console.log("Database is already connected");
    return;
  }

  try {
    console.log(process.env.MONGODB_URI);
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("Database connection Failed", error);
    process.exit(1);
  }
}
dbConnect();
export default dbConnect;
