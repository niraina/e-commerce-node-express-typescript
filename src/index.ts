import express from "express";
import cors from "cors";
import dotenv from 'dotenv'; 
import { connectDB } from "./shared/config";
import routerProduct from "./routers/product.router";
import categoryRouter from "./routers/category.router";
import attachementRouter from "./routers/attachement.router";
import userRouter from "./routers/user.router";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

app.use(cors({credentials: true}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'))


app.listen(process.env.PORT, () => {
    console.log(`Server running in http://localhost:${process.env.PORT}`);
})

connectDB();

/**Router */
app.use('/products', routerProduct)
app.use('/categories', categoryRouter)
app.use('/attachement', attachementRouter)
app.use('/auth', userRouter)