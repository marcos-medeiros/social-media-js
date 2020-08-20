const { GraphQLObjectType, GraphQLString } = require('graphql');
const bcrypt = require('bcryptjs');
const UserType = require('./types/user');
const PostType = require('./types/post');
const ChatType = require('./types/chat');
const LikeType = require('./types/like');
const SessionType = require('./types/session');
const CommentType = require('./types/comment');
const MessageType = require('./types/message');
const FriendshipType = require('./types/friendship');
const User = require('../models/user');
const Post = require('../models/post');
const Chat = require('../models/chat');
const Like = require('../models/like');
const Session = require('../models/session');
const Comment = require('../models/comment');
const Message = require('../models/message');
const Friendship = require('../models/friendship');

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        createUser: {
            type: UserType,
            args: {
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parent, args) {
                bcrypt.hash(args.password, 10, (err, hashedPassword) => {
                    // if err, do something
                    if (err) err;
                    // otherwise, store hashedPassword in DB]
                    return new User({
                        firstName: args.firstName,
                        lastName: args.lastName,
                        email: args.email,
                        password: hashedPassword
                    }).save();
                });
            }
        },
        createPost: {
            type: PostType,
            args: {
                content: { type: GraphQLString },
                user: { type: GraphQLString }
            },
            resolve(parent, args) {
                return new Post({
                    content: args.content,
                    user: args.user
                }).save();
            }
        },
        deletePost: {
            type: PostType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parent, args) {
                Post.findByIdAndDelete(args.id);
                return;
            }
        },
        createLike: {
            type: LikeType,
            args: {
                post: { type: GraphQLString },
                user: { type: GraphQLString }
            },
            resolve(parent, args) {
                return new Like({
                    post: args.post,
                    user: args.user
                }).save();
            }
        },
        deleteLike: {
            type: LikeType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                Like.findByIdAndDelete(args.id);
                return;
            }
        },
        createComment: {
            type: CommentType,
            args: {
                content: { type: GraphQLString },
                user: { type: GraphQLString },
                post: { type: GraphQLString }
            },
            resolve(parent, args) {
                return new Comment({
                    content: args.content,
                    user: args.user,
                    post: args.post
                }).save();
            }
        },
        deleteComment: {
            type: CommentType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                Comment.findByIdAndDelete(args.id);
                return;
            }
        },
        createFriendRequest: {
            type: FriendshipType,
            args: {
                sender: { type: GraphQLString },
                receiver: { type: GraphQLString }
            },
            resolve(parent, args) {
                return new Friendship({
                    sender: args.sender,
                    receiver: args.receiver
                }).save();
            }
        },
        deleteFriendRequest: {
            type: FriendshipType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                Friendship.findByIdAndDelete(args.id);
                return;
            }
        },
        declineFriendRequest: {
            type: FriendshipType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parent, args) {
                Friendship.findByIdAndDelete(args.id);
                return;
            }
        },
        acceptFriendRequest: {
            type: FriendshipType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Friendship.findByIdAndUpdate(args.id, { status: true });
            }
        },
        createChat: {
            type: ChatType,
            args: {
                user: { type: GraphQLString },
                friend: { type: GraphQLString }
            },
            resolve(parent, args) {
                return new Chat({
                    user: args.user,
                    friend: args.friend
                }).save();
            }
        },
        createMessage: {
            type: MessageType,
            args: {
                user: { type: GraphQLString },
                chat: { type: GraphQLString },
                content: { type: GraphQLString }
            },
            resolve(parent, args) {
                return new Message({
                    user: args.user,
                    chat: args.chat,
                    content: args.content
                }).save();
            }
        },
        createSession: {
            type: SessionType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parent, args) {
                // check if user email and password are correct
                User.findOne({ email: args.email }, (err, user) => {
                    if (err) err;
                    if (!user) ({ error: "Incorrect email" });
                    bcrypt.compare(args.password, user.password, (err, res) => {
                        if (res) {
                            // passwords match! log user in
                            return new Session({ user: user.id }).save();
                        } else {
                            // passwords do not match!
                            return { msg: "Incorrect password" };
                        }
                    });
                });
            }
        },
        deleteSession: {
            type: SessionType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                Session.findByIdAndDelete(args.id);
                return;
            }
        }
    })
});

module.exports = Mutation;