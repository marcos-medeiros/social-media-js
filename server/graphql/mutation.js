const { GraphQLObjectType, GraphQLString } = require('graphql');
const User = require('../models/user');
const { UserType } = require('./types/user');

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
                    // otherwise, store hashedPassword in DB
                    return new User({
                        firstName: args.firstName,
                        lastName: args.lastName,
                        email: args.email,
                        password: hashedPassword
                    }).save();
                });
            }
        },
    })
});

exports.mutation = Mutation;