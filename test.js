fetch("http://localhost:3029/api/auth/login", {
  method: "POST",
  headers: {"Content-Type":"application/json"},
  body: JSON.stringify({username:"admin", password:"bad"})
}).then(res => console.log(res.status))
