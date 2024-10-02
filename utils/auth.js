import * as dotenv from "dotenv";
dotenv.config();

export const Protect = (req,res,next) => {
  if (!res.locals.user) {
      return res.redirect("/login");
  } else{
      next();
  }
};

export const Origin = (req,res,next) => {
  if(req.headers?.origin !== process.env.BASE_URL){
    return res.redirect(`${req.headers?.referer}`);
  } else {
    next();
  }
};