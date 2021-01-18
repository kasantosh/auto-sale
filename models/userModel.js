const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
    photo: {
        type: String,
        default: 'default.jpg'
    },
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
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
        },
    // autos: [
    //     {
    //         type: mongoose.Schema.ObjectId, 
    //         ref: 'Auto'
    //     }
    // ],
    // reviews: [
    //     {
    //         type: mongoose.Schema.ObjectId, 
    //         ref: 'Review'
    //     }
    // ],
    },
    {
        // To make visible all derived or calculated attribues/fields
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
    );

// Virtual populate
userSchema.virtual('autos', {
    ref: 'Auto',
    foreignField: 'user',
    localField: '_id'
  });

userSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'user',
    localField: '_id',
});

// Hashing passwords
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    // hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;

    next();
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function(next) {
    // this points to the current query (everything starting with 'find')
    this.find({ active: { $ne: false } });
    
    next();
});

// userSchema.pre(/^find/, function(next) {
//     this.populate({
//         path: 'autos'
//         }).populate({
//             path: 'reviews',
//         });
    
//         next();
// });


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

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    // console.log(resetToken);

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    return resetToken;

}

const User = mongoose.model('User', userSchema);

module.exports = User;