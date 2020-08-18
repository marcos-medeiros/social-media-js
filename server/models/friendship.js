const { Schema, model } = require('mongoose');

const friendshipSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    receiver: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    status: { type: Schema.Types.Boolean, required: true, default: false },
    createdAt: { type: Schema.Types.Date, required: true, default: Date() }
});

module.exports = model('Friendship', friendshipSchema);