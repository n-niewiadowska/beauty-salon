const mongoose = require("mongoose");
require("mongoose-type-email");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { token } = require("../server");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Your name is required"]
  },
  surname: {
    type: String,
    required: [true, "Your surname is required"]
  },
  email: {
    type: mongoose.SchemaTypes.Email, 
    required: [true, "Your e-mail is required"],
    unique: [true, "User with this e-mail already exists"]
  },
  nickname: {
    type: String,
    match: [/[a-zA-Z0-9]+/, "Your nickname can only contain letters and numbers."],
    required: [true, "Your nickname is required"],
    unique: [true, "User with this nickname already exists"]
  },
  password: {
    type: String,
    minLength: [8, "Password must be 8-16 characters long"],
    maxLength: [16, "Password must be 8-16 characters long"],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+.<>-]).{8,16}$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character."],
    required: [true, "Password is required"]
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  }
});

UserSchema.pre("save", function(next) {
  const user = this;

  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, (saltError, salt) => {
      if (saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(user.password, salt, (hashError, hash) => {
          if (hashError) {
            return next(hashError);
          }

          user.password = hash;
          next();
        });
      }
    });
  } else {
    return next();
  }
});

UserSchema.methods.generateAccessJWT = function() {
  return jwt.sign({ 
    id: this._id, 
    name: this.name, 
    surname: this.surname, 
    nickname: this.nickname, 
    email: this.email, 
    role: this.role 
  }, token, { expiresIn: "1h" });
};

module.exports = mongoose.model("User", UserSchema);