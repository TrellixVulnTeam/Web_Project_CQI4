const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { rejects } = require('assert');

const axios = require('axios');

const app = express();

const jwt = require('jsonwebtoken');
const { response } = require('express');

// Check environment variable
const PORT = /*process.env.PORT ||*/ 5001;

//  Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static('src'))
app.use(cors())

//  TODO: Remove node server ?
//  TODO: Remove node server ?
//  TODO: Remove node server ?
//  TODO: Remove node server ?


//  Listen on a port
/*let server =*/ app.listen(PORT, () => {
  console.log('Listening on port ' + PORT)
});

//!use cors to allow cross origin resource sharing
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// create a GET route
app.get('/backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

app.post('/register', (req, res) => {

  let reqData = JSON.parse(req.headers.data)

  let userEmail = reqData.email;
  let userUsername = reqData.username;
  let userPassword = reqData.password;

  RegisterUser(userEmail, userUsername, userPassword)
    .then((registerResponse) => {
      console.log(registerResponse);
      res.status(200).end(JSON.stringify(registerResponse))
    })
})

const RegisterUser = async (email, username, password) => {
  let registerResponse = await RequestRegisterFromWebapi(email, username, password);
  console.log(registerResponse)
  let userRegistered = registerResponse.data.Registered;
  let userExists = registerResponse.data.Exists;
  let loginData;

  if (userRegistered === true && userExists === false) {
    loginData = await LogInUser(email, password);
    loginData.registered = userRegistered;
    loginData.exists = userExists;
  }
  else {
    // ! Error registering the user
    console.log("Cannot register user");
  }

  console.log(loginData);


  return loginData;

  //  TODO: return the user data , if the use already exists and if the user is registered
}

const RequestRegisterFromWebapi = (username, email, password) => {
  //  Send login request to webapi
  return axios({
    hostname: 'localhost',
    port: 5000,
    url: 'http://localhost:5000/api/Parent/GetRegisterConfirmation',
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',

      //  Send the recived  user data to the webapi
      'username': username,
      'email': email,
      'password': password,
    }
  })
}

//  TODO: FINISH REGISTER AND LOGIN!!!!
app.post('/login', (req, res) => {
  let reqData = JSON.parse(req.headers.data)

  //  Log the user and return the login data as a response
  LogInUser(reqData.email, reqData.password)
    .then((loginResponse) => {
      console.log(loginResponse);
      res.status(200).end(JSON.stringify(loginResponse))
    })
})

/**
 * Calls login from webapi
 * Returns the login data (username, user id and the children of that user)
 */
const LogInUser = async (email, password) => {
  //  Log the user and return the login data as a response

  let apiResponse = await RequestLoginFromWebapi(email, password);

  //  User data from webapi
  let userInfo = apiResponse.data.UserInfo;
  let userAuthenticated = apiResponse.data.Authenticated;

  console.log(apiResponse);

  //  Token instance
  //TODO: change secret to .env variable
  const token = jwt.sign({}, "secret", {
    expiresIn: 300, // 5 Min
  })

  let loginData = {
    authorized: userAuthenticated,
    token: token,
    username: userInfo.username, // User information from server (just need username and id)
    userId: userInfo.id, // User information from server (just need username and id)
  }

  let apiResonse = await GetChildren(loginData.userId);

  loginData.children = apiResonse.data;
  return loginData;
}

const RequestLoginFromWebapi = (email, password) => {
  //  Send login request to webapi
  return axios({
    hostname: 'localhost',
    port: 5000,
    url: 'http://localhost:5000/api/Parent/GetLoginConfirmation',
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',

      //  Send the recived  user data to the webapi
      'email': email,
      'password': password,
    }
  })
}

const GetChildren = (parentId) => {
  //  Get the children from the webapi
  return axios({
    hostname: 'localhost',
    port: 5000,
    url: 'http://localhost:5000/api/Parent/GetChildrenForParent',
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',

      parentId: parentId
    }
  })
}

//  TODO: Clear console logs
const verifyJWT = (req, res, next) => {

  const token = req.headers["x-access-token"];//Grab token
  console.log(token);

  if (!token) {
    console.log("2")
    res.send("Need a token, gib pls UwU");
  }
  else {
    jwt.verify(token, "secret", (err, decoded) => {
      if (err) {
        console.log("3")

        res.json({ authorized: false, message: "Failed to authenticate" });
      }
      else {
        console.log("4")
        //  New variable userId, create a new one
        req.userId = decoded.id;
        next();
      }
    })
  }
}

app.get('/is-auth', verifyJWT, (req, res) => {
  console.log("OK")

  res.json({ isAuth: true }).status(200).end();
});

app.post('/add-child', (req, res) => {
  //  Axios request to webapi
  let status = 200;

  let reqData = JSON.parse(req.headers.data)
  //console.log(reqData);
  //console.log("Child name decoded: " + utf8.decode(reqData.childName))
  //console.log("Child name encoded: " + reqData.childName)

  //  Send login request to webapi
  axios({
    hostname: 'localhost',
    port: 5000,
    url: 'http://localhost:5000/api/Parent/GetAddChildConfirmation',
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',

      //  Send the recived  user data to the webapi
      'parentId': reqData.parentId,
      'childName': reqData.childName,
      'childAge': reqData.childAge,
    }
  }).catch((err) => {
    status = 400;
    console.log(err)
    //console.log("Can't connect to webapi")

  }).then((response) => {
    //console.log(response);


    //let authenticatedMessage = response.data;
    let responseMessage = response.data;

    //  End the request with bool, if the user is in the database 
    //  and the password and username match
    res.status(status).end(JSON.stringify(responseMessage));
  })
})

app.get('/get-children-for-parent', (req, res) => {
  let reqData = JSON.parse(req.headers.data)
  GetChildren(reqData)
    .then((response) => {
      res.status(200).end(JSON.stringify(response.data))
    })
});

app.get('/get-current-child-name', (req, res) => {
  let reqData = JSON.parse(req.headers.data)

  //  Get the children from the webapi
  axios({
    hostname: 'localhost',
    port: 5000,
    url: 'http://localhost:5000/api/Parent/GetCurrentChildName',
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',

      parentId: reqData
    }
  }).catch(err => console.log(err))
    .then((response) => {

      console.log(response.data);
      res.status(200).end(JSON.stringify(response.data))
    })
});

app.get('/delete-child', (req, res) => {
  let reqData = JSON.parse(req.headers.data)
  console.log(`Delete child ${reqData.childId} for parent ${reqData.parentId}`);
  axios({
    hostname: 'localhost',
    port: 5000,
    url: 'http://localhost:5000/api/Parent/GetDeleteChild',
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',

      childId: reqData.childId,
      parentId: reqData.parentId
    }
  }).catch(err => console.log(err))
    .then((response) => {
      //  Send children to client
      console.log("Deleting child...")
      console.log(response.data);
      res.status(200).end(JSON.stringify(response.data))
    })
})

app.post('/select-child', (req, res) => {
  let reqData = JSON.parse(req.headers.data);

  axios({
    hostname: 'localhost',
    port: 5000,
    url: 'http://localhost:5000/api/Parent/SelectChild',
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',

      childId: reqData.childId
    }
  })
    .catch(err => console.log(err))
    .then((response) => {
      console.log(`Switching selected child to ${response.data.IsSelected}`)
      res.status(200).end(JSON.stringify(response.data));
    })
})