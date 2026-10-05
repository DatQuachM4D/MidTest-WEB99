const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // Lưu mật khẩu đã được mã hoá bằng bcrypt
    password: { type: String, required: true },
    // apiKey hiện tại của người dùng, thay đổi sau mỗi lần đăng nhập
    apiKey: { type: String, default: null }
});

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;
