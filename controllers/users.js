const bcrypt = require('bcryptjs');
const appError = require('../service/appError');
const successHandle = require("../service/successHandle");
const validator = require('validator');
const User = require('../models/user');
const Post = require("../models/post");
const { isAuth, generateSendJWT } = require('../service/auth');

const users = {
    async sign_up(req, res, next) {
        /** 
         * #swagger.tags = ['Users-會員功能']
         * #swagger.description = '註冊會員'
        **/
        let { email, password, confirmPassword, name } = req.body;
        // 內容不可為空
        if (!email || !password || !confirmPassword || !name) {
            return next(appError(400, "欄位未填寫正確！", next));
        }
        // 密碼正確
        if (password !== confirmPassword) {
            return next(appError(400, "密碼不一致！", next));
        }
        // 密碼 8 碼以上
        if (!validator.isLength(password, { min: 8 })) {
            return next(appError(400, "密碼字數低於 8 碼", next));
        }
        // 是否為 Email
        if (!validator.isEmail(email)) {
            return next(appError(400, "Email 格式不正確", next));
        }

        // 驗證Email是否已存在
        const dto = await User.findOne({ email });

        if (dto) {
            return next(appError(400, 'Email已被使用', next));
        }

        // 加密密碼
        password = await bcrypt.hash(req.body.password, 12);
        // 物件
        const newUser = await User.create({
            email,
            password,
            name
        });
        generateSendJWT(newUser, 201, res);
    },
    async sign_in(req, res, next) {
        /** 
        * #swagger.tags = ['Users-會員功能']
        * #swagger.description = '登入會員'
        **/
        const { email, password } = req.body;
        if (!email || !password) {
            return next(appError(400, '帳號密碼不可為空', next));
        }

        // 檢查信箱格式
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            return next(appError(400, 'Email格式不正確', next));
        }

        const user = await User.findOne({ email }).select('+password');
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return next(appError(400, '您的密碼不正確', next));
        }
        generateSendJWT(user, 200, res);
    },
    async updatePassword(req, res, next) {
        /** 
            * #swagger.tags = ['Users-會員功能']
            * #swagger.description = '重設密碼'
          **/
        const { password, confirmPassword } = req.body;

        if (!password || !confirmPassword) {
            return next(appError(400, '密碼不可為空', next));
        }

        if (password !== confirmPassword) {
            return next(appError(400, "密碼不一致！", next));
        }

        // 密碼 8 碼以上
        if (!validator.isLength(password, { min: 8 })) {
            return next(appError(400, "密碼字數低於 8 碼", next));
        }

        //加密
        newPassword = await bcrypt.hash(password, 12);

        const user = await User.findByIdAndUpdate(req.user.id, {
            password: newPassword
        });

        generateSendJWT(user, 200, res)
    },
    async getProfile(req, res, next) {
        /** 
            * #swagger.tags = ['Users-會員功能']
            * #swagger.description = '取得個人資料'
          **/
        res.status(200).json({
            status: 'success',
            user: req.user
        });
    },
    async updateProfile(req, res, next) {
        /** 
            * #swagger.tags = ['Users-會員功能']
            * #swagger.description = '更新個人資料'
        **/
        const { name, sex, photo } = req.body;
        // 內容不可為空
        if (!name || !sex || !photo) {
            return next(appError(400, "欄位未填寫正確！", next));
        }

        const user = await User.findByIdAndUpdate(req.user.id, {
            name: name,
            sex: sex,
            photo: photo
        });

        const updatedUser = await User.findById(req.user.id);
        successHandle(res, updatedUser);
    },
    async createFollow(req, res, next) {
        /** 
            * #swagger.tags = ['Users-會員追蹤']
            * #swagger.description = '追蹤朋友'
          **/
        const userID = req.user.id;
        const followID = req.params.id;

        if (userID === followID) {
            return next(appError(401, '您無法追蹤自己', next));
        }
        await User.updateOne(
            {
                _id: userID,
                'following.user': { $ne: followID }
            },
            {
                $addToSet: { following: { user: followID } }
            }
        );
        await User.updateOne(
            {
                _id: followID,
                'followers.user': { $ne: userID }
            },
            {
                $addToSet: { followers: { user: userID } }
            }
        );

        successHandle(res, "您已成功追蹤！");
    },
    async deleteFollow(req, res, next) {
        /** 
            * #swagger.tags = ['Users-會員追蹤']
            * #swagger.description = '取消追蹤'
          **/
        const userID = req.user.id;
        const followID = req.params.id;

        if (userID === followID) {
            return next(appError(400, '您無法取消追蹤自己', next));
        }
        await User.updateOne(
            {
                _id: userID,
            },
            {
                $pull: { following: { user: followID } }
            }
        );
        await User.updateOne(
            {
                _id: followID,
            },
            {
                $pull: { followers: { user: userID } }
            }
        );

        successHandle(res, "您已成功取消追蹤 !");
    },
    async getFollowing(req, res, next) {
        /** 
        * #swagger.tags = ['Users-會員追蹤']
        * #swagger.description = '取得個人追蹤名單'
        **/
        const userID = req.user.id;
        const dtos = await User.findById(userID).populate({
            path: 'following.user',
            select: 'name', 
        });

        successHandle(res, dtos);
    },
    async getLikeList(req, res, next) {
        /** 
        * #swagger.tags = ['Users-會員其他']
        * #swagger.description = '取得個人按讚列表'
        **/
        const userID = req.user.id;
        const dtos = await Post.find({
            likes: { $in: [userID] }
        }).populate({
            path: "user",
            select: "name _id"
        });
        successHandle(res, dtos);
    }
}


module.exports = users;