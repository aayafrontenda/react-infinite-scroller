import { useEffect, useState } from 'react'
import axios from 'axios'

export const useBookSearch = (query, pageNumber, isSubmitted, setIsSubmitted) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  useEffect(() => {
    setBooks([]);
  }, [isSubmitted]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: 'GET',
      url: 'https://openlibrary.org/search.json',
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken(c => (cancel = c))
    })
    .then((res) => {
      setBooks((prevBooks) => {
        // return [...new Set([...prevBooks, res.data.docs.map(book => book.title)])]; // only unique titles
        return prevBooks.concat(res.data.docs.map(book => {
          return {
            title: book.title, 
            author: (book.author_name !== undefined ? book.author_name.join(', ') : '(not defined yet)'),
            rating: (book.ratings_average === undefined ? '(not defined yet)' : book.ratings_average)
          }
        }));
      // from array to set, then vice versa from set to array using spread operator
      })
      setHasMore(res.data.docs.length > 0);
      setLoading(false);
    })
    .catch((error) => {
      if (axios.isCancel(error))
        return;

      setError(true);
    });
    setIsSubmitted(false);
    return () => cancel();
  }, [isSubmitted, pageNumber]);

  return { loading, error, books, hasMore }; 
}

export default useBookSearch
