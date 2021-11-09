const { ApolloServer, gql, UserInputError } = require('apollo-server');
const { v1: uuid } = require('uuid');
const mongoose = require('mongoose');
const config = require('./utils/config');
const Book = require('./models/book');
const Author = require('./models/author');

console.log('connecting to ... ', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB: ', error.message);
  });

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      // let response = books;
      // if (args.author) {
      //   response = response.filter((b) => b.author === args.author);
      // }
      // if (args.genre) {
      //   response = response.filter((b) => {
      //     return b.genres.includes(args.genre);
      //   });
      // }
      if (args.genre) {
        return await Book.find({ genres: { $in: [args.genre] } });
      } else {
        return Book.find({});
      }
    },
    allAuthors: async () => Author.find({}),
  },

  Book: {
    author: async (root) => {
      return await Author.findById(root.author);
    },
  },

  Author: {
    bookCount: async (root) => {
      return await Book.count({ author: root });
    },
  },

  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author });

        try {
          await author.save();
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          });
        }
      }
      const book = new Book({ ...args, author });
      try {
        await book.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      return book;
    },

    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name });

      if (!author) {
        return null;
      }

      author.born = args.setBornTo;
      try {
        await author.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return author;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`ApolloServer ready at ${url}`);
});
