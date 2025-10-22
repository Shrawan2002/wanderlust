const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    console.log(req.body.listingId);
    // let listing = await Listing.findById(req.body.listingId);
    let newReview = new Review(req.body);
    // add review creater
    newReview.author = req.user._id;
    newReview.listing = req.body.listingId;
    // console.log(newReview);
    // listing.reviews.push(newReview);

    await newReview.save();
    console.log("new review saved");
    res.status(200).json({
        message: "Review created successfully..",
        newReview,
    });
}

module.exports.destoryReview = async (req, res) => {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
        return res.status(404).json({ message: "Review not found" });
    }

    res.json({
        message: "Review deleted successfully",
        reviewId: review._id,
        listingId: review.listing
    });
}