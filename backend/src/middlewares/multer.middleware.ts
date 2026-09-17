import multer from "multer";
import type { Request } from "express";

const storage = multer.diskStorage({
    destination: function (req:Request, file:Express.Multer.File, cb:(error:Error | null,filename:string) => void) 
    {
      cb(null, "./public/temp")
    },
    filename: function (req:Request, file:Express.Multer.File, cb:(error:Error | null,filename:string) =>void) {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
      cb(null, `${uniqueSuffix}-${file.originalname}`)
    }
  })
  
export const upload = multer({ 
    storage, 
})