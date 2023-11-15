import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/user.model";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register = async(req: Request, res: Response) => {
    try {
        const user = req.body;
        const { firstName, lastName, email, password } = user;
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const isEmailAllReadyExist = await UserModel.findOne({
          email: email,
        });
    
        // ** Add a condition if the user exist we will send the response as email all ready exist
        if (isEmailAllReadyExist) {
          res.status(400).json({
            status: 400,
            message: "Email all ready in use",
          });
           return;
        }
    
        const newUser = await UserModel.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,
        });
    
        // Send the newUser as  response;
        res.status(200).json({
          status: 201,
          success: true,
          message: " User created Successfully",
          user: newUser,
        });
      } catch (error: any) {
        // console the error to debug
        console.log(error);
    
        // Send the error message to the client
        res.status(400).json({
          status: 400,
          message: error.message.toString(),
        });
      }
}

export const login = async (req: Request, res: Response) => {
  const user = await UserModel.findOne({ email: req.body.email });

  try {
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      // Générer un access token
      const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

      // Générer un refresh token
      const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

      res.json({ accessToken, refreshToken });
    } else {
      res.json({ message: "Invalid Credentials" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const refreshTokens = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token not provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await UserModel.findById((decoded as any).userId);

    // Générer un nouveau access token
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Invalid refresh token" });
  }
}

export const getUserById = async (userId: string) => {
  try {
    const user = await UserModel.findById(userId);
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Étendez le type Request pour inclure la propriété user
declare global {
  namespace Express {
    interface Request {
      user?: any; // Vous pouvez remplacer any par le type réel de votre utilisateur si vous le connaissez
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    const user = await getUserById(decoded.userId);

    if (!user) {
      return res.status(403).json({ message: 'Forbidden - User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: 'Forbidden - Invalid token' });
  }
};