import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [jokes, setJokes] = useState([])

  useEffect(()=>{
    axios.get('/api/jokes').then((response)=>{
      setJokes(response.data)
    })
    .catch((error)=>{
      console.log(error);
    })
  })
  return (
    
    <>
      <h1>Purav Malik - Chai Aur Code</h1>
      <p>JOKES: {jokes.length}</p>

      {
        jokes.map((joke,index)=>
          
          <div key={joke.id}>
            <h3>{joke.title}</h3>
            <p>{joke.content}</p>
          </div>
          // here i learend about map like if we doesn't want to return 
          // something then we just have to make sure we use either () 
          // bracket or no bracket
          // like mainly in frontend we dont return we just have to write 
          // like this

          // this is same with filter too
        )
      }
    
    </>
  )
}

export default App
