const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const phoneNumberSchema = new mongoose.Schema({
   primaryNumber: {
      type: [String],
   },
   secondaryNumber: {
      type: [String],
   },
});

const adressSchema = new mongoose.Schema({
   city: {
      type: String,
      default: "",
   },
   country: {
      type: String,
      default: "",
   },
   state: {
      type: String,
      default: "",
   },
   from: {
      type: String,
      default: "",
   },
   street: String,
});

const UserSchema = new mongoose.Schema(
   {
      username: {
         type: String,
         require: true,
         trim: true,
         min: 3,
         max: 20,
         unique: true,
         required: true,
         lowercase: true,
      },

      firstName: {
         type: String,
         require: true,
         trim: true,
         min: 2,
         max: 10,
         required: true,
         lowercase: true,
      },
      lastName: {
         type: String,
         require: true,
         trim: true,
         min: 2,
         max: 10,
         required: true,
         lowercase: true,
      },
      displayName: {
         type: String,
         require: true,
         trim: true,
         min: 3,
         max: 20,
         required: true,
      },

      email: {
         type: String,
         required: true,
         trim: true,
         unique: true,
         max: 50,
      },
      password: {
         type: String,
         required: true,
         min: 6,
      },
      age: {
         type: Number,
      },
      profilePicture: {
         type: String,
         default: "",
      },
      coverPicture: {
         type: String,
         default: "",
      },
      role: {
         type: String,
         enum: [
            "user",
            "page",
            "celebrity",
            "owner",
            "artist",
            "admin",
         ],
         default: "user",
      },
      online: {
         type: Boolean,
      },
      followers: {
         type: Array,
         default: [],
      },
      followings: {
         type: Array,
         default: [],
      },
      about: {
         type: String,
         max: 50,
      },
      links: {
         type: Object,
         trim: true,
      },
      saves: {
         type: [String],
      },
      relationship: {
         type: Number,
         enum: [1, 2, 3],
      },
      phoneNumber: phoneNumberSchema,
      adress: adressSchema,
   },
   { timestamps: true }
);

// followers: {
//    type: mongoose.SchemaTypes.ObjectId,
//    default: [],
//    ref: "User",
// },
// followings: {
//    type: mongoose.SchemaTypes.ObjectId,
//    default: [],
//    ref: "User",
// },

// HASHING PASSWORD
UserSchema.pre("save", async function () {
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
});

// CREATE JSON WEB TOKEN
UserSchema.methods.createJWT = function () {
   return jwt.sign(
      { userId: this._id, username: this.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME }
   );
};

// CREATE JSON WEB TOKEN
UserSchema.methods.createJWT = function () {
   return jwt.sign(
      { userId: this._id, username: this.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME }
   );
};

// COMPARE PASSWORD
UserSchema.methods.comparePassword = async function (password) {
   const isMatch = await bcrypt.compare(password, this.password);
   return isMatch;
};

module.exports = mongoose.model("Users", UserSchema);
