import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    },
    username: { // Added username field
        type: String,
        required: true,
        trim: true,
        unique: true, // Enforce uniqueness
    },
    avatar :{
        type : String, //cloud  
        required : false
    } ,
    password: {
        type: String,
        required: true,
        trim: true,
    }
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', UserSchema);

export default User;