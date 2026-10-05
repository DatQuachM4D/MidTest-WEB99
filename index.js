const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user.route');
const postRouter = require('./routes/post.route');

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/midtest-web99';

const app = express();
app.use(express.json());

app.use('/users', userRouter);
app.use('/posts', postRouter);

app.use((req, res) => {
    res.status(404).send({ message: 'Không tìm thấy API' });
});

// Bắt lỗi JSON body sai định dạng và các lỗi không mong muốn
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).send({ message: 'Body không đúng định dạng JSON' });
    }
    res.status(500).send({ message: err.message || 'Lỗi server' });
});

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('Kết nối MongoDB thành công');
        app.listen(PORT, () => console.log(`Server đang chạy tại http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error('Kết nối MongoDB thất bại:', err.message);
        process.exit(1);
    });
