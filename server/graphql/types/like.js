const { GraphQLObjectType, GraphQLString } = require('graphql');
const UserType = require('./user');
const PostType = require('./post');
const User = require('../../models/user');
const Post = require('../../models/post');


const LikeType = new GraphQLObjectType({
    name: 'Like',
    fields: () => ({
        id: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.user);
            }
        },
        post: {
            type: PostType,
            resolve(parent, args) {
                return Post.findById(parent.post);
            }
        }
    })
});

module.exports = LikeType;