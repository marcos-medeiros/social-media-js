const { GraphQLObjectType, GraphQLString } = require('graphql');
const moment = require('moment');
const UserType = require('./user');
const User = require('../../models/user');
const Message = require('../../models/message');

const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: () => ({
        id: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.user);
            }
        },
        createdAt: {
            type: GraphQLString,
            resolve(parent, args) {
                return moment(Message.findById(parent.id).createdAt).format("MMM Do YYYY");
            }
        },
        content: { type: GraphQLString }
    })
});

module.exports = MessageType;