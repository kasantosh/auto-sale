const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        required: [true, 'Please enter a valid email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'admin'], 
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'], 
        minlength: [8, 'Password has to be at least 8 characters'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function(el) {
               return el === this.password 
            },
            message: 'Passwords are not the same!'
        }
    },
    passwordChangedAt: {
        type: Date,
        select: false
    }
    });

// Hashing passwords
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    // hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;

    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < changedTimestamp;
    }
    
    return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;