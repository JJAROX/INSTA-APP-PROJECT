import getRequestData from "./getRequestedData.js";
import usersController from "./userController.js";
import tokensController from "./tokenController.js";
import filtersController from "./filtersController.js";
import fileController from "./fileController.js";
const uploadsRouter = async (req, res) => {
  console.log('Uploads Router method: ' + req.method + req.url)
  if (req.method === 'GET' && req.url.startsWith('/uploads/')) {
    fileController.GET_UPLOADS_IMG(req, res)
  }
}


export default uploadsRouter