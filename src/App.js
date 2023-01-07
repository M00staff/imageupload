import { useState, useEffect } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import './App.css';

const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      id
      title
    }
  }
`

const SEARCH_POSTS = gql`
  query searchPosts ($searchTerm: String) {
    searchPosts(term: $searchTerm) {
      id
      title
    }
  }
`

const ADD_POST = gql`
  mutation Post ($post: String!) {
    post(title: $post) {
      title
    }
  }
`


function App() {

  const [input, setInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [postList, setPostsList] = useState([]);
  const [searchList, setSearchList] = useState([]);

  const { data: { getPosts } = [] } = useQuery(GET_POSTS);
  const { data: { searchPosts } = [] } = useQuery(SEARCH_POSTS, {
    variables: { searchTerm: searchInput }
  })
  const [addPost] = useMutation(ADD_POST);

  useEffect(() => {
    setPostsList(getPosts)
  }, [getPosts, postList])

  const handleSubmit = event => {
    addPost({ variables: { post: input } });
  }

  const handleSearch = event => {
    event.preventDefault();
    setSearchList(searchPosts)
  }

  return (
    <div className="App">
      <h1>Add image</h1>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            <p>Add Post</p>
            <input
              onChange={e => (setInput(e.target.value))}
              onSubmit={e => handleSubmit(input)}
            />
          </label>
        </fieldset>
        <button type="submit">Submit</button>
      </form>
      {postList?.length && postList.map(x => (
        <div key={x.id}>
          <span>{x.id}</span>
          <span>{x.title}</span>
        </div>
      ))
      }
      <h1>Search Images</h1>
      <form onSubmit={handleSearch}>
        <fieldset>
          <label>
            <p>Search</p>
            <input
              onChange={e => (setSearchInput(e.target.value))}
              onSubmit={e => handleSearch(input)}
            />
          </label>
        </fieldset>
        <button type="submit">Search</button>
      </form>
      {searchList?.length > 0 && searchList.map(x => (
        <div key={x.id}>
          <span>{x.title}</span>
        </div>
      ))
      }
    </div>
  );
}

export default App;
