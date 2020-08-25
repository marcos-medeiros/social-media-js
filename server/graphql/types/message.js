const { GraphQLString, GraphQLObjectType } = require('graphql');
const User = require('../../models/user');
const Chat = require('../../models/chat');
const { UserType } = require('./user');
const { ChatType } = require('./chat');

const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: () => ({
        id: { type: GraphQLString },
        user: {
            type: UserType,
            resolve({ user }) {
                return User.findById(user);
            }
        },
        createdAt: {
            type: GraphQLString,
            resolve({ createdAt }) {
                return moment(createdAt).format("MMM Do YYYY");
            }
        },
        content: { type: GraphQLString },
        chat: {
            type: ChatType,
            resolve({ chat }) {
                return Chat.findById(chat);
            }
        }
    })
});

exports.MessageType = MessageType;