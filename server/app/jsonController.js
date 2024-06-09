import photosJSON from './data/photos.json' assert { type: "json" };
import fileController from './fileController.js';
const jsonController = {
  GET: (photosArray, imageID, res) => {
    console.log(photosArray);
    const photosArrayJson = JSON.parse(photosArray)
    let found = false
    if (parseInt(imageID) === undefined) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `not found` }))
    } else {
      if (photosArrayJson.length > 0) {
        console.log(photosArrayJson)
        for (let i = 0; i < photosArrayJson.length; i++) {
          if (photosArrayJson[i].id === parseInt(imageID)) {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(photosArrayJson[i]))
            found = true
            break
          }
        }
        if (!found) {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ message: `photo with id ${imageID} not found` }))
        }
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ message: "array is empty" })
        )
      }

    }

  },
  ADD: (file, res) => {
    console.log(file);
    photosJSON.push(file)
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(file))
  },
  PATCH: (imageID, res) => {
    let found = false
    if (parseInt(imageID) === undefined) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `not found` }))
    } else {
      if (photosJSON.length > 0) {
        console.log(photosJSON)
        for (let i = 0; i < photosJSON.length; i++) {
          if (photosJSON[i].id === parseInt(imageID)) {
            photosJSON[i].history.push({ status: photosJSON[i].history.length == 1 ? `zmienione ${photosJSON[i].history.length} raz` : `zmienione ${photosJSON[i].history.length} razy`, timestamp: new Date().getTime() })
            photosJSON[i].lastChange = photosJSON[i].history[photosJSON[i].history.length - 1].status
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(photosJSON[i]))
            fileController.PATCH(JSON.stringify(photosJSON))
            found = true
            break
          }
        }
        if (!found) {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ message: `photo with id ${imageID} not found` }))
        }
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ message: "array is empty" })
        )
      }

    }
  },
  DELETE: (photosArray, imageID, res) => {
    let found = false
    const photosArrayJson = JSON.parse(photosArray)
    if (parseInt(imageID) === undefined) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `not found` }))
    } else {
      if (photosArrayJson.length > 0) {
        console.log(photosArrayJson)
        for (let i = 0; i < photosArrayJson.length; i++) {
          console.log(photosArrayJson[i].id);
          if (photosArrayJson[i].id === parseInt(imageID)) {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: `photo with id ${imageID} deleted` }))
            photosArrayJson.filter((element) => element.id !== parseInt(imageID))

            found = true
            break
          }
        }
        if (!found) {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ message: `photo with id ${imageID} not found` }))
        }
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ message: "array is empty" })
        )
      }

    }
  },
  GET_ALL: async (data, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data)
  }
}
export default jsonController