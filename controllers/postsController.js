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
            if (data.content !== undefined) {
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
            const { image, content, likes, comments, type, tag } = req.body;
            const id = req.params.id;
            const dto = await Post.findById(id);
            console.log(content);

            if (dto === null) {
                const message = '沒有此 ID';
                return errorHandle(res, message);
            }

            if (content == undefined) {
                const message = '欄位沒有正確';
                return errorHandle(res, message);
            }

            const updatedFields = {
                name: dto.name,
                image: image,
                content: content.trim(),
                likes: likes,
                comments: comments,
                type: type,
                tag: tag
            };

            await Post.findByIdAndUpdate(id, updatedFields, { runValidators: true });
            const updatedPost = await Post.findById(id);
            return successHandle(res, updatedPost);
        } catch (error) {
            return errorHandle(res, error.message);
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
