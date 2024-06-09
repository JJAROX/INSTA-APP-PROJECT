import { readFile, writeFile, appendFile, readdir, rename, existsSync, mkdir, readFileSync, unlinkSync } from 'fs';
import tagsArray from "./data/tagsArray.json" assert { type: "json" };
// import tagsObject from "./data/tagsObject.json" assert { type: "json" };
import path from "path";
import { log } from 'console';
const __dirname = path.resolve();
const tagsObjectJson = path.join(__dirname, `app/data`, `tagsObject.json`)
const tagsArrayJson = path.join(__dirname, `app/data`, `tagsArray.json`)
const photosJsonPath = path.join(__dirname, `app/data`, `photos.json`)
const tagsController = {
  GET: (id, res) => {
    const data = readFileSync(tagsObjectJson, 'utf-8');
    const tagsObject = JSON.parse(data);
    let found = false
    if (parseInt(id) === undefined) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `not found` }))
    } else {
      if (tagsObject.length > 0) {
        console.log(tagsObject)
        for (let i = 0; i < tagsObject.length; i++) {
          if (tagsObject[i].id === parseInt(id)) {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(tagsObject[i]))
            found = true
            break
          }
        }
        if (!found) {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ message: `tag with id ${id} not found` }))
        }
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ message: "array is empty" })
        )
      }

    }
  },
  ADD: (data, res) => {
    console.log(data);
    const data2 = readFileSync(tagsObjectJson, 'utf-8');
    const data3 = readFileSync(tagsArrayJson, 'utf-8');
    const tagsObject = JSON.parse(data2);
    const tagsArray = JSON.parse(data3);
    let found = false
    for (let i = 0; i < tagsObject.length; i++) {
      if (tagsObject[i].name === data.name) {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: `tag ${data.name} already exists` }))
        found = true
        break
      }
    }
    if (!found) {
      tagsObject.push({ id: tagsObject.length, name: data.name, popularity: data.popularity })
      tagsArray.push(data.name)
      console.log(tagsObject);
      console.log(tagsArray);
      //dodaj aktualizowanie pliku tez
      writeFile(`${tagsObjectJson}`, JSON.stringify(tagsObject, null, 2), (err) => {
        if (err) throw err;
      });
      writeFile(`${tagsArrayJson}`, JSON.stringify(tagsArray), (err) => {
        if (err) throw err;
      });
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: `tag ${data.name} added` }))
    }

  },
  PATCH: (id, tag_name, res) => {
    console.log(id, tag_name);
    const photosData = readFileSync(photosJsonPath, 'utf-8');
    const photosArray = JSON.parse(photosData)
    const data2 = readFileSync(tagsObjectJson, 'utf-8');
    const data3 = readFileSync(tagsArrayJson, 'utf-8');
    const tagsObject = JSON.parse(data2);
    const tagsArray = JSON.parse(data3);
    console.log(photosArray);
    let foundTag = false
    let found = false

    for (let i = 0; i < tagsObject.length; i++) {
      if (tagsObject[i].name === tag_name) {
        tagsObject[i].popularity++
        writeFile(`${tagsObjectJson}`, JSON.stringify(tagsObject, null, 2), (err) => {
          if (err) throw err;
        });
        foundTag = true
        break
      }
    }
    if (!foundTag) {
      tagsObject.push({ id: tagsObject.length, name: tag_name, popularity: 1 })
      tagsArray.push(tag_name)
      writeFile(`${tagsObjectJson}`, JSON.stringify(tagsObject, null, 2), (err) => {
        if (err) throw err;
      });
      writeFile(`${tagsArrayJson}`, JSON.stringify(tagsArray), (err) => {
        if (err) throw err;
      });
    }

    if (parseInt(id) === undefined) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `not found` }))
    } else {
      if (photosArray.length > 0) {
        for (let i = 0; i < photosArray.length; i++) {
          if (photosArray[i].id === parseInt(id)) {
            found = true
            // res.writeHead(200, { 'Content-Type': 'application/json' })
            // res.end(JSON.stringify(photosArray[i]))
            // console.log(photosArray[i].tags[0]);
            if (photosArray[i].tags) {
              let tagExists = false
              // console.log('check czy istnieje' + photosArray[i].tags[0]);'
              console.log(photosArray[i].tags);
              for (let k = 0; k < photosArray[i].tags.length; k++) {
                //czemu tu jest undefined wtf
                console.log(photosArray[i].tags[k].name)
                console.log('Dlugosc tagsów' + photosArray[i].tags.length);
                console.log(tag_name);
                if (photosArray[i].tags[k].name == tag_name) {
                  tagExists = true
                  break
                }
              }
              if (!tagExists) {
                photosArray[i].tags.push({ name: tag_name })
                writeFile(`${photosJsonPath}`, JSON.stringify(photosArray, null, 2), (err) => {
                  if (err) throw err;
                });
                console.log(photosArray);
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ message: `tag ${tag_name} added to photo with id ${id}` }))
              } else {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ message: `photo with id ${id} already have ${tag_name} tag` }))
              }
            } else {
              let tags = []
              tags.push({ name: tag_name })
              photosArray[i].tags = tags
              writeFile(`${photosJsonPath}`, JSON.stringify(photosArray, null, 2), (err) => {
                if (err) throw err;
              });
              console.log('----------------');
              console.log(photosArray[i].tags);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: `tag ${tag_name} added to photo with id ${id}` }));
            }
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
  PATCH_MASS: (id, tags_names, res) => {
    console.log(id, tags_names);
    const photosData = readFileSync(photosJsonPath, 'utf-8');
    const photosArray = JSON.parse(photosData)
    const data2 = readFileSync(tagsObjectJson, 'utf-8');
    const data3 = readFileSync(tagsArrayJson, 'utf-8');
    const tagsObject = JSON.parse(data2);
    const tagsArray = JSON.parse(data3);
    let found = false
    if (parseInt(id) === undefined) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `not found` }))
    } else {
      if (photosArray.length > 0) {
        for (let i = 0; i < photosArray.length; i++) {
          if (photosArray[i].id === parseInt(id)) {
            found = true
            if (photosArray[i].tags) {
              tags_names.forEach(tag_name => {
                if (photosArray[i].tags.some(tag => tag.name === tag_name)) {
                  console.log(tag_name);
                } else {
                  console.log(tag_name);
                  photosArray[i].tags.push({ name: tag_name })
                  writeFile(`${photosJsonPath}`, JSON.stringify(photosArray, null, 2), (err) => {
                    if (err) throw err;
                  });
                  tagsObject.push({ id: tagsObject.length, name: tag_name, popularity: 1 })
                  tagsArray.push(tag_name)
                  writeFile(`${tagsObjectJson}`, JSON.stringify(tagsObject, null, 2), (err) => {
                    if (err) throw err;
                  });
                  writeFile(`${tagsArrayJson}`, JSON.stringify(tagsArray), (err) => {
                    if (err) throw err;
                  });
                }
              })
            } else {
              tags_names.forEach((tag_name) => {
                photosArray[i].tags = { name: tag_name }
                writeFile(`${photosJsonPath}`, JSON.stringify(photosArray, null, 2), (err) => {
                  if (err) throw err;
                });
                tagsObject.push({ id: tagsObject.length, name: tag_name, popularity: 1 })
                tagsArray.push(tag_name)
                writeFile(`${tagsObjectJson}`, JSON.stringify(tagsObject, null, 2), (err) => {
                  if (err) throw err;
                });
                writeFile(`${tagsArrayJson}`, JSON.stringify(tagsArray), (err) => {
                  if (err) throw err;
                });
              })
            }
            break
          }
        }
        if (!found) {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ message: `photo with id ${id} not found` }))
        }
      }
      else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ message: "array is empty" })
        )
      }
    }


  },
  DELETE: () => {
  },
  GET_TAGS: (id, res) => {
    const photosData = readFileSync(photosJsonPath, 'utf-8');
    const photosArray = JSON.parse(photosData)
    let found = false
    if (photosArray.length > 0) {
      for (let i = 0; i < photosArray.length; i++) {
        if (photosArray[i].id === parseInt(id)) {
          found = true
          if (photosArray[i].tags) {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ id: id, tags: photosArray[i].tags }))
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: `photo with id ${id} doesnt have tags` }))
          }
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

  },
  GET_RAW: (res) => {
    const data = readFileSync(tagsArrayJson, 'utf-8');
    const tagsArray = JSON.parse(data);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(tagsArray))
  },
  GET_OBJECT(res) {
    const tagsObjectJson = path.join(__dirname, `app/data`, `tagsObject.json`)
    const data = readFileSync(tagsObjectJson, 'utf-8');
    const tagsObject = JSON.parse(data);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(tagsObject))
  }
}
export default tagsController