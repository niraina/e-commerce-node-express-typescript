import { getCategories, getCategory, setCategory } from "../controllers/category.controller"
import express, { Router } from "express"

const categoryRouter: Router = express.Router()
categoryRouter.get('/', getCategories)
categoryRouter.get('/:id', getCategory)
categoryRouter.post("/", setCategory)

export default categoryRouter

