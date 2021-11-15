import React, { useState, useEffect } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import LoginForm from './components/LoginForm';
import NewBook from './components/NewBook';
import { useApolloClient, useLazyQuery } from '@apollo/client';
import Recommendations from './components/Recommendations';
import { USER } from './queries';

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null;
  }

  return <div style={{ color: 'red' }}>{errorMessage}</div>;
};

const App = () => {
  const [page, setPage] = useState('authors');
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [getUser, userResult] = useLazyQuery(USER, {
    variables: { token },
  });
  const client = useApolloClient();

  useEffect(() => {
    const localToken = window.localStorage.getItem('libraryapp-user-token');
    if (localToken) {
      setToken(localToken);
      getUser();
    }

    if (userResult.called && !userResult.loading) {
      setUser(userResult.data.me);
    }
  }, [token, userResult.loading]); // eslint-disable-line

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
    client.resetStore();
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {user ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button
              onClick={() => {
                setPage('recommendations');
              }}
            >
              recommendations
            </button>

            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Notify errorMessage={errorMessage} />

      <Authors show={page === 'authors'} auth={token} />

      <Books show={page === 'books'} />

      <Recommendations show={page === 'recommendations'} user={user} />

      <NewBook show={page === 'add'} setError={notify} />

      <LoginForm
        show={page === 'login'}
        setError={notify}
        setToken={setToken}
        setPage={setPage}
      />
    </div>
  );
};

export default App;
