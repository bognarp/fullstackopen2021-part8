import { useLazyQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { ALL_BOOKS } from '../queries';

const Recommendations = (props) => {
  const [getBooks, booksResult] = useLazyQuery(ALL_BOOKS);

  useEffect(() => {
    if (props.user) {
      getBooks({ variables: { genre: props.user.favoriteGenre } });
    } else {
      getBooks();
    }
  }, [props.user]); // eslint-disable-line

  if (!props.show) {
    return null;
  }

  if (booksResult.loading) {
    return <p>loading...</p>;
  }

  return (
    <div>
      <h1>Book recommendations</h1>
      <p>books in your favourite genre</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksResult.data.allBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
