const mongoose = require('mongoose');
const Post = require("../models/post");
const User = require("../models/user");
const Comment = require('../models/comment');
const successHandle = require("../service/successHandle");
const appError = require('../service/appError')


const posts = {
    async getPosts(req, res, next) {
        /** 
        * #swagger.tags = ['Posts-動態貼文']
        * #swagger.description = '取得所有貼文'
        */

        //時間排序
        const timeSort = req.query.timeSort === 'asc' ? 'createAt' : '-createdAt'
        //關鍵字搜尋
        const q = req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {}
        const dtos = await Post.find(q)
            .populate({
                path: 'user',
                select: 'name photo'
            })
            .populate({
                path: 'comments',
                select: 'comment user'
            })
            .sort(timeSort);
        successHandle(res, dtos);
    },
    async getPost(req, res, next) {
        /** 
        * #swagger.tags = ['Posts-動態貼文']
        * #swagger.description = '取得單一貼文'
        */
        const postID = req.params.postID;

        if (postID === undefined || !mongoose.isValidObjectId(postID)) {
            const message = 'ID格式錯誤';
            return next(appError(400, message));
        }

        const dto = await Post.findById(postID);

        if (dto !== null) {
            successHandle(res, dto);
        } else {
            const message = '沒有此 ID';
            return next(appError(400, message));
        }
    },
    async getPostsByUserID(req, res, next) {
        /** 
        * #swagger.tags = ['Posts-動態貼文']
        * #swagger.description = '取得個人所有貼文列表'
        */
        const data = req.body;
        //驗證資料
        if (!req.user) {
            return next(appError(400, '請先登入會員'));
        }

        //驗證會員
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(appError(400, '會員資料不存在'));
        }

        //時間排序
        const timeSort = req.query.timeSort === 'asc' ? 'createAt' : '-createdAt'

        const dtos = await Post.find({ user: req.user.id })
            .populate({
                path: 'user',
                select: 'name photo'
            })
            .populate({
                path: 'comments',
                select: 'comment user'
            })
            .sort(timeSort);
        successHandle(res, dtos);
    },
    async createPost(req, res, next) {
        /** 
        * #swagger.tags = ['Posts-動態貼文']
        * #swagger.description = '新增貼文'
        */
        const data = req.body

        //驗證資料
        if (!req.user) {
            return next(appError(400, '請先登入會員'));
        } else if (data.content == undefined) {
            return next(appError(400, '請填寫貼文內容'));
        }
        //驗證會員
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(appError(400, '會員資料不存在'));
        }

        const newPost = await Post.create({
            user: req.user.id || '6624c98b3825a53f4d8a5506',
            image: data.image,
            content: data.content.trim(),
            type: data.type,
            tags: data.tags
        });
        successHandle(res, newPost);
    },
    async updatePost(req, res, next) {
        /** 
        * #swagger.tags = ['Posts-動態貼文']
        * #swagger.description = '更新一則貼文'
        */
        const { image, content, type, tags } = req.body;
        const postID = req.params.postID;

        if (postID === undefined || !mongoose.isValidObjectId(postID)) {
            const message = 'ID格式錯誤';
            return next(appError(400, message));
        }

        const dto = await Post.findById(postID);

        if (dto === null) {
            const message = '貼文ID不存在';
            return next(appError(400, message));
        }

        if (content === undefined) {
            const message = '欄位沒有正確';
            return next(appError(400, message));
        }

        const updatedFields = {
            name: dto.name,
            image: image,
            content: content.trim(),
            type: type,
            tags: tags
        };

        await Post.findByIdAndUpdate(postID, updatedFields, { runValidators: true });
        const updatedPost = await Post.findById(postID);
        successHandle(res, updatedPost);
    },
    async deletePost(req, res, next) {
        /** 
        * #swagger.tags = ['Posts-動態貼文']
        * #swagger.description = '刪除一則貼文'
        */
        const postID = req.params.postID;

        if (postID === undefined || !mongoose.isValidObjectId(postID)) {
            const message = 'ID格式錯誤';
            return next(appError(400, message));
        }

        const dto = await Post.findByIdAndDelete(postID);
        if (dto === null) {
            const message = '查無此 ID';
            return next(appError(400, message));
        }
        successHandle(res, dto);
    },
    async deletePosts(req, res, next) {
        /** 
        * #swagger.tags = ['Posts-動態貼文']
        * #swagger.description = '刪除所有貼文'
        */

        //DELETE 刪除單筆資料時，若未填寫 ID 路由為 "/posts/” 時，會刪除所有貼文，為了避免前端錯誤操作導致刪除所有資料，建議可利用 req.originalUrl 判斷路由是否為 "/posts/” 進行錯誤處理
        if (req.originalUrl !== '/posts') {
            const message = '查無此 ID';
            return next(appError(400, message));
        }
        const dto = await Post.deleteMany({});
        successHandle(res, dto);
    },
    async createComment(req, res, next) {
        /** 
        * #swagger.tags = ['Posts-動態貼文']
        * #swagger.description = '新增一則貼文的留言'
        */

        const data = req.body;
        const postID = req.params.postID;

        //驗證資料
        if (!req.user) {
            return next(appError(400, '請先登入會員'));
        } else if (data.comment == undefined) {
            return next(appError(400, '請填寫留言內容'));
        } else if (postID == undefined || !mongoose.isValidObjectId(postID)) {
            return next(appError(400, '貼文ID不存在'));
        }

        //驗證會員
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(appError(400, '會員資料不存在'));
        }

        //驗證貼文
        const post = await Post.findById(postID);
        if (!post) {
            return next(appError(400, '貼文ID不存在'));
        }

        const newComment = await Comment.create({
            user: req.user.id || '6624c98b3825a53f4d8a5506',
            post: postID,
            comment: data.comment.trim()
        });
        successHandle(res, newComment);
    },
    async createLike(req, res, next) {
        /** 
        * #swagger.tags = ['Posts-動態貼文']
        * #swagger.description = '新增一則貼文的讚'
        */

        const postID = req.params.postID;

        //驗證資料
        if (!req.user) {
            return next(appError(400, '請先登入會員'));
        } else if (postID == undefined || !mongoose.isValidObjectId(postID)) {
            return next(appError(400, '貼文ID不存在'));
        }

        //驗證會員
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(appError(400, '會員資料不存在'));
        }

        //驗證貼文
        const post = await Post.findById(postID);
        if (!post) {
            return next(appError(400, '貼文ID不存在'));
        }

        // 驗證是否已經按過讚
        if (post.likes.includes(req.user.id)) {
            return next(appError(400, '您已經對該貼文按過讚'));
        }
        //更新貼文
        await Post.findByIdAndUpdate(postID,
            {
                $push: { likes: req.user.id },
            },
            {
                runValidators: true,
                new: true,
            });

        const updatedPost = await Post.findById(postID);
        successHandle(res, updatedPost);
    },
    async deleteLike(req, res, next) {
        /** 
        * #swagger.tags = ['Posts-動態貼文']
        * #swagger.description = '取消一則貼文的讚'
        */
       
        const data = req.body;
        const postID = req.params.postID;

        //驗證資料
        if (!req.user) {
            return next(appError(400, '請先登入會員'));
        } else if (postID == undefined || !mongoose.isValidObjectId(postID)) {
            return next(appError(400, '貼文ID不存在'));
        }

        //驗證會員
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(appError(400, '會員資料不存在'));
        }

        //驗證貼文
        const post = await Post.findById(postID);
        if (!post) {
            return next(appError(400, '貼文ID不存在'));
        }

        // 驗證是否尚未按過讚
        if (!post.likes.includes(req.user.id)) {
            return next(appError(400, '您尚未對該貼文按過讚'));
        }

        //更新貼文
        await Post.findByIdAndUpdate(postID,
            {
                $pull: { likes: req.user.id },
            },
            {
                runValidators: true,
                new: true,
            });

        const updatedPost = await Post.findById(postID);
        successHandle(res, updatedPost);
    },
};

module.exports = posts;
