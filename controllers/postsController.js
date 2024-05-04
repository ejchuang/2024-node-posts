const Post = require("../models/post");
const errorHandle = require("../service/errorHandle");
const successHandle = require("../service/successHandle");

const postController = {
    //取得一筆貼文
    async getPost(req, res) {
        try {
            const id = req.params.id;
            const dto = await Post.findById(id);

            if (dto !== null) {
                successHandle(res, dto);
            } else {
                const message = '沒有此 ID';
                errorHandle(res, message);
            }
        } catch (error) {
            errorHandle(res, error.message);
        }
    },
    //取得全部貼文
    async getAllPosts(req, res) {
        try {
            const dtos = await Post.find();
            successHandle(res, dtos);
        } catch (error) {
            errorHandle(res, error.message);
        }
    },
    //新增一筆貼文
    async createPost(req, res) {
        try {
            const data = req.body;
            if (data.content.trim() !== undefined) {
                const newPost = await Post.create({
                    name: data.name.trim(),
                    image: data.image,
                    content: data.content.trim(),
                    likes: data.likes,
                    comments: data.comments,
                    type: data.type,
                    tag: data.tag
                });
                successHandle(res, newPost);
            } else {
                const message = "欄位沒有正確，或沒有此 ID";
                errorHandle(res, message);
            }
        } catch (error) {
            errorHandle(res, error.message);
        }
    },
    //更新一筆貼文
    async updatePost(req, res) {
        try {
            const data = req.body;
            const id = req.params.id;
            const dto = await Post.findById(id);

            if (data.content.trim() !== undefined && dto !== null) {
                await Post.findByIdAndUpdate(id, {
                    name: data.name.trim(),
                    image: data.image,
                    content: data.content.trim(),
                    likes: data.likes,
                    comments: data.comments,
                    type: data.type,
                    tag: data.tag
                }, { runValidators: true });//致愷助教建議
                const newPost = await Post.findById(id);
                successHandle(res, newPost);
            } else {
                const message = '欄位沒有正確，或沒有此 ID';
                errorHandle(res, message);
            }
        } catch (error) {
            errorHandle(res, error.message);
        }
    },
    //刪除一筆貼文
    async deletePost(req, res) {
        try {
            const id = req.params.id;
            const dto = await Post.findByIdAndDelete(id);
            if (dto !== null) {
                successHandle(res, dto);
            } else {
                const message = '查無此 ID';
                errorHandle(res, message);
            }
        } catch (error) {
            errorHandle(res, error.message);
        }
    },
    //刪除全部貼文
    async deleteAllPosts(req, res) {
        try {
            const dto = await Post.deleteMany({});
            successHandle(res, dto);
        } catch (error) {
            errorHandle(res, error.message);
        }
    }
};

module.exports = postController;
