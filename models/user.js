const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, '請輸入您的暱稱'],
        minlength: [2, '暱稱至少需要2個字元以上'],
        maxlength: [20, '暱稱不能超過20個字元']
    },
    password: {
        type: String,
        required: [true, '請輸入您的密碼'],
        minlength: [8, '密碼至少需要8碼以上'],
        select: false,
        validate: {
            validator: function (value) {
                return /(?=.*[A-Za-z])(?=.*\d)/.test(value);
            },
            message: '密碼至少需要8碼以上，並中英混合'
        }
    },
    email: {
        type: String,
        required: [true, '請輸入您的Email'],
        unique: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: '請輸入有效的Email'
        }
    },
    photo: {
        type: String
    },
    sex: {
        type: String,
        enum: ["male", "female"]
    }

}, { versionKey: false });

const User = mongoose.model('user', userSchema);

module.exports = User;
