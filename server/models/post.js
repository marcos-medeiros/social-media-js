const { Schema, model } = require('mongoose');

const postSchema = new Schema({
    content: { type: Schema.Types.String, required: true, maxlength: 255 },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    createdAt: { type: Schema.Types.Date, required: true, default: Date() },
    updatedAt: { type: Schema.Types.Date }
});

module.exports = model('Post', postSchema);