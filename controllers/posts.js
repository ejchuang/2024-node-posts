const Post = require("../models/post");
const User = require("../models/user");
const errorHandle = require("../service/errorHandle");
const successHandle = require("../service/successHandle");
const appError = require('../service/appError')

const posts = {
    async getPost(req, res) {
        /** 
        * #swagger.tags = ['Posts-貼文']
        * #swagger.description = '取得一筆貼文'
        * */
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
    async getPosts(req, res) {
        /** 
        * #swagger.tags = ['Posts-貼文']
        * #swagger.description = '取得全部貼文'
        * 
        */
        try {
            //時間排序
            const timeSort = req.query.timeSort === 'asc' ? 'createAt' : '-createdAt'
            //關鍵字搜尋
            const q = req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {}
            const dtos = await Post.find(q).populate({
                path: 'user',
                select: 'name photo '
              }).sort(timeSort);
            successHandle(res, dtos);
        } catch (error) {
            errorHandle(res, error.message);
        }
    },
    async createPost(req, res) {
        /** 
        * #swagger.tags = ['Posts-貼文']
        * #swagger.description = '新增一筆貼文'
        * */
        try {
            const data = req.body;
            if (data.content !== undefined) {
                const newPost = await Post.create({
                    user: data.user || '6624c98b3825a53f4d8a5506',
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
    async updatePost(req, res) {
        /** 
        * #swagger.tags = ['Posts-貼文']
        * #swagger.description = '更新一筆貼文'
        * */
        try {
            const { image, content, likes, comments, type, tag } = req.body;
            const id = req.params.id;
            const dto = await Post.findById(id);
            console.log(content);

            if (dto === null) {
                const message = '沒有此 ID';
                return errorHandle(res, message);
            }

            if (content === undefined) {
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
    async deletePost(req, res) {
        /** 
        * #swagger.tags = ['Posts-貼文']
        * #swagger.description = '刪除一筆貼文'
        * */
        try {
            const id = req.params.id;
            if(id === undefined){
                const message = '請輸入正確ID';
                errorHandle(res, message);
            }
            const dto = await Post.findByIdAndDelete(id);
            if (dto === null) {
                const message = '查無此 ID';
                errorHandle(res, message);
            } 
            successHandle(res, dto);
        } catch (error) {
            errorHandle(res, error.message);
        }
    },
    async deletePosts(req, res) {
        /** 
        * #swagger.tags = ['Posts-貼文']
        * #swagger.description = '刪除全部貼文'
        * */
        //DELETE 刪除單筆資料時，若未填寫 ID 路由為 "/posts/” 時，會刪除所有貼文，為了避免前端錯誤操作導致刪除所有資料，建議可利用 req.originalUrl 判斷路由是否為 "/posts/” 進行錯誤處理
        try {
            if (req.originalUrl !== '/posts') {
                const message = '查無此 ID';
                errorHandle(res, message);
            }
            const dto = await Post.deleteMany({});
            successHandle(res, dto);
        } catch (error) {
            const message = '刪除全部貼文失敗';
            errorHandle(res, error.message);
        }
    }
};

module.exports = posts;
