import { useState, useRef, useCallback } from 'react'
import reactLogo from './assets/react.svg'
import useBookSearch from './useBookSearch';
import './App.css'

function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    books,
    loading,
    error,
    hasMore
  } = useBookSearch(query, pageNumber, isSubmitted, setIsSubmitted);

  const observer = useRef();
  const lastBookElementRef = useCallback((node) => {
    if (loading) 
      return;

    if (observer.current)
      observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore)
        setPageNumber((prevPageNumber) => (prevPageNumber + 1));
    });

    if (node)
      observer.current.observe(node);
  }, [loading, hasMore]);

  function handleSearch() {
    setPageNumber(1);
    setIsSubmitted(true);
  }

  return (
    <div className="App">
      <div className='container'>
        <input type='text' placeholder="Enter book's name here..." value={query} onChange={(e) => setQuery(e.target.value)}></input>
        <button onClick={handleSearch}>
          <svg width="20px" height="20px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.027 9.92L16 13.95 14 16l-4.075-3.976A6.465 6.465 0 0 1 6.5 13C2.91 13 0 10.083 0 6.5 0 2.91 2.917 0 6.5 0 10.09 0 13 2.917 13 6.5a6.463 6.463 0 0 1-.973 3.42zM1.997 6.452c0 2.48 2.014 4.5 4.5 4.5 2.48 0 4.5-2.015 4.5-4.5 0-2.48-2.015-4.5-4.5-4.5-2.48 0-4.5 2.014-4.5 4.5z" fillRule="evenodd"/>
          </svg>
        </button>
      </div>
      {books.length > 0 ? 
      <>
        <h1 style={{fontSize: '2rem', marginTop: '20px'}}>Results</h1>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author(s)</th>
              <th className='right'>Average Rating</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => {
              if (books.length === index + 1) {
                return (
                  <tr ref={lastBookElementRef}>
                    <td>
                      {book.title}
                    </td>
                    <td>
                      {book.author}
                    </td>
                    <td className='right'>
                      {book.rating}
                    </td>
                  </tr>
                );
              }

              return (<tr>
                <td>
                  {book.title}
                </td>
                <td>
                  {book.author}
                </td>
                <td className='right'>
                  {book.rating}
                </td>
              </tr>);
              }
            )}
          </tbody>
      </table>
      </> : <></>
      }
      <div style={{marginTop: '20px'}}>{loading && 'Loading...'}</div>
      <div>{error && 'Error...'}</div>
    </div>
  )
}

export default App
