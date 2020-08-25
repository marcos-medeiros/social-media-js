const { GraphQLObjectType, GraphQLString } = require('graphql');
const moment = require('moment');
const User = require('../../models/user');
const { UserType } = require('./user');

const CommentType = new GraphQLObjectType({
    name: 'Comment',
    fields: () => ({
        id: { type: GraphQLString },
        content: { type: GraphQLString },
        createdAt: {
            type: GraphQLString,
            resolve({ createdAt }) {
                return moment(createdAt).format("MMM Do YYYY");
            }
        },
        user: {
            type: UserType,
            resolve({ user }) {
                return User.findById(user);
            }
        }
    })
});

exports.CommentType = CommentType;