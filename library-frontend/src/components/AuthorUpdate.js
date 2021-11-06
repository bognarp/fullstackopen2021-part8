import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { UPDATE_AUTHOR_BIRTH, ALL_AUTHORS } from '../queries';

const AuthorUpdate = ({ authors }) => {
  const [name, setName] = useState(authors[0].name);
  const [birthyear, setBirthYear] = useState('');

  const [updateAuthorBirth] = useMutation(UPDATE_AUTHOR_BIRTH, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const updateAuthor = async (event) => {
    event.preventDefault();

    updateAuthorBirth({
      variables: { name, setBornTo: parseInt(birthyear) },
    });

    setName(authors[0].name);
    setBirthYear('');
  };

  return (
    <>
      <h3>Set birthyear</h3>
      <form onSubmit={updateAuthor}>
        <div>
          name
          <select
            value={name}
            onChange={({ target }) => {
              setName(target.value);
            }}
          >
            {authors.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born
          <input
            type="number"
            value={birthyear}
            onChange={({ target }) => {
              setBirthYear(target.value);
            }}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </>
  );
};

export default AuthorUpdate;
