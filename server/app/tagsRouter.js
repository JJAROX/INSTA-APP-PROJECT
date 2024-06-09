import tagsController from "./tagsController.js"
import getRequestData from "./getRequestedData.js"
const tagsRouter = async (req, res) => {
  console.log('Tags Router method: ' + req.method)
  if (req.url == '/api/tags/raw' && req.method == "GET") {
    tagsController.GET_RAW(res)
  } else if (req.url == '/api/tags' && req.method == "GET") {
    tagsController.GET_OBJECT(res)
  } else if (req.url.match(/\/api\/tags\/([0-9]+)/) && req.method == "GET") {
    let getID = req.url.split('/')[req.url.split('/').length - 1]
    tagsController.GET(getID, res)
  } else if (req.method == "POST" && req.url == '/api/tags') {
    let data = await getRequestData(req);
    tagsController.ADD(data, res)
  } else if (req.url == '/api/photos/tags' && req.method == 'PATCH') {
    let data = await getRequestData(req);
    tagsController.PATCH(data.id, data.tag_name, res)
  } else if (req.url == '/api/photos/tags/mass' && req.method == 'PATCH') {
    let data = await getRequestData(req);
    tagsController.PATCH_MASS(data.id, data.tags_name, res)
  } else if (req.url.match(/\/api\/photos\/tags\/([0-9]+)/) && req.method == 'GET') {
    let getID = req.url.split('/')[req.url.split('/').length - 1]
    console.log(getID);
    tagsController.GET_TAGS(getID, res)
  }
}


export default tagsRouter