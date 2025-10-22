const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date, 
        default: Date.now()
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    listing: { type: Schema.Types.ObjectId, ref: "Listing" }
}) 

reviewSchema.virtual("formattedDate").get(function () {
  return this.createdAt.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
});

reviewSchema.set("toObject", { virtuals: true });
reviewSchema.set("toJSON", { virtuals: true });


module.exports = mongoose.model("Review", reviewSchema);