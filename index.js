require('dotenv').config()
console.log("PURAV - Chai aur Code");

const express = require('express')
const app = express()
// const port = 4000

const githubData = {
    "login": "Purav1267",
    "id": 92824980,
    "node_id": "U_kgDOBYhllA",
    "avatar_url": "https://avatars.githubusercontent.com/u/92824980?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/Purav1267",
    "html_url": "https://github.com/Purav1267",
    "followers_url": "https://api.github.com/users/Purav1267/followers",
    "following_url": "https://api.github.com/users/Purav1267/following{/other_user}",
    "gists_url": "https://api.github.com/users/Purav1267/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/Purav1267/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/Purav1267/subscriptions",
    "organizations_url": "https://api.github.com/users/Purav1267/orgs",
    "repos_url": "https://api.github.com/users/Purav1267/repos",
    "events_url": "https://api.github.com/users/Purav1267/events{/privacy}",
    "received_events_url": "https://api.github.com/users/Purav1267/received_events",
    "type": "User",
    "user_view_type": "public",
    "site_admin": false,
    "name": null,
    "company": null,
    "blog": "",
    "location": null,
    "email": null,
    "hireable": null,
    "bio": null,
    "twitter_username": null,
    "public_repos": 13,
    "public_gists": 0,
    "followers": 5,
    "following": 12,
    "created_at": "2021-10-19T20:12:52Z",
    "updated_at": "2025-09-11T01:26:11Z"
  }

app.get('/',(req,res)=>{
    res.send("Hello World")
})

app.get('/twitter',(req,res)=>{
    res.send("puravmalik24")
})

app.get('/login',(req,res)=>{
    res.send('<h1> Please login at chai aur code </h1>')
})

app.get('/youtube',(req,res)=>{
    res.send("<h2>ElectroRyzen</h2>")
})

app.get('/github',(req,res)=>{
    res.json(githubData)
})

app.listen(process.env.PORT,()=>{
    console.log(`Example app listening on port ${process.env.PORT}`);
})