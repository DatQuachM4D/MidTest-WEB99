const mongoose = require('mongoose');
const UserModel = require('../model/user.model');

// apiKey có dạng: mern-$userId$-$email$-$randomstring$
const API_KEY_PATTERN = /^mern-\$([^$]+)\$-\$([^$]+)\$-\$([^$]+)\$$/;

const authentication = async (req, res, next) => {
    try {
        const { apiKey } = req.query;
        if (!apiKey) {
            return res.status(401).send({ message: 'Thiếu apiKey' });
        }

        const match = apiKey.match(API_KEY_PATTERN);
        if (!match) {
            return res.status(401).send({ message: 'apiKey không hợp lệ' });
        }

        const [, userId, email] = match;
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(401).send({ message: 'apiKey không hợp lệ' });
        }

        const user = await UserModel.findById(userId);
        // randomstring quyết định tính hợp lệ: apiKey phải trùng với apiKey mới nhất đã cấp
        if (!user || user.email !== email || user.apiKey !== apiKey) {
            return res.status(401).send({ message: 'apiKey không xác thực được' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

module.exports = { authentication };
