const { GraphQLObjectType, GraphQLString } = require('graphql');
const UserType = require('./user');
const User = require('../../models/user');

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

module.exports = SessionType;