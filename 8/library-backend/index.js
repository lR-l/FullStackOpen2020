require("dotenv").config();
const { ApolloServer, gql, RenameRootFields, UserInputError, AuthenticationError, ApolloError, PubSub } = require("apollo-server");
const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const pubsub = new PubSub();

const typeDefs = gql`
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
    allGenres: [String!]!
  }

  type Mutation {
    addBook(title: String!, published: Int!, author: ID!, genres: [String!]!): Book
    addAuthor(name: String!, born: Int): Author
    editAuthor(id: ID!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }

  type Subscription {
    bookAdded: Book!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }
`;

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author && args.genre) {
        const authors = await Author.find({ name: { $regex: new RegExp(`${args.author}`, "i") } });
        const authorsFilter = authors.map((author) => author._id);
        const books = await Book.find({ author: { $in: authorsFilter }, genres: { $in: args.genre } })
          .populate("author", { name: 1 })
          .sort({ author: -1 });
        return books;
      } else if (args.author) {
        const authors = await Author.find({ name: { $regex: new RegExp(`${args.author}`, "i") } });
        const authorsFilter = authors.map((author) => author._id);
        return Book.find({ author: { $in: authorsFilter } })
          .populate("author", { name: 1 })
          .sort({ author: -1 });
      } else if (args.genre) {
        return Book.find({ genres: { $in: args.genre } }).populate("author", { name: 1 });
      } else {
        return Book.find({}).populate("author", { name: 1 });
      }
    },
    allAuthors: (root, args) => {
      return Author.find({});
    },
    me: (root, args, { currentUser }) => {
      return currentUser;
    },
    allGenres: (root, args) => {
      return Book.distinct("genres");
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new AuthenticationError("Not authenticated");
      }

      try {
        const book = new Book({ ...args });

        const addedBook = await book.save();
        const bookCount = await Book.find({ author: args.author }).countDocuments();
        await Author.findOneAndUpdate({ _id: args.author }, { bookCount: bookCount }, { new: true });
        const populatedBook = await Book.populate(addedBook, { path: "author", select: { name: 1, bookCount: 1 } }); //Model populate

        pubsub.publish("BOOK_ADDED", { bookAdded: populatedBook });
        return populatedBook;
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args });
      }

      //return await addedBook.populate("author", { name: 1 }).execPopulate(); //Document populate
    },
    addAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("Not authenticated");
      }

      try {
        const author = new Author({ ...args });
        await author.save();
        return author;
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args });
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("Not authenticated");
      }

      try {
        const updateAuthor = await Author.findOneAndUpdate({ _id: args.id }, { born: args.setBornTo }, { new: true });
        if (!updateAuthor) {
          return null;
        } else {
          return updateAuthor;
        }
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args });
      }
    },
    createUser: async (root, args) => {
      try {
        const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre });
        await user.save();
        return user;
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args });
      }
    },
    login: async (root, args) => {
      try {
        const user = await User.findOne({ username: args.username });
        if (!user || args.password !== "nope.exe@0x12f23b") {
          throw { code: "NOT_FOUND_ERROR", message: "Wrong credentials" };
        }

        return { value: jwt.sign({ username: user.username, id: user._id }, process.env.TOKEN_SECRET) };
      } catch (error) {
        if (error.code && error.code === "NOT_FOUND_ERROR") {
          throw new ApolloError(error.message, error.code);
        } else {
          throw new UserInputError(error.message, { invalidArgs: args });
        }
      }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => {
        console.log("Client subscribed to Book added");
        return pubsub.asyncIterator(["BOOK_ADDED"]);
      },
    },
  },
  /* Author bookCount subquery from books
  Author: {
    bookCount: (root, args, context, info) => {
      Book.find({ author: root.id }).countDocuments();
    },
  },
  */
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const authorization = req ? req.headers.authorization : null;
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(authorization.substring(7), process.env.TOKEN_SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
});

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => console.error(error));

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`);
  console.log(`Subscription ready at ${subscriptionsUrl}`);
});
