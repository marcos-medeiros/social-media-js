const { GraphQLObjectType, GraphQLString } = require('graphql');
const moment = require('moment');
const User = require('../../models/session');
const { UserType } = require('./user');

const SessionType = new GraphQLObjectType({
    name: 'Session',
    fields: () => ({
        id: { type: GraphQLString },
        user: {
            type: UserType,
            resolve({ user }) {
                return User.findById(user);
            }
        },
        createdAt: {
            type: GraphQLString,
            resolve({ createdAt }) {
                return moment(createdAt).format('MMM Do YYYY');
            }
        }
    })
});

exports.SessionType = SessionType;