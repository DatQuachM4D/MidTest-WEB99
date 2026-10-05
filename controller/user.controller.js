const crypto = require('crypto');
const bcrypt = require('bcrypt');
const UserModel = require('../model/user.model');

const register = async (req, res) => {
    try {
        const { userName, email, password } = req.body || {};
        if (!userName) return res.status(400).send({ message: 'userName là bắt buộc' });
        if (!email) return res.status(400).send({ message: 'email là bắt buộc' });
        if (!password) return res.status(400).send({ message: 'password là bắt buộc' });

        const existedUser = await UserModel.findOne({ email });
        if (existedUser) {
            return res.status(409).send({ message: 'Email đã tồn tại' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({ userName, email, password: hashedPassword });

        res.status(201).send({
            message: 'Đăng ký thành công',
            data: { _id: newUser._id, userName: newUser.userName, email: newUser.email }
        });
    } catch (error) {
        // Trường hợp 2 request đăng ký cùng email đồng thời
        if (error.code === 11000) {
            return res.status(409).send({ message: 'Email đã tồn tại' });
        }
        res.status(500).send({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email) return res.status(400).send({ message: 'email là bắt buộc' });
        if (!password) return res.status(400).send({ message: 'password là bắt buộc' });

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).send({ message: 'Email hoặc mật khẩu không đúng' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // Mỗi lần đăng nhập sinh randomstring mới => apiKey cũ mất hiệu lực
        const randomString = crypto.randomUUID();
        const apiKey = `mern-$${user._id}$-$${user.email}$-$${randomString}$`;
        user.apiKey = apiKey;
        await user.save();

        res.status(200).send({ message: 'Đăng nhập thành công', apiKey });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

module.exports = { register, login };
