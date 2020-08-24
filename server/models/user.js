const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    firstName: { type: Schema.Types.String, required: true, maxlength: 100 },
    lastName: { type: Schema.Types.String, required: true, maxlength: 100 },
    email: { type: Schema.Types.String, required: true, maxlength: 100 },
    password: { type: Schema.Types.String, required: true, maxlength: 100 },
    createdAt: { type: Schema.Types.Date, required: true, default: Date.now }
});

userSchema
    .virtual('name')
    .get(function () {
        return this.firstName + ' ' + this.lastName;
    });

module.exports = model('User', userSchema);