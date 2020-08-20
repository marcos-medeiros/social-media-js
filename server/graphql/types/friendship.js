const { GraphQLObjectType, GraphQLString, GraphQLBoolean } = require('graphql');
const UserType = require('./user');
const User = require('../../models/user');

const FriendshipType = new GraphQLObjectType({
    name: 'Friendship',
    fields: () => ({
        id: { type: GraphQLString },
        sender: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.sender);
            }
        },
        receiver: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.receiver);
            }
        },
        status: { type: GraphQLBoolean }
    })
});

module.exports = FriendshipType;