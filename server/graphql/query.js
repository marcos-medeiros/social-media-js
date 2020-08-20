const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
const UserType = require('./types/user');
const PostType = require('./types/post');
const ChatType = require('./types/chat');
const FriendshipType = require('./types/friendship');
const User = require('../models/user');
const Post = require('../models/post');
const Chat = require('../models/chat');
const Friendship = require('../models/friendship');

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                return User.findById(args.id);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({});
            }
        },
        post: {
            type: PostType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                return Post.findById(args.id);
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({});
            }
        },
        chat: {
            type: ChatType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                return Chat.findById(args.id);
            }
        },
        friendRequests: {
            type: new GraphQLList(FriendshipType),
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                return Friendship.find({ sender: args.id, status: false })
                    .concat(Friendship.find({ receiver: args.id, status: false }))
            }
        }
    })
});

module.exports = Query;