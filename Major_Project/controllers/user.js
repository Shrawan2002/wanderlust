const passport = require("passport");
const User = require("../models/user");



module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup");
}

// signup 
module.exports.signup = async (req,res)=>{
  try{
    let{username, email, password} = req.body;

    // check if user already  exists
    const existingUser = await User.findOne({ email });
    if(existingUser){
      return res.status(400).json({ message: "Email already registered. Please log in." });
    }
    //Create and register the user
    let newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);

    req.login(registeredUser,(err)=>{
      if(err){
        console.error("Login after signup failed:", err);
        return res.status(500).json({ message: "Login after signup failed. Please log in manually." });
      }
      res.status(201).json({ message: "Signup successful",user: registeredUser });
    })

  }catch(err){
    console.error("Signup error:", err);
    return res.status(500).json({
      message: err.message || "Internal server error during signup."
    }) 
  }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

// login
module.exports.login = async(req, res, next)=>{
  passport.authenticate("local",(err, user, info)=>{
    if(err) return res.status(500).json({message: "Internal server error"});

    if(!user){
      return res.status(400).json({ 
        message: info?.message || "Invalid email or password",
      })
    }

    req.login(user, (err)=>{
      if(err) return res.status(500).json({ message: "Login failed. Try again." });
      console.log(user);
      return res.status(200).json({
        message: "Login successful",
        user:{
          id: user._id,
          username: user.username,
          email: user.email,
        },

      })
    }) 
  })(req,res, next);
    // req.flash("success", "welcome back to Wanderlust!");
    // let redirect = res.locals.redirectUrl || "/listings"
    // res.redirect(redirect);
}

module.exports.logout =  (req, res, next)=>{
  req.logOut((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success", "you are logged out! ");
    res.redirect("/listings");
  })
}


module.exports.curLoggedIn = (req, res)=>{
  if(!req.isAuthenticated() || !req.user){
    return res.status(401).json({ user: null });
  }
  res.status(200).json({ user: req.user });
}