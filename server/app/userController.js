import { readFile, writeFile, appendFile, readdir, rename, existsSync, mkdir, readFileSync, unlinkSync, renameSync } from 'fs';
import bcryptController from './bcryptController.js';
import tokensController from './tokenController.js';
import path from "path";
import { log } from 'console';
const __dirname = path.resolve();
const usersJson = path.join(__dirname, `app/data`, `users.json`)
const usersController = {
  REGISTER: async (data, res) => {
    if (data.name && data.lastName && data.email && data.password) {
      const jsonData = readFileSync(usersJson, 'utf-8');
      const usersData = JSON.parse(jsonData);
      let userExists = false

      if (usersData.length > 0) {
        for (let i = 0; i < usersData.length; i++) {
          if (usersData[i].email === data.email) {
            userExists = true;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: `Użytkownik o podanym adresie email: ${data.email} już istnieje` }));
            return;
          }
        }
      }

      if (!userExists) {
        let userObject = {
          id: new Date().getTime(),
          name: data.name,
          lastName: data.lastName,
          email: data.email,
          confirmed: false,
          password: await bcryptController.encryptPass(data.password)
        };
        console.log(userObject);
        usersData.push(userObject);
        writeFile(usersJson, JSON.stringify(usersData, null, 2), (err) => {
          if (err) throw err;
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          message: `skopiuj poniższy link do przeglądarki http://localhost:3000/api/user/confirm/${tokensController.createToken(userObject)}  w celu potwierdzenia konta Uwaga: link jest ważny przez godzinę`,
          link: `http://localhost:3000/api/user/confirm/${tokensController.createToken(userObject)}`
        }));
      }

    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `Podaj wszystkie dane (imie,nazwisko,email,hasło)` }));
    }
  },
  UPDATE_CONFIRM: (token, res) => {
    const jsonData = readFileSync(usersJson, 'utf-8');
    const usersData = JSON.parse(jsonData);
    let found = false
    let decoded = tokensController.verifyToken(token)
    console.log("ID" + decoded.id);
    if (parseInt(decoded.id) === undefined) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `not found` }))
    } else {
      if (usersData.length > 0) {
        console.log(usersData)
        for (let i = 0; i < usersData.length; i++) {
          if (usersData[i].id === parseInt(decoded.id)) {
            usersData[i].confirmed = true
            writeFile(usersJson, JSON.stringify(usersData, null, 2), (err) => {
              if (err) throw err;
            });
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: `Autoryzacja konta się powiodła`, data: usersData[i] }));
            found = true
            break
          }
        }
        if (!found) {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ message: `user with id ${decoded.id} not found` }))
        }
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ message: "array is empty" })
        )
      }

    }

  },
  LOGIN: async (data, res) => {
    if (data.email && data.password) {
      const jsonData = readFileSync(usersJson, 'utf-8');
      const usersData = JSON.parse(jsonData);
      let found = false

      if (usersData.length > 0) {
        console.log(usersData)
        for (let i = 0; i < usersData.length; i++) {
          if (usersData[i].email === data.email) {
            console.log(usersData[i].password, data.password);
            if (usersData[i].confirmed == true) {
              if (bcryptController.decryptPass(data.password, usersData[i].password)) {
                res.setHeader('Authorization', 'Bearer ' + tokensController.createToken(usersData[i]))
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ token: tokensController.createToken(usersData[i]), name: usersData[i].name, lastName: usersData[i].lastName }))
              } else {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ message: `Hasło dla usera z emailem ${usersData[i].email} jest nieprawidłowe` }))
              }
            } else {
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ message: `Konto ${usersData[i].email} nie zostało potwierdzone` }))
            }


            // usersData[i].confirmed = true
            // writeFile(usersJson, JSON.stringify(usersData, null, 2), (err) => {
            //   if (err) throw err;
            // });
            // res.writeHead(200, { 'Content-Type': 'application/json' })
            // res.end(JSON.stringify({ message: `Autoryzacja konta się powiodła`, data: usersData[i] }));
            found = true
            break
          }
        }
        if (!found) {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ message: `user with email ${data.email} not found` }))
        }
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ message: "array is empty" })
        )
      }



    }
    else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `Podaj wszystkie dane (email,hasło)` }));
    }

  },
  GET_USERS: (res) => {
    const jsonData = readFileSync(usersJson, 'utf-8');
    const usersData = JSON.parse(jsonData);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(usersData))
  },
  UPDATE_DATA: (decoded, data, res) => {
    const jsonData = readFileSync(usersJson, 'utf-8');
    const usersData = JSON.parse(jsonData);
    let found = false

    if (parseInt(decoded.id) === undefined) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `not found` }))
    } else {
      if (usersData.length > 0) {
        console.log(usersData)
        for (let i = 0; i < usersData.length; i++) {
          if (usersData[i].id === parseInt(decoded.id)) {
            usersData[i].name = data.name || usersData[i].name
            usersData[i].lastName = data.lastname || usersData[i].lastName
            writeFile(usersJson, JSON.stringify(usersData, null, 2), (err) => {
              if (err) throw err;
            });
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: `Zmiana danych profilu się powiodła`, name: usersData[i].name, lastName: usersData[i].lastName }));
            found = true
            break
          }
        }
        if (!found) {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ message: `user with id ${decoded.id} not found` }))
        }
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ message: "array is empty" })
        )
      }

    }

  }
}
export default usersController