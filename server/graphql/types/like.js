const { GraphQLObjectType, GraphQLString } = require('graphql');
const User = require('../../models/user');
const { UserType } = require('./user');

const LikeType = new GraphQLObjectType({
    name: 'Like',
    fields: () => ({
        id: { type: GraphQLString },
        user: {
            type: UserType,
            resolve({ user }) {
                return User.findById(user);
            }
        }
    })
});

exports.LikeType = LikeType;