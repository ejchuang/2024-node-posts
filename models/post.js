const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"貼文姓名必填"]
    },
    image:String,
    content:{
        type:String,
        required:[true,"貼文內容必填"]
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: {
        type: Number,
        default: 0
    },
    createdAt:{
        type:Date,
        default:Date.now,
        select:false //保護起來不讓前台看到
    },
    type: {
        type: String,
        enum: ['travel','music','food','friend','group'],
        required: true
    },
    tags: {
        type: [String]
    }
},{
    versionKey:false
})

const Post = mongoose.model('Post',postSchema);

module.exports = Post;