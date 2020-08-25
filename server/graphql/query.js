const { GraphQLString, GraphQLObjectType, GraphQLList } = require('graphql');
const async = require('async');
const User = require('../models/user');
const Post = require('../models/post');
const Friendship = require('../models/friendship');
const { UserType } = require('./types/user');
const { PostType } = require('./types/post');
const { FriendshipType } = require('./types/friendship');

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(root, args) {
                return User.findById(args.id);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve() {
                return User.find({});
            }
        },
        post: {
            type: PostType,
            args: { id: { type: GraphQLString } },
            resolve(root, args) {
                return Post.findById(args.id);
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve() {
                return Post.find({});
            }
        },
        sentRequests: {
            type: new GraphQLList(FriendshipType),
            args: { id: { type: GraphQLString } },
            resolve(root, args) {
                return Friendship.find({ user: args.id, status: false });
            }

        },
        pendingRequests: {
            type: new GraphQLList(FriendshipType),
            args: { id: { type: GraphQLString } },
            resolve(root, args) {
                return Friendship.find({ friend: args.id, status: false });
            }
        },
        friends: {
            type: new GraphQLList(FriendshipType),
            args: { id: { type: GraphQLString } },
            resolve(root, args) {
                return Friendship.find({user: args.id, status: true});
            }
        }
    })
});

exports.query = Query;