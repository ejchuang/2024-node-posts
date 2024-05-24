const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, "貼文內容必填"]
    },
    image: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now,//確保每筆資料時間不同
        select: false //保護起來不讓前台看到
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, '貼文ID必填']
    },
    likes: {
        type: [mongoose.Schema.ObjectId],
        ref: 'user',
        default: [], // 一對多(欄位)
    },
    type: {
        type: String,
        enum: ['travel', 'music', 'food', 'friend', 'group'],
        required: true
    },
    tags: {
        type: [String]
    }
}, {
    versionKey: false,
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps: true
});

//虛擬欄位
postSchema.virtual('comments', {
    ref: 'Comment',
    foreignField: 'post',
    localField: '_id',
  });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;