import { setAttachement } from "../controllers/attachement.controller";
import express, { Router } from "express"
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
  });
  
const upload = multer({ storage: storage });


const attachementRouter: Router = express.Router()
attachementRouter.post("/", upload.single('file'), setAttachement)

export default attachementRouter