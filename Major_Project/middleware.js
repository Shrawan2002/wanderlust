const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");


// module.exports.isLoggedIn = (req, res, next) => {
//     // console.log(req.path,"...", req.originalUrl);
//     if (!req.isAuthenticated()) {
//         // Save original URL in session
//         req.session.redirectUrl = req.originalUrl;
//         req.flash("error", "You must be logged in first!");
//         return res.redirect("/login");
//     }
//     next();
// }

// // store original url  befor login the user 
// module.exports.saveRedirectUrl = (req,res,next)=>{
//     if ( req.session.redirectUrl){
//         res.locals.redirectUrl =  req.session.redirectUrl;
//     }
//     return next();
// }

// check listing owner
module.exports.isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check if current user is the owner
    if (!listing.owner._id.equals(req.user._id)) { // assuming you store logged-in user in req.user
      return res.status(403).json({ 
        message: "You are not the owner of this listing",
        listingId: listing._id
      });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// check review owner
module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser && res.locals.currUser._id)){
        req.flash("error", "you are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// Server Side validation for schema convert into middleware
module.exports. validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();  
    }
}

// review validation
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
} 