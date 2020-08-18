const { Schema, model } = require('mongoose');

const likeSchema = new Schema({
    post: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    createdAt: { type: Schema.Types.Date, required: true, default: Date() }
});

module.exports = model('Like', likeSchema);