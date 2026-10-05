const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        content: { type: String, required: true }
    },
    // createdAt, updatedAt mặc định lấy thời gian khi tạo / cập nhật
    { timestamps: true }
);

const PostModel = mongoose.model('posts', postSchema);

module.exports = PostModel;
