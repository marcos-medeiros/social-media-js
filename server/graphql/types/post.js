const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
const moment = require('moment');
const User = require('../../models/user');
const Comment = require('../../models/comment');
const Like = require('../../models/like');
const { UserType } = require('./user');
const { CommentType } = require('./comment');
const { LikeType } = require('./like');

const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: { type: GraphQLString },
        content: { type: GraphQLString },
        createdAt: {
            type: GraphQLString,
            resolve({ createdAt }) {
                return moment(createdAt).format('MMM Do YYYY');
            }
        },
        user: {
            type: UserType,
            resolve({ user }) {
                return User.findById(user);
            }
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve({ id }) {
                return Comment.find({ post: id });
            }
        },
        likes: {
            type: new GraphQLList(LikeType),
            resolve({ id }) {
                return Like.find({ post: id });
            }
        }
    })
});

exports.PostType = PostType;