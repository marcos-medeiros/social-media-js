// graphql types
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLSchema,
    GraphQLBoolean
} = require('graphql');
// package to format dates
const moment = require('moment');
// package to encrypt and compare encrypted data
const bcrypt = require('bcryptjs');
// models
const User = require('../models/user');
const Post = require('../models/post');
const Chat = require('../models/chat');
const Like = require('../models/like');
const Session = require('../models/session');
const Comment = require('../models/comment');
const Message = require('../models/message');
const Friendship = require('../models/friendship');


// TYPES

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        name: { type: GraphQLString },
        friends: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                let friendsIds = Friendship.find({ sender: parent.id, status: true }).map(f => f.receiver)
                    .concat(Friendship.find({ receiver: parent.id, status: true }).map(f => f.sender))

                let friends = [];

                for (let i = 0; i < friendsIds.length; i++) {
                    friends.push(User.findById(friendsIds[i]));
                }

                return friends;
            }

        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({ user: parent.id });
            }
        },
    })
});

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

const FriendshipType = new GraphQLObjectType({
    name: 'Friendship',
    fields: () => ({
        id: { type: GraphQLString },
        sender: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.sender);
            }
        },
        receiver: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.receiver);
            }
        },
        status: { type: GraphQLBoolean }
    })
});

const ChatType = new GraphQLObjectType({
    name: 'Chat',
    fields: () => ({
        id: { type: GraphQLString },
        messages: {
            type: new GraphQLList(MessageType),
            resolve(parent, args) {
                return Message.find({ chat: parent.id });
            }
        }
    })
});

const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: () => ({
        id: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.user);
            }
        },
        createdAt: {
            type: GraphQLString,
            resolve(parent, args) {
                return moment(Message.findById(parent.id).createdAt).format("MMM Do YYYY");
            }
        },
        content: { type: GraphQLString }
    })
});

const SessionType = new GraphQLObjectType({
    name: 'Session',
    fields: () => ({
        id: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.user);
            }
        }
    })
});

// QUERIES

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
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

// MUTATIONS

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

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});