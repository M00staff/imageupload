import { useState, useEffect } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import './App.css';

const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      id
      title
      url
    }
  }
`

const SEARCH_POSTS = gql`
  query searchPosts ($searchTerm: String) {
    searchPosts(term: $searchTerm) {
      id
      title
      url
    }
  }
`

const ADD_POST = gql`
  mutation Post ($post: String!, $url: String!) {
    post(title: $post, url: $url) {
      title
      url
    }
  }
`


function App() {
  const [searchInput, setSearchInput] = useState('');
  const [postList, setPostsList] = useState([]);
  const [searchList, setSearchList] = useState([]);

  const [addPost] = useMutation(ADD_POST);
  const { data: { getPosts } = [] } = useQuery(GET_POSTS);
  const { data: { searchPosts } = [] } = useQuery(SEARCH_POSTS, {
    variables: { searchTerm: searchInput }
  })

  useEffect(() => {
    setPostsList(getPosts)
  }, [getPosts, postList])

  const handleSearch = event => {
    event.preventDefault();
    setSearchList(searchPosts)
  }

  const showUploadWidget = () => {
    window.cloudinary.openUploadWidget({
      cloudName: "dihd0dyzm",
      uploadPreset: "zzcjm34d",
      sources: [
        "local"
      ],
      showAdvancedOptions: false,
      cropping: false,
      multiple: false,
      defaultSource: "local",
      styles: {
        palette: {
          window: "#ffffff",
          sourceBg: "#f4f4f5",
          windowBorder: "#90a0b3",
          tabIcon: "#000000",
          inactiveTabIcon: "#555a5f",
          menuIcons: "#555a5f",
          link: "#0433ff",
          action: "#339933",
          inProgress: "#0433ff",
          complete: "#339933",
          error: "#cc0000",
          textDark: "#000000",
          textLight: "#fcfffd"
        },
        fonts: {
          default: null,
          "sans-serif": {
            url: null,
            active: true
          }
        }
      }
    },
      (err, info) => {
        if (!err) {
          if (info.event === "success") {
            addPost({ variables: { post: info.info.original_filename, url: info.info.url } });
          }
          if (info.event === "close") {
            window.location.reload();
          }
          console.log("Upload Widget event - ", info);
        }
      });
  }

  return (
    <div className="App">

      <div className="headingWrapper">
        <form onSubmit={handleSearch}>
            <input
            onChange={e => (setSearchInput(e.target.value))}
            placeholder="Search Images"
          />
        </form>
        <button onClick={showUploadWidget}>UPLOAD</button>
      </div>

      <div className="searchResults">
        {searchList?.length > 0
          ? searchList.map(x => (
            <div key={x.id}>
              <span>{x.title}</span>
              <img src={x.url} alt={x.title} width="250" height="250" />
            </div>
          ))
          : "No Results"
        }
      </div>

      <div>
        <div className="titleWrapper">
          <h2>{postList?.length} Images</h2>
        </div>
        <div className="postList">
          {postList?.length > 0 && postList.map(x => (
            <div key={x.id}>
              <span>{x.title}</span>
              <img src={x.url} alt={x.title} width="250" height="250" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default App;
