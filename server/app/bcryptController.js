import bcryptjs from 'bcryptjs';
const { hash, compare } = bcryptjs;
let bcryptController = {
  encryptPass: async (password) => {

    let encryptedPassword = await hash(password, 10);
    return encryptedPassword
  },
  decryptPass: async (userpass, encrypted) => {

    let decrypted = await compare(userpass, encrypted)
    console.log(decrypted);

  }
}
export default bcryptController