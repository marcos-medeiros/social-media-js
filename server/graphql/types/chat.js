const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
const MessageType = require('./message');
const Message = require('../../models/message');


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

module.exports = ChatType;