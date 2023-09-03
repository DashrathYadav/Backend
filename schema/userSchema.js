const mongoose=require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    "Please fill a valid email address",
    ],
    },
    name: {
    type: String,
    required: true,
    },
    recordings: [ // array for keeping recent recording first.
    
    // [{currentdata},...recordings]
    
    {
    createOn: Date,
    title: String,
    description: String,
    cloudianryUrl: String, // link of uploaded video 
    },
    ],
    });

    module.exports= mongoose.model("users",userSchema);


