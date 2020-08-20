const { GraphQLObjectType, GraphQLString } = require('graphql');
const moment = require('moment');
const UserType = require('./user');
const User = require('../../models/user');
const Comment = require('../../models/comment');

const CommentType = new GraphQLObjectType({
    name: 'Comment',
    fields: () => ({
        id: { type: GraphQLString },
        content: { type: GraphQLString },
        createdAt: {
            type: GraphQLString,
            resolve(parent, args) {
                return moment(Comment.findById(parent.id).createdAt).format("MMM Do YYYY");
            }
        },
        updatedAt: {
            type: GraphQLString,
            resolve(parent, args) {
                return moment(Comment.findById(parent.id).updatedAt).format("MMM Do YYYY");
            }
        },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.user);
            }
        }
    })
});

module.exports = CommentType;