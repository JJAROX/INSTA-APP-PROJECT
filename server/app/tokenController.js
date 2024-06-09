import jsonwebtoken from 'jsonwebtoken';
import 'dotenv/config'
import usersController from './userController.js';
const { sign, verify } = jsonwebtoken;

let tokensController = {

  createToken: (data) => {

    let token = sign(
      {
        id: data.id,
        name: data.name,
        lastName: data.lastName,
        email: data.email
      },
      process.env.SECRET_KEY, // key powinien być zapisany w .env
      {
        expiresIn: "1h" // "1m", "1d", "24h"
      }
    );
    return token
  },
  verifyToken: (token, res) => {

    try {
      let decoded = verify(token, process.env.SECRET_KEY)
      console.log({ decoded: decoded });
      // usersController.UPDATE_CONFIRM(decoded, res)
      return decoded
    }
    catch (ex) {
      console.log({ message: ex.message });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `Autoryzacja konta się nie powiodła`, reason: ex.message }));
    }
  },
  processToken: () => {
    createToken()
    verifyToken("CI6IkpXVCJ9.eHAiOjE2NTIyMDcyNDZ9.UFylfhywQgHeT20p-Q2DSHMrHhprGkEiH9k4lWYrYEQ")
  }

}

export default tokensController







