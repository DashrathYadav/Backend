const genSignature = require("../middleware/cloudinarySignature");
const userSchema = require("../schema/userSchema");
const jwt = require("jsonwebtoken");


//function to genetate response
function response(res, statusCode, msg, result) {
  return res.status(statusCode).send({ msg, result });
}

//function to genetate jwt token
const maxAge = 60 * 60;
function createJwtToken(id) {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: maxAge }); // 1hour
}

// login function
module.exports.register = async (req, res) => {
  try {
    const email = req.body.email;
    const name = req.body.name;

    console.log(req.body);

    let user = await userSchema.findOne({ email });

    if (!user) {
      const data = {
        email,
        name,
        recordings: [],
      };
      user = await userSchema.create(data);
    }

    const id = user._id.toString();
    console.log("id in string is", id);
    res.cookie("jwt", createJwtToken(id), {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    }); ///1 hour.

    res.cookie("id", user._id.toString(), {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    }); ///1 hour.

    return response(res, 200, "sign in successfully", user);
  } catch (err) {
    console.log(err);
    return response(res, 400, "failed to sign in", err);
  }
};

module.exports.startRecording = async (req, res) => {
  //cloudnary setup
  try {
    const { signature, timestamp } = genSignature("userId");
    console.log(signature, timestamp);
    const result = {
      signature,
      timestamp,
      userId: "userId",
      api_key: process.env.API_KEY,
      cloudinary_name: process.env.CLOUD_NAME,
    };
    return response(res, 200, "success signature generation", result);
  } catch (err) {
    console.log("error in start recording", err);
    return response(res, 400, "error in start Recording or signature", err);
  }
};

module.exports.saveVideoUrl = async (req, res) => {
  try {

    console.log("title",req.body.tite);
    console.log("Description",req.body.description);
    console.log("cloudinary url",req.body.cloudianryUrl);

    console.log(req.cookies);
    const id = req.cookies.id;
    if (!id) {
      throw Error("User not  found ,id absent ,login again");
    }

    const user = await userSchema.findById(id);

    if (!user) {
      throw Error("User not exist ,wrong id");
    }

    console.log("title",req.body.title);
    console.log("Description",req.body.description);
    console.log("cloudinary url",req.body.cloudianryUrl);
    const data = {
      createOn: new Date(),
      title: req.body.title || "Title",
      description: req.body.description || "Description",
      cloudianryUrl: req.body.cloudianryUrl || "url absent",
    };
    user.recordings.unshift(data);
    const result = await user.save();
    return response(res, 200, "recording saved successfully", result);
  } catch (err) {
    return response(res, 400, "failed to save recording url ", err);
  }
};
