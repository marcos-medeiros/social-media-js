const { GraphQLList, GraphQLObjectType, GraphQLString } = require('graphql');
const PostType = require('./post');
const Friendship = require('../../models/friendship');
const User = require('../../models/user');
const Post = require('../../models/post');

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

module.exports = UserType;