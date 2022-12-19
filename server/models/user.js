import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: String,
    email: {type: String, unique: true},
    password: String,
})

export const User = mongoose.model('user', userSchema);