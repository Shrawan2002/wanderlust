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

    // Build a filter object for search
    const filter = searchQuery
      ? { title: { $regex: searchQuery, $options: "i" } } // Case-insensitive search on 'title'
      : {};

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
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      }
    }).
    populate("owner");
  // console.log(listing);
  if (!listing) {
    return res.send(400).json({ error: "Listing you requested for does not exist"});
  }

  res.status(200).json({
    message: "Listing fetched successfully..",
    listing,
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
  let { id } = req.params;
  // console.log(req.body.listing); 

  // if(!req.body.listing){
  //     throw new ExpressError(400, "send valid data for listing");
  // }

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof (req.file) !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!")
  res.redirect(`/listings/${id}`);
}


module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  //  console.log(deleteListing);
  req.flash("success", "Listing Deleted!")
  res.redirect("/listings");
}