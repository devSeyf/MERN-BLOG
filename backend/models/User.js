const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false } 
}, { timestamps: true });
userSchema.pre('save', async function() {
    // Only hash if password is new or modified
    if (!this.isModified('password')) return;
    // Hash password with salt rounds of 10
    this.password = await bcrypt.hash(this.password, 10);
});
module.exports = mongoose.model('User', userSchema);
