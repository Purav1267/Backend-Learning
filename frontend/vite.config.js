import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api':'http://localhost:3000'
      // this whole proxy thing is only done for the CORS 
      // for not getting that error


      // see text.txt file for better understanding

      // this is a concept of proxy in which we get to know that 
      // this makes a key value pair in the server object and in which 
      // this yeh sabse pehle dhoondta hai /api ko axios mai and then 
      // uske aage append kar deta hai yeh http://localhost ko and 
      // then proxy server bhi hamesha yeh hi sochta hai ke request aaye 
      // hai server se so communication hamesha server se he ho rha hai 
      // with the help of vite , or any service or cloud hosting also 
      // isse baat seedha server se hoti hai   



      // 2 advantage hai 
      // 1 - append ho jayega axios req se pehle 
      // 2 - usko lagega sab log same origin se req kar rhe hai 
      // information ke
    }
  },
  plugins: [react()],
})
