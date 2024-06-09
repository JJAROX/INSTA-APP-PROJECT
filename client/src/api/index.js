import axios from 'axios'

const register = async (url, object) => {

  return new Promise(async (resolve, reject) => {

    setTimeout(async () => {
      try {
        const response = await axios.post(url, object)
        console.log("axios", response.data);
        resolve(response.data)
      } catch (err) {
        console.log(err);
        reject(err)
      }

    }, 2000);

  })
}

const login = async (url, object) => {

  return new Promise(async (resolve, reject) => {

    setTimeout(async () => {
      try {
        const response = await axios.post(url, object)
        console.log("axios", response.data);
        resolve(response.data)
      } catch (err) {
        console.log(err);
        reject(err)
      }

    }, 2000);

  })
}
const editProfile = async (url, object, token) => {

  return new Promise(async (resolve, reject) => {

    setTimeout(async () => {
      try {
        const response = await axios.patch(url, object, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        console.log("axios", response.data);
        resolve(response.data)
      } catch (err) {
        console.log(err);
        reject(err)
      }

    }, 2000);

  })
}
const editProfilePicture = async (url, formData, token) => {

  return new Promise(async (resolve, reject) => {

    setTimeout(async () => {
      try {
        const response = await axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        })
        console.log("axios", response.data);
        resolve(response.data)
      } catch (err) {
        console.log(err);
        reject(err)
      }

    }, 2000);

  })
}
const getImage = async (url, token) => {

  return new Promise(async (resolve, reject) => {
    setTimeout(
      async () => {
        try {
          const response = await axios.get(url, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token.token}`
            }
          })
          console.log("axios", response.data);
          resolve(response.data)
        } catch (err) {
          console.log(err);
          reject(err)
        }

      }, 100)

  })
}

const postImage = async (url, formData, token) => {

  return new Promise(async (resolve, reject) => {

    setTimeout(async () => {
      try {
        const response = await axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        })
        console.log("axios", response.data);
        resolve(response.data)
      } catch (err) {
        console.log(err);
        reject(err)
      }

    }, 2000);

  })
}

const getUserPhotos = async (url, token) => {

  return new Promise(async (resolve, reject) => {
    setTimeout(
      async () => {
        try {
          const response = await axios.get(url, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })
          console.log("axios", response.data);
          resolve(response.data)
        } catch (err) {
          console.log(err);
          reject(err)
        }

      }, 0)

  })
}

const getPosts = async (url) => {

  return new Promise(async (resolve, reject) => {
    setTimeout(
      async () => {
        try {
          const response = await axios.get(url)
          console.log("axios", response.data);
          resolve(response.data)
        } catch (err) {
          console.log(err);
          reject(err)
        }

      }, 0)

  })
}


const registerUser = (object) => register("http://localhost:3000/api/user/register", object)
const loginUser = (object) => login("http://localhost:3000/api/user/login", object)
const editUserProfile = (object, token) => editProfile("http://localhost:3000/api/profile", object, token)
const editUserProfilePicture = (formData, token) => editProfilePicture("http://localhost:3000/api/profile", formData, token)
const getUserImage = (token) => getImage("http://localhost:3000/api/profile/picture", token)
const postUserImage = (formData, token) => postImage("http://localhost:3000/api/photos", formData, token)
const getCurrentUserPhotos = (token) => getUserPhotos("http://localhost:3000/api/photos", token)
const getAllPosts = () => getPosts("http://localhost:3000/api/photos/all")
export {
  registerUser, loginUser, editUserProfile, editUserProfilePicture, getUserImage, postUserImage, getCurrentUserPhotos, getAllPosts
}
