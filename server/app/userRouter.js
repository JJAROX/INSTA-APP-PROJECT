import getRequestData from "./getRequestedData.js";
import usersController from "./userController.js";
import tokensController from "./tokenController.js";
import filtersController from "./filtersController.js";
import fileController from "./fileController.js";
const usersRouter = async (req, res) => {
  console.log('Users Router method: ' + req.method + req.url)
  if (req.method == "POST" && req.url == "/api/user/register") {
    let data = await getRequestData(req);
    console.log(data);
    usersController.REGISTER(data, res)
  }
  else if (req.url.match(/\/api\/user\/confirm\/[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/) && req.method == 'GET') {
    let getToken = req.url.split('/')[req.url.split('/').length - 1]
    console.log(getToken);
    // tokensController.verifyToken(getToken, res)
    usersController.UPDATE_CONFIRM(getToken, res)
    fileController.CREATE_USER_DIR(tokensController.verifyToken(getToken, res), res)
  }
  else if (req.method == "POST" && req.url == "/api/user/login") {
    let data = await getRequestData(req);
    console.log(data);
    usersController.LOGIN(data, res)
  }
  else if (req.method == "GET" && req.url == "/api/user") {
    usersController.GET_USERS(res)
  }
}


export default usersRouter