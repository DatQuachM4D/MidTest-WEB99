const mongoose = require('mongoose');
const PostModel = require('../model/post.model');

const createPost = async (req, res) => {
    try {
        const { userId, content } = req.body || {};
        if (!userId) return res.status(400).send({ message: 'userId là bắt buộc' });
        if (!content) return res.status(400).send({ message: 'content là bắt buộc' });

        // Chỉ được tạo bài post cho chính mình
        if (userId !== req.user._id.toString()) {
            return res.status(403).send({ message: 'userId không khớp với người dùng đã đăng nhập' });
        }

        const newPost = await PostModel.create({ userId, content });
        res.status(201).send({ message: 'Tạo bài post thành công', data: newPost });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body || {};

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send({ message: 'id bài post không hợp lệ' });
        }
        if (!content) return res.status(400).send({ message: 'content là bắt buộc' });

        const post = await PostModel.findById(id);
        if (!post) {
            return res.status(404).send({ message: 'Bài post không tồn tại' });
        }

        // Chỉ người tạo bài post mới được cập nhật
        if (post.userId !== req.user._id.toString()) {
            return res.status(403).send({ message: 'Bạn không có quyền cập nhật bài post này' });
        }

        post.content = content;
        await post.save(); // updatedAt tự động cập nhật

        res.status(200).send({ message: 'Cập nhật bài post thành công', data: post });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

module.exports = { createPost, updatePost };
