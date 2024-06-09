import { readFile, writeFile, appendFile, readdir, rename, existsSync, mkdir, readFileSync, unlinkSync } from 'fs';
import photos from './model.js';
import path from "path";
import jsonController from './jsonController.js';
import { assert, log, timeStamp } from 'console';
import { request } from 'http';
import { createRequire } from 'node:module';
import formidable from 'formidable';
import photosJSON from './data/photos.json' assert { type: "json" };
const __dirname = path.resolve();
const photosJsonPath = path.join(__dirname, `app/data`, `photos.json`)
const usersJsonPath = path.join(__dirname, `app/data`, `users.json`)
const fileController = {
  GET: (id, res) => {
    const data = readFileSync(photosJsonPath, 'utf-8');
    const photosArray = JSON.parse(data);
    jsonController.GET(JSON.stringify(photosArray), id, res)
  },
  GET_All: (res, decoded) => {
    const data = readFileSync(photosJsonPath, 'utf-8');
    const photosArray = JSON.parse(data);
    let thisUserPhotos = []
    for (let i = 0; i < photosArray.length; i++) {
      console.log(photosArray[i].album);
      console.log(decoded.email);
      if (photosArray[i].album == decoded.email && photosArray[i].profile !== true && photosArray[i].profile !== false) {
        thisUserPhotos.push(photosArray[i])
        console.log(thisUserPhotos);
      }
    }

    jsonController.GET_ALL(JSON.stringify(thisUserPhotos), res)
  },
  POST: (request, response, decoded) => {
    let form = formidable()
    form.keepExtensions = true

    form.uploadDir = __dirname + '/uploads/' + `${decoded.email}`

    form.multiples = true

    form.parse(request, function (err, fields, files) {

      console.log("----- przesłane pola z formularza ------");

      console.log(fields);

      console.log("----- przesłane formularzem pliki ------");

      console.log(files)
      console.log(files.file.path)


      let new_path = path.join(__dirname, `uploads/${decoded.email}`, `${files.file.path.split('\\')[files.file.path.split('\\').length - 1]}`)
      let old_path = path.join(__dirname, `uploads/`, `${files.file.path.split('\\')[files.file.path.split('\\').length - 1]}`)

      const parts = new_path.split('uploads');
      const relativePath = 'uploads' + parts[1];

      console.log('To jest old path ====', old_path);
      let newFile = {
        id: new Date().getTime(),
        album: decoded.email,
        originalName: files.file.name,
        url: relativePath,
        lastChange: "original",
        history: [
          {
            status: "original",
            timestamp: Date.now()
          }
        ]
      }
      jsonController.ADD(newFile, response)




      if (!existsSync(`${form.uploadDir}`)) {
        console.log(`${form.uploadDir}`)
        mkdir(`${form.uploadDir}`, (err) => {
          console.log(`${form.uploadDir}`)
          if (err) throw err
          if (!existsSync(`${new_path}`)) {
            console.log('ok')
            console.log(`${new_path}`);
            rename(old_path, new_path, (err) => {
              console.log('To jest old_path' + old_path, 'To jest new_path' + new_path)
              if (err) console.log(err)
            })
          }
          else {
          }
        })

      } else if (existsSync(`${form.uploadDir}/${fields.album}`)) {
        if (!existsSync(`${new_path}`)) {
          console.log('ok')
          console.log(`${new_path}`);
          rename(old_path, new_path, (err) => {
            console.log('To jest old_path' + old_path, 'To jest new_path' + new_path)
            if (err) console.log(err)
          })
        }
      }

      const data = readFileSync(photosJsonPath, 'utf-8');
      const photosArray = JSON.parse(data);
      photosArray.push(newFile);
      // console.log('to jest photosArray' + JSON.stringify(photosArray));
      writeFile(`${photosJsonPath}`, JSON.stringify(photosArray, null, 2), (err) => {
        if (err) throw err;
        console.log("plik utworzony");
      });
      return newFile
    });

  },
  CREATE_USER_DIR: (decoded, res) => {
    console.log(decoded);
    let formDir = __dirname + '/uploads/' + `${decoded.email}`
    if (!existsSync(`${formDir}`)) {
      mkdir(`${formDir}`, (err) => {
        console.log(`${formDir}`)
        if (err) throw err
      })
    } else {

    }

  },
  POST_PROFILE_IMAGE: (decoded, req, res) => {
    let form = formidable()
    form.keepExtensions = true

    form.uploadDir = __dirname + '/uploads/' + `${decoded.email}`
    if (!existsSync(`${form.uploadDir}`)) {
      mkdir(`${form.uploadDir}`, (err) => {
        console.log(`${form.uploadDir}`)
        if (err) throw err
      })
    }
    form.multiples = true

    form.parse(req, function (err, fields, files) {

      console.log("----- przesłane pola z formularza ------");

      console.log(fields);

      console.log("----- przesłane formularzem pliki ------");

      console.log(files)
      console.log(files.file.path)

      let new_path = path.join(form.uploadDir, `${files.file.path.split('\\')[files.file.path.split('\\').length - 1]}`)
      // let old_path = path.join(__dirname, `uploads/`, `${files.file.path.split('\\')[files.file.path.split('\\').length - 1]}`)
      console.log(new_path);
      const parts = new_path.split('uploads');
      const relativePath = 'uploads' + parts[1];

      let newFile = {
        id: new Date().getTime(),
        album: `${decoded.email}`,
        originalName: files.file.name,
        url: relativePath,
        lastChange: "original",
        profile: true,
        history: [
          {
            status: "original",
            timestamp: Date.now()
          }
        ]
      }
      // jsonController.ADD(newFile, res)
      const data = readFileSync(photosJsonPath, 'utf-8');
      const photosArray = JSON.parse(data);
      let found = false;
      let responseSent = false;
      let updated = false;

      for (let i = 0; i < photosArray.length; i++) {
        if (photosArray[i].album === decoded.email && photosArray[i].profile === true) {
          photosArray[i].profile = false;
          updated = true;
        }
      }

      photosArray.push(newFile);

      writeFile(`${photosJsonPath}`, JSON.stringify(photosArray, null, 2), (err) => {
        if (err) throw err;
        console.log("plik utworzony");
      });

      // Send the response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newFile));

      // if (photosArray.length > 0) {
      //   console.log(photosArray);
      //   for (let i = 0; i < photosArray.length; i++) {
      //     console.log(decoded.email);
      //     console.log(photosArray[i].album);
      //     if (photosArray[i].album == decoded.email) {
      //       console.log(photosArray[i].email);
      //       if (photosArray[i].profile == true) {
      //         photosArray[i].profile = false;
      //         photosArray.push(newFile);
      //         writeFile(`${photosJsonPath}`, JSON.stringify(photosArray, null, 2), (err) => {
      //           if (err) throw err;
      //           console.log("plik utworzony");
      //         });
      //         found = true;
      //         responseSent = true;
      //         res.writeHead(200, { 'Content-Type': 'application/json' });
      //         res.end(JSON.stringify(newFile));
      //         break;
      //       } else {
      //         photosArray.push(newFile);
      //         writeFile(`${photosJsonPath}`, JSON.stringify(photosArray, null, 2), (err) => {
      //           if (err) throw err;
      //           console.log("plik utworzony");
      //         });
      //         responseSent = true;
      //         res.writeHead(200, { 'Content-Type': 'application/json' });
      //         res.end(JSON.stringify(newFile));
      //         break;
      //       }
      //     }
      //   }
      //   if (!responseSent) {
      //     res.writeHead(200, { 'Content-Type': 'application/json' });
      //     res.end(JSON.stringify(newFile));
      //   }
      // } else {
      //   photosArray.push(newFile);
      //   writeFile(`${photosJsonPath}`, JSON.stringify(photosArray, null, 2), (err) => {
      //     if (err) throw err;
      //     console.log("plik utworzony");
      //   });
      //   res.writeHead(200, { 'Content-Type': 'application/json' });
      //   res.end(JSON.stringify(newFile));
      // }
      // for (let i = 0; i < photosArray.length; i++) {
      //   if (photosArray[i].email == decoded.email && photosArray[i].profile == true) {
      //     photosArray[i] == false
      //     break
      //   }
      // }
      // console.log('to jest photosArray' + JSON.stringify(photosArray));

    });
  },
  PATCH: (newData) => {
    const photosArray = JSON.parse(newData);
    // console.log('to jest photosArray' + JSON.stringify(photosArray));
    writeFile(`${photosJsonPath}`, JSON.stringify(photosArray, null, 2), (err) => {
      if (err) throw err;
      console.log("plik utworzony");
    });
  },
  DELETE: (id, res) => {
    const data = readFileSync(photosJsonPath, 'utf-8');
    const photosArray = JSON.parse(data);
    jsonController.DELETE(JSON.stringify(photosArray), id, res)
    console.log('whattttt' + photosArray.length);
    for (let i = 0; i < photosArray.length; i++) {
      if (photosArray[i].id === parseInt(id)) {
        let photoPath = path.join(__dirname, `${photosArray[i].url}`)
        console.log(photoPath);
        unlinkSync(photoPath)
      }
    }
    let editedPhotosArray = photosArray.filter((element) => element.id !== parseInt(id))
    console.log('Edited Array' + JSON.stringify(editedPhotosArray, null, 5));
    // console.log('to jest photosArray' + JSON.stringify(photosArray));

    writeFile(`${photosJsonPath}`, JSON.stringify(editedPhotosArray, null, 2), (err) => {
      if (err) throw err;
      console.log("plik utworzony");
    });

  },
  GET_UPLOADS_IMG: (req, res) => {
    const filePath = path.join(__dirname, req.url);
    readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      res.end(data);
    });
  },
  GET_PROFILE_PICTURE: (req, res, decoded) => {
    let filepath = __dirname + '/uploads/' + `${decoded.email}`;
    if (existsSync(`${filepath}`)) {
      const data = readFileSync(photosJsonPath, 'utf-8');
      const photosArray = JSON.parse(data);
      let found = false
      if (photosArray.length > 0) {
        for (let i = 0; i < photosArray.length; i++) {
          if (photosArray[i].album === decoded.email && photosArray[i].profile == true) {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(photosArray[i].url))
            found = true
            break
          }
        }
        if (!found) {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify(`profile picture not found`))
        }
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ message: "array is empty" })
        )
      }

    }
  },
  GET_ALL_NOT_TOKEN: async (res) => {
    try {
      const photosData = readFileSync(photosJsonPath, 'utf-8');
      const usersData = readFileSync(usersJsonPath, 'utf-8');
      const photosArray = JSON.parse(photosData);
      const usersArray = JSON.parse(usersData);

      const userProfileMap = photosArray
        .filter(photo => photo.profile === true)
        .reduce((acc, photo) => {
          acc[photo.album] = photo.url;
          return acc;
        }, {});

      let newArray = photosArray
        .filter(photo => photo.profile !== true && photo.profile !== false)
        .map(photo => {
          const user = usersArray.find(user => user.email === photo.album);
          return {
            ...photo,
            name: user ? user.name : null,
            lastName: user ? user.lastName : null,
            profileUrl: userProfileMap[photo.album] || null
          };
        });
      console.log(newArray);
      await jsonController.GET_ALL(JSON.stringify(newArray), res)
    }

    catch (error) {
      console.error('Error in GET_ALL_NOT_TOKEN:', error)
    }


  }
}
export default fileController