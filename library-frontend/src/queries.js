import { gql } from '@apollo/client';

export const ALL_AUTHORS = gql`
  query allAuthors {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`;

export const ALL_BOOKS = gql`
  query getBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      published
      author {
        name
      }
      id
      genres
    }
  }
`;

export const USER = gql`
  query getCurrentUser($token: String) {
    me(token: $token) {
      username
      favoriteGenre
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation createNewBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      published
      genres
      id
    }
  }
`;

export const UPDATE_AUTHOR_BIRTH = gql`
  mutation updateAuthorBirth($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      bookCount
      id
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;
