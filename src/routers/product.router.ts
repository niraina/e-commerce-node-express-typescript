import express, { Router } from "express"
import { getProductById, getProducts, setProduct } from "../controllers/product.controller"
import { authenticateToken } from "../controllers/user.controller";

const routerProduct = Router();

routerProduct.use((req, res, next) => {
  const event = new Date();
  console.log('User time: ', event.toString());
  next();
});

// Utilisez le middleware pour protéger la route
routerProduct.get('/', authenticateToken, getProducts);
routerProduct.get('/:id', authenticateToken, getProductById);
routerProduct.post('/', authenticateToken, setProduct);

export default routerProduct;
