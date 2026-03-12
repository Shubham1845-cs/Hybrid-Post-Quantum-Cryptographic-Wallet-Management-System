import { Request,Response,NextFunction } from "express"

export const errorHandler=(err:any,req:Request,res:Response,next:NextFunction)=>{
     
    // log the error
    console.error(`[ERROR] ${new Date().toISOString()}:${err.message}`);
     
    const statusCode=err.statusCode || 500;

    let message=err.message;
    if(statusCode===500 && process.env.NODE_ENV==='production')
    {
        message="an unexpected internal server error occured";
    }

    res.status(statusCode).json({
        success:false,
        status:statusCode,
        error:message,
        stack:process.env.NODE_ENV==='development'?err.stack:undefined,

    });
};