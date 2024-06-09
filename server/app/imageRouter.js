import path from "path";
import fileController from "./fileController.js";
import jsonController from "./jsonController.js";
import tokensController from "./tokenController.js";
import photosJSON from './data/photos.json' assert { type: "json" };
const __dirname = path.resolve();

const router = async (req, res) => {
  console.log('Image Router method: ' + req.method + req.url)

  if (req.url === '/api/photos' && req.method == "POST") {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      let token = req.headers.authorization.split(" ")[1]
      console.log(token)
      console.log('essa');
      let decoded = tokensController.verifyToken(token, res)
      if (decoded !== undefined) {
        console.log('workin');
        console.log(req.url);
        fileController.POST(req, res, decoded)
      }
    }
    else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: "Niepoprawny token" }));
    }
  } else if (req.url === '/api/photos' && req.method == "GET") {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      let token = req.headers.authorization.split(" ")[1]
      console.log(token)
      console.log('essa');
      let decoded = tokensController.verifyToken(token, res)
      if (decoded !== undefined) {
        console.log('workin');
        console.log(req.url);
        fileController.GET_All(res, decoded)
      }
    }
    else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: "Niepoprawny token" }));
    }

  } else if (
    req.url.match(/\/api\/photos\/([0-9]+)/) && req.method == "GET") {
    let getID = req.url.split('/')[req.url.split('/').length - 1]
    console.log(getID);
    fileController.GET(getID, res)
  } else if (req.method == "PATCH" && req.url.match(/\/api\/photos\/([0-9]+)/)) {
    let getID = req.url.split('/')[req.url.split('/').length - 1]
    console.log(getID);
    jsonController.PATCH(getID, res)
  } else if (req.method == "DELETE" && req.url.match(/\/api\/photos\/([0-9]+)/)) {
    let getID = req.url.split('/')[req.url.split('/').length - 1]
    console.log(getID);
    fileController.DELETE(getID, res)
  }
  else if (req.method == 'GET' && req.url == '/api/photos/all') {
    await fileController.GET_ALL_NOT_TOKEN(res)
  }
}


export default router