const { Schema, model } = require('mongoose');
const { messageSchema } = require('./message');

const chatSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    friend: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    messages: [messageSchema],
    createdAt: { type: Schema.Types.Date, required: true, default: Date() },
});

module.exports = model('Chat', chatSchema);