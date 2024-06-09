import { readFile, writeFile, appendFile, readdir, rename, existsSync, mkdir, readFileSync, unlinkSync } from 'fs';
import path from "path";
import getRequestSharp from './getRequestedSharp.js';
import { log } from 'console';
const __dirname = path.resolve();
const photosJsonPath = path.join(__dirname, `app/data`, `photos.json`)
const filtersController = {
  GET_METADATA: async (id, res) => {
    console.log(id);
    const photosData = readFileSync(photosJsonPath, 'utf-8');
    const photosArray = JSON.parse(photosData)
    let found = false
    if (parseInt(id) === undefined) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `not found` }))
    } else {
      if (photosArray.length > 0) {
        console.log(photosArray)
        for (let i = 0; i < photosArray.length; i++) {
          if (photosArray[i].id === parseInt(id)) {
            console.log(photosArray[i].url);
            let filter = {
              lastChange: undefined
            }
            let sharpData = await getRequestSharp(photosArray[i].url, filter)
            console.log(sharpData);
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ id: id, metadata: sharpData }))
            found = true
            break
          }
        }
        if (!found) {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ message: `photo with id ${id} not found` }))
        }
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ message: "array is empty" })
        )
      }

    }
  },
  USE_FILTER: async (data, res) => {
    const photosData = readFileSync(photosJsonPath, 'utf-8');
    const photosArray = JSON.parse(photosData)
    let found = false
    if (parseInt(data.id) === undefined) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `not found` }))
    } else {
      if (photosArray.length > 0) {
        for (let i = 0; i < photosArray.length; i++) {
          if (photosArray[i].id === parseInt(data.id)) {
            console.log(photosArray[i].url);
            await getRequestSharp(photosArray[i].url, data)
            const baseName = path.basename(photosArray[i].url)
            const parsed = path.parse(baseName)
            const fileName = parsed.name
            const fileExtension = parsed.ext.slice(1)
            const directory = path.dirname(photosArray[i].url)
            photosArray[i].history.push({ status: data.lastChange, timestamp: new Date().getTime(), url: `${directory}\\${fileName}-${data.lastChange == 'rotate' ? 'rotated' : data.lastChange == 'resize' ? 'resized' : data.lastChange == 'reformat' ? 'reformatted' : data.lastChange == 'crop' ? 'cropped' : data.lastChange == 'grayscale' ? 'grayscale' : data.lastChange == 'flip' ? 'flipped' : data.lastChange == 'flop' ? 'flopped' : data.lastChange == 'negate' ? 'negate' : data.lastChange == 'tint' ? 'tint' : data.lastChange}.${fileExtension}` })
            photosArray[i].lastChange = data.lastChange
            // console.log(sharpData);
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ id: data.id, data: photosArray[i] }))
            writeFile(`${photosJsonPath}`, JSON.stringify(photosArray, null, 2), (err) => {
              if (err) throw err;
            });
            found = true
            break
          }
        }
        if (!found) {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ message: `photo with id ${id} not found` }))
        }
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ message: "array is empty" })
        )
      }

    }
  },
  GET_PHOTO: (id, res) => {
    const photosData = readFileSync(photosJsonPath, 'utf-8');
    const photosArray = JSON.parse(photosData)
    let found = false
    if (parseInt(id) === undefined) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `not found` }))
    } else {
      if (photosArray.length > 0) {
        console.log(photosArray)
        for (let i = 0; i < photosArray.length; i++) {
          if (photosArray[i].id === parseInt(id)) {
            console.log(photosArray[i].url);
            const baseName = path.basename(photosArray[i].url)
            const parsed = path.parse(baseName)
            const fileExtension = parsed.ext.slice(1)
            switch (fileExtension) {
              case "png":
                readFile(photosArray[i].url, (error, data) => {
                  if (error) {
                    res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                    res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                    res.end();
                  }

                  else {
                    res.writeHead(200, { 'Content-Type': 'image/png;charset=utf-8' });
                    res.write(data);
                    res.end();
                  }
                })
                break;
              case "jpeg":
                readFile(photosArray[i].url, (error, data) => {
                  if (error) {
                    res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                    res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                    res.end();
                  }

                  else {
                    res.writeHead(200, { 'Content-Type': 'image/jpeg;charset=utf-8' });
                    res.write(data);
                    res.end();
                  }
                })
                break;
              case "jpg":
                readFile(photosArray[i].url, (error, data) => {
                  if (error) {
                    res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                    res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                    res.end();
                  }

                  else {
                    res.writeHead(200, { 'Content-Type': 'image/jpeg;charset=utf-8' });
                    res.write(data);
                    res.end();
                  }
                })
                break;
              case "gif":
                readFile(photosArray[i].url, (error, data) => {
                  if (error) {
                    res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                    res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                    res.end();
                  }

                  else {
                    res.writeHead(200, { 'Content-Type': 'image/gif;charset=utf-8' });
                    res.write(data);
                    res.end();
                  }
                })
                break;
              case "bmp":
                readFile(photosArray[i].url, (error, data) => {
                  if (error) {
                    res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                    res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                    res.end();
                  }

                  else {
                    res.writeHead(200, { 'Content-Type': 'image/bmp;charset=utf-8' });
                    res.write(data);
                    res.end();
                  }
                })
                break;
              case "webp":
                readFile(photosArray[i].url, (error, data) => {
                  if (error) {
                    res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                    res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                    res.end();
                  }

                  else {
                    res.writeHead(200, { 'Content-Type': 'image/webp;charset=utf-8' });
                    res.write(data);
                    res.end();
                  }
                })
                break;
              case "svg":
                readFile(photosArray[i].url, (error, data) => {
                  if (error) {
                    res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                    res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                    res.end();
                  }

                  else {
                    res.writeHead(200, { 'Content-Type': 'image/svg+xml;charset=utf-8' });
                    res.write(data);
                    res.end();
                  }
                })
                break;
              case "x-icon":
                readFile(photosArray[i].url, (error, data) => {
                  if (error) {
                    res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                    res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                    res.end();
                  }

                  else {
                    res.writeHead(200, { 'Content-Type': 'image/x-icon;charset=utf-8' });
                    res.write(data);
                    res.end();
                  }
                })
                break;
              case "heic":
                readFile(photosArray[i].url, (error, data) => {
                  if (error) {
                    res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                    res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                    res.end();
                  }

                  else {
                    res.writeHead(200, { 'Content-Type': 'image/heic;charset=utf-8' });
                    res.write(data);
                    res.end();
                  }
                })
                break;
              case "avif":
                readFile(photosArray[i].url, (error, data) => {
                  if (error) {
                    res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                    res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                    res.end();
                  }

                  else {
                    res.writeHead(200, { 'Content-Type': 'image/avif;charset=utf-8' });
                    res.write(data);
                    res.end();
                  }
                })
                break;
              default:
                break;
            }

            found = true
            break
          }
        }
        if (!found) {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ message: `photo with id ${id} not found` }))
        }
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ message: "array is empty" })
        )
      }

    }
  },
  GET_FILTERED_PHOTO: (id, filter, res) => {
    const photosData = readFileSync(photosJsonPath, 'utf-8');
    const photosArray = JSON.parse(photosData)
    let found = false
    if (parseInt(id) === undefined) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `not found` }))
    } else {
      if (photosArray.length > 0) {
        console.log(photosArray)
        for (let i = 0; i < photosArray.length; i++) {
          if (photosArray[i].id === parseInt(id)) {
            console.log(photosArray[i].url);
            for (let k = 0; k < photosArray[i].history.length; k++) {
              if (photosArray[i].history[k].status == filter) {
                const baseName = path.basename(photosArray[i].history[k].url)
                const parsed = path.parse(baseName)
                const fileExtension = parsed.ext.slice(1)
                console.log(photosArray[i].history[k].url);
                switch (fileExtension) {
                  case "png":
                    readFile(photosArray[i].history[k].url, (error, data) => {
                      if (error) {
                        res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                        res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                        res.end();
                      }

                      else {
                        res.writeHead(200, { 'Content-Type': 'image/png;charset=utf-8' });
                        res.write(data);
                        res.end();
                      }
                    })
                    break;
                  case "jpeg":
                    readFile(photosArray[i].history[k].url, (error, data) => {
                      if (error) {
                        res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                        res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                        res.end();
                      }

                      else {
                        res.writeHead(200, { 'Content-Type': 'image/jpeg;charset=utf-8' });
                        res.write(data);
                        res.end();
                      }
                    })
                    break;
                  case "jpg":
                    readFile(photosArray[i].history[k].url, (error, data) => {
                      if (error) {
                        res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                        res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                        res.end();
                      }

                      else {
                        res.writeHead(200, { 'Content-Type': 'image/jpeg;charset=utf-8' });
                        res.write(data);
                        res.end();
                      }
                    })
                    break;
                  case "gif":
                    readFile(photosArray[i].history[k].url, (error, data) => {
                      if (error) {
                        res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                        res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                        res.end();
                      }

                      else {
                        res.writeHead(200, { 'Content-Type': 'image/gif;charset=utf-8' });
                        res.write(data);
                        res.end();
                      }
                    })
                    break;
                  case "bmp":
                    readFile(photosArray[i].history[k].url, (error, data) => {
                      if (error) {
                        res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                        res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                        res.end();
                      }

                      else {
                        res.writeHead(200, { 'Content-Type': 'image/bmp;charset=utf-8' });
                        res.write(data);
                        res.end();
                      }
                    })
                    break;
                  case "webp":
                    readFile(photosArray[i].history[k].url, (error, data) => {
                      if (error) {
                        res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                        res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                        res.end();
                      }

                      else {
                        res.writeHead(200, { 'Content-Type': 'image/webp;charset=utf-8' });
                        res.write(data);
                        res.end();
                      }
                    })
                    break;
                  case "svg":
                    readFile(photosArray[i].history[k].url, (error, data) => {
                      if (error) {
                        res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                        res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                        res.end();
                      }

                      else {
                        res.writeHead(200, { 'Content-Type': 'image/svg+xml;charset=utf-8' });
                        res.write(data);
                        res.end();
                      }
                    })
                    break;
                  case "x-icon":
                    readFile(photosArray[i].history[k].url, (error, data) => {
                      if (error) {
                        res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                        res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                        res.end();
                      }

                      else {
                        res.writeHead(200, { 'Content-Type': 'image/x-icon;charset=utf-8' });
                        res.write(data);
                        res.end();
                      }
                    })
                    break;
                  case "heic":
                    readFile(photosArray[i].history[k].url, (error, data) => {
                      if (error) {
                        res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                        res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                        res.end();
                      }

                      else {
                        res.writeHead(200, { 'Content-Type': 'image/heic;charset=utf-8' });
                        res.write(data);
                        res.end();
                      }
                    })
                    break;
                  case "avif":
                    readFile(photosArray[i].history[k].url, (error, data) => {
                      if (error) {
                        res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                        res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                        res.end();
                      }

                      else {
                        res.writeHead(200, { 'Content-Type': 'image/avif;charset=utf-8' });
                        res.write(data);
                        res.end();
                      }
                    })
                    break;
                  default:
                    break;
                }
                found = true
                break
              }
            }




          }
        }
        if (!found) {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ message: `photo with id ${id} and filter ${filter} not found` }))
        }
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ message: "array is empty" })
        )
      }

    }
  },
  DELETE: () => {
  },
}
export default filtersController