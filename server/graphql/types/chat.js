const { GraphQLObjectType, GraphQLString } = require('graphql');
const User = require('../../models/user');
const { UserType } = require('./user');

const ChatType = new GraphQLObjectType({
    name: 'Chat',
    fields: () => ({
        id: { type: GraphQLString },
        user: {
            type: UserType,
            resolve({ user }) {
                return User.findById(user);
            }
        },
        friend: {
            type: UserType,
            resolve({ friend }) {
                return User.findById(friend);
            }
        }
    })
});

exports.ChatType = ChatType;