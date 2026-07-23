import connectDb from "./config/db.js";
import TableBooking from "./models/tableBooking.model.js";
import HallBooking from "./models/hallBooking.model.js";
import dotenv from "dotenv";

dotenv.config();

const clean = async () => {
    await connectDb();
    await TableBooking.deleteMany({});
    await HallBooking.deleteMany({});
    console.log("Bookings deleted");
    process.exit(0);
}

clean();
