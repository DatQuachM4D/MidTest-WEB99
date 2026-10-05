const express = require('express');
const { authentication } = require('../middlewares/auth.middleware');
const { createPost, updatePost } = require('../controller/post.controller');

const postRouter = express.Router();

postRouter.post('/', authentication, createPost);
postRouter.put('/:id', authentication, updatePost);

module.exports = postRouter;
