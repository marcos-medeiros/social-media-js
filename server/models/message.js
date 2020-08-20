const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    chat: { type: Schema.Types.ObjectId, required: true, ref: 'Chat' },
    content: { type: Schema.Types.String, required: true, maxlength: 255 },
    createdAt: { type: Schema.Types.Date, required: true, default: Date() },
});

module.exports = model('Message', messageSchema);