import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import userRouter from "./routes/user.routes.js"

import itemRouter from "./routes/item.routes.js"
import shopRouter from "./routes/shop.routes.js"
import orderRouter from "./routes/order.routes.js"
import tableRouter from "./routes/table.routes.js"
import tableBookingRouter from "./routes/tableBooking.routes.js"
import hallRouter from "./routes/hall.routes.js"
import hallBookingRouter from "./routes/hallBooking.routes.js"
const app=express()

const port=process.env.PORT || 5000
app.use(cors({
    origin: function(origin, callback) {
        return callback(null, true);
    },
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/shop",shopRouter)
app.use("/api/item",itemRouter)
app.use("/api/order",orderRouter)
app.use("/api/table",tableRouter)
app.use("/api/table-booking",tableBookingRouter)
app.use("/api/hall", hallRouter)
app.use("/api/hall-booking", hallBookingRouter)

app.listen(port,()=>{
    connectDb()
    console.log(`server started at ${port}`)
})

export default app;
