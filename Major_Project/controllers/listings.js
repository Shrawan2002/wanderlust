const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


// Assuming you have Listing imported
module.exports.index = async (req, res) => {
  try {
    // Get page number from query params, default is 1
    const page = parseInt(req.query.page) || 1;
    const limit = 3; // number of listings per page
    const skip = (page - 1) * limit;

    // Get search query from query params
    const searchQuery = req.query.search || "";
    const userQuery = req.query.userId || "";

    const filter = {};
    // Build a filter object for search
    if(searchQuery){
      filter.title = { $regex: searchQuery, $options: "i" }
    }
    if(userQuery){
      filter.owner = userQuery;
    }
    

    // Fetch listings with pagination and search filter
    const allListings = await Listing.find(filter)
      .skip(skip)
      .limit(limit);

    const totalListings = await Listing.countDocuments(filter);

    res.status(200).json({
      message: "Fetched listings successfully!",
      listings: allListings,
      totalListings,
      currentPage: page,
      totalPages: Math.ceil(totalListings / limit)
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



module.exports.createListing = async (req, res, next) => {
  console.log(req.body);
  let response = await geocodingClient.forwardGeocode({
    query: req.body.location,
    limit: 1
  })
    .send();
  //   console.log(response.body.features[0].geometry);
  //   res.send("done!");

  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url, "...", filename);

  let listing = req.body;
  let newListing = new Listing(listing);
  newListing.image = { filename, url };

  newListing.geometry = response.body.features[0].geometry;

  newListing.owner = req.user._id;

  await newListing.save();
  res.status(200).json({
    message: "Listing created successfully!",
    listing: newListing,
  });

}

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
  .populate("owner"); // populate owner data

  if (!listing) {
    throw new Error("Listing not found");
  }

  // Fetch reviews via your model method
  const reviews = await listing.getReviews();

  const result = {
    ...listing.toObject(), // convert mongoose doc to plain object
    reviews,               // attach reviews array
  };

  res.status(200).json({
    message: "Listing fetched successfully..",
    listing:result,
  });
}

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings")
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  console.log(originalImageUrl);
  res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    // Optional: Validate request body
    // if (!req.body || Object.keys(req.body).length === 0) {
    //   return res.status(400).json({ message: "Please send valid data to update listing" });
    // }

    // Update the listing
    let listing = await Listing.findByIdAndUpdate(id, req.body, { new: true });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Handle uploaded image if present
    if (req.file) {
      const url = req.file.path;
      const filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }

    // Send JSON response to frontend
    res.json({
      message: "Listing updated successfully",
      listing
    });
};



module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  //  console.log(deleteListing);
  req.flash("success", "Listing Deleted!")
  res.redirect("/listings");
}