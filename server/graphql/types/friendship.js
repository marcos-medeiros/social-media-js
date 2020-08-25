const { GraphQLString, GraphQLObjectType, GraphQLBoolean } = require('graphql');
const User = require('../../models/user');
const { UserType } = require('./user');

const FriendshipType = new GraphQLObjectType({
    name: 'Friendship',
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
        },
        status: { type: GraphQLBoolean }
    })
});

exports.FriendshipType = FriendshipType;