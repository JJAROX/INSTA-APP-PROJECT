import filtersController from "./filtersController.js";
import getRequestData from "./getRequestedData.js";
const filtersRouter = async (req, res) => {
  console.log('Filters Router method: ' + req.method)
  if (req.url.match(/\/api\/filters\/metadata\/([0-9]+)/) && req.method == 'GET') {
    let getID = req.url.split('/')[req.url.split('/').length - 1]
    filtersController.GET_METADATA(getID, res)
  }
  else if (req.method == 'PATCH' && req.url == '/api/filters') {
    let data = await getRequestData(req);
    console.log(data);
    filtersController.USE_FILTER(data, res)
  }
  else if (req.url.match(/\/api\/getimage\/([0-9]+)\/filter\/(tint|crop|resize|negate|flip|flop|grayscale|reformat|rotate)/) && req.method == 'GET') {
    let getID = req.url.split('/')[4]
    let getFilter = req.url.split('/')[req.url.split('/').length - 1]
    console.log(getID, getFilter);
    filtersController.GET_FILTERED_PHOTO(getID, getFilter, res)
  }
  else if (req.url.match(/\/api\/getimage\/([0-9]+)/) && req.method == 'GET') {
    let getID = req.url.split('/')[req.url.split('/').length - 1]
    console.log(getID);
    filtersController.GET_PHOTO(getID, res)
  }

}


export default filtersRouter