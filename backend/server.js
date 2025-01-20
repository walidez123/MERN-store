import e,{json} from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors";

// libs
import { connectDB } from "./lib/db.js";

// routes 
import authRoutes from "./routes/auth.route.js"
import categoryRoutes from './routes/category.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import orderRoutes from './routes/order.route.js';
import settingsRoutes from './routes/settings.route.js';
import paymentRoutes from "./routes/payment.route.js"
import messageRoutes from "./routes/message.route.js"

dotenv.config()
const app = e()

app.use(e.json())
app.use(cookieParser())
app.use(cors({ 
    origin: process.env.CLIENT_URL,  // Add your front-end domain here
    credentials: true,  // Allow sending cookies with CORS
  }));
 // Routes
app.use("/api/auth",authRoutes)
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/messages', messageRoutes);
app.listen(process.env.PORT,()=>{
    connectDB()
    console.log(`Server is running on port ${process.env.PORT}`)
})