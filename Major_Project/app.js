if(process.env.NODE_ENV != "production"){
    require("dotenv").config();   
}
const express = require("express"); 
const app = express();
const cors = require('cors');
const path = require("path");
const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");
const ExpressError = require("./utils/ExpressError");
const User = require("./models/user.js");
const connectDB = require("./config/db.js");
const reviewRouter = require("./routes/review.js");


const corsOptions = {
  origin: "http://localhost:3000", // React frontend
  credentials: true,
};

app.use(cors(corsOptions));
    
app.use(express.static(path.join(__dirname,"/public")))
app.use(express.urlencoded({extended:true}));
app.use(express.json());


connectDB();

app.use("/api/listings", listingRouter);
app.use("/api", userRouter);
app.use("/api/listings/reviews",reviewRouter);


// The error just means Chrome looked for a special debugging config file your server doesn’t have. Your app is fine.

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(204).end(); // No Content, avoids 404 error
});



app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404,"Page Not Found!"));
});



// Error Handling Middlewares

app.use((err,req,res,next)=>{
    // res.send("something went wrong");
    let {statusCode = 500, message = "something went wrong!"} = err;
    console.log(statusCode);
    console.error("❌ Error stack:", err.stack); 
    // res.status(statusCode).send(message); 
    // res.status(statusCode).render("error.ejs",{message});
    res.status(statusCode).json({message});
})


app.listen(8080, ()=>{
    console.log("server is listening on port 8080");
});