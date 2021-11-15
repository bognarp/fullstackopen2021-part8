import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';

const Books = (props) => {
  const [genre, setGenre] = useState('');
  const [getBooks, bookResults] = useLazyQuery(ALL_BOOKS);

  const allGenres = (books) => {
    const genres = books.map((book) => book.genres).flat();
    return [...new Set(genres)];
  };

  useEffect(() => {
    if (genre) {
      getBooks({ variables: { genre } });
    } else {
      getBooks();
    }
  }, [genre, getBooks]);

  if (!props.show) {
    return null;
  }

  if (bookResults.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {bookResults.data.allBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Filter by genres</h3>
      {allGenres(bookResults.data.allBooks).map((genre) => (
        <button
          value={genre}
          key={genre}
          onClick={({ target }) => setGenre(target.value)}
        >
          {genre}
        </button>
      ))}
      <br />
      {genre ? (
        <button onClick={() => setGenre('')}>remove filter</button>
      ) : null}
    </div>
  );
};

export default Books;
