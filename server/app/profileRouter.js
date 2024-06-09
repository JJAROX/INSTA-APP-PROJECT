import getRequestData from "./getRequestedData.js";
import tokensController from "./tokenController.js";
import usersController from "./userController.js";
import fileController from "./fileController.js";
const profilesRouter = async (req, res) => {
  console.log('Profiles Router method: ' + req.method + req.url)
  if (req.method == "GET" && req.url == "/api/profile") {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      let token = req.headers.authorization.split(" ")[1]
      console.log(token)
      let decoded = tokensController.verifyToken(token, res);
      if (decoded !== undefined) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ username: decoded.name, lastname: decoded.lastName, email: decoded.email }));
      }
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: "Niepoprawny token" }));
    }
  }
  else if (req.method == "PATCH" && req.url == "/api/profile") {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      let token = req.headers.authorization.split(" ")[1]
      console.log(token)
      console.log();
      let decoded = tokensController.verifyToken(token, res)
      if (decoded !== undefined) {
        let data = await getRequestData(req);
        console.log(data);
        if ((data.name == '' && data.lastname == '') || (data.name == undefined && data.lastname == undefined)) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: "Podaj chociaż jedną wartość do zmiany" }));
        } else {
          usersController.UPDATE_DATA(decoded, data, res)
        }
      }
    }
    else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: "Niepoprawny token" }));
    }
  }
  else if (req.method == "POST" && req.url == "/api/profile") {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      let token = req.headers.authorization.split(" ")[1]
      console.log(token)
      console.log('essa');
      let decoded = tokensController.verifyToken(token, res)
      if (decoded !== undefined) {
        fileController.POST_PROFILE_IMAGE(decoded, req, res)
      }
    }
    else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: "Niepoprawny token" }));
    }
  }
  else if (req.method == "GET" && req.url == "/api/logout") {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      let token = req.headers.authorization.split(" ")[1]
      console.log(token)
      console.log();
      let decoded = tokensController.verifyToken(token, res)
      if (decoded !== undefined) {

      }
    }
    else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: "Niepoprawny token" }));
    }
  }
  else if (req.method == "GET" && req.url == '/api/profile/picture') {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      let token = req.headers.authorization.split(" ")[1]
      console.log(token)
      let decoded = tokensController.verifyToken(token, res)
      if (decoded !== undefined) {
        console.log('essa');
        fileController.GET_PROFILE_PICTURE(req, res, decoded)
      }
    }
    else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: "Niepoprawny token" }));
    }
  }
}


export default profilesRouter