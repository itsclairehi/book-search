const { User } = require('../models')
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {

    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                return userData
            }
            throw new AuthenticationError('Not logged in')
        },
        
        allUser: async () => {
            const users = await User.find({})
            return users
        }
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Incorrect credentials')
            }
            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials')
            }

            const token = signToken(user)
            return { token, user };
        },

        createUser: async (parent, args) => {
            const user = await User.create(args)
            const token = signToken(user)

            return { token, user };
        },

        saveBook: async (parent, args, context) => {
            //check if there's context, which means jwt has been validated, which means user is logged in
            if (context.user) {

                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    {$addToSet: {savedBooks: args.input}},
                    { new: true, runValidators: true }
                )

                return updatedUser
            }
            throw new AuthenticationError("you need to be logged in")
        },

        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: {bookId: bookId} } },
                    { new: true }
                )


                return updatedUser
            }
            throw new AuthenticationError("you need to be logged in")
        }
    }

}

module.exports = resolvers;