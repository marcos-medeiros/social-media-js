const { GraphQLList, GraphQLObjectType, GraphQLString } = require('graphql');
const moment = require('moment');
const UserType = require('./user');
const CommentType = require('./comment');
const LikeType = require('./like');
const Post = require('../../models/post');
const Like = require('../../models/like');
const User = require('../../models/user');
const Comment = require('../../models/comment');

const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: { type: GraphQLString },
        content: { type: GraphQLString },
        createdAt: {
            type: GraphQLString,
            resolve(parent, args) {
                return moment(Post.findById(parent.id).createdAt).format("MMM Do YYYY");
            }
        },
        updatedAt: {
            type: GraphQLString,
            resolve(parent, args) {
                return moment(Post.findById(parent.id).updatedAt).format("MMM Do YYYY");
            }
        },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(Post.findById(parent.id).user);
            }
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve(parent, args) {
                return Comment.find({ post: parent.id });
            }
        },
        likes: {
            type: new GraphQLList(LikeType),
            resolve(parent, args) {
                return Like.find({ post: parent.id });
            }
        }
    })
});

module.exports = PostType;