const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
    content: { type: Schema.Types.String, required: true, maxlength: 255 },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    post: {type: Schema.Types.ObjectId, required: true, ref: 'Post'},
    createdAt: { type: Schema.Types.Date, required: true, default: Date() }
});

module.exports = model('Comment', commentSchema);