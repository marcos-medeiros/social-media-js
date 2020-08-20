const { Schema, model } = require('mongoose');

const sessionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    createdAt: { type: Schema.Types.Date, required: true, default: Date() },
});

module.exports = model('Session', sessionSchema);