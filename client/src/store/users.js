import { loginUser, registerUser, editUserProfile, editUserProfilePicture, getUserImage, postUserImage, getCurrentUserPhotos, getAllPosts } from "@/api/index.js"

const users = {

  state() {
    return {
      currentUser: null,
      usersList: [],
      usersLoading: false,
      usersError: null,
      token: null,
      triedToProfile: false,
      currentProfilePicture: '',
      imageId: null,
      currentUserPhotos: [],
      allPosts: []
    }
  },

  mutations: {
    SET_USERS_LIST(state, newUsers) {
      state.usersList = newUsers
    },
    SET_USERS_LOADING(state, bool) {
      state.usersLoading = bool
    },
    SET_USERS_ERROR(state, message) {
      state.usersError = message
    },
    SET_USER_TOKEN(state, newToken) {
      state.token = newToken
    },
    SET_CURRENT_USER(state, currentUser) {
      state.currentUser = currentUser
    },
    SET_TRIED(state) {
      state.triedToProfile = true
    },
    SET_CURRENT_PP(state, link) {
      state.currentProfilePicture = link
    },
    SET_IMAGE_ID(state, id) {
      state.imageId = id
    },
    SET_CURRENT_USER_PHOTOS(state, data) {
      state.currentUserPhotos.push(data.url)
    },
    CLEAR_CURRENT_USER_PHOTOS(state) {
      state.currentUserPhotos = [];
    },
    SET_ALL_POSTS(state, data) {
      state.allPosts.push(data)
    },
    CLEAR_ALL_PHOTOS(state) {
      state.allPosts = [];
    }
  },

  getters: {
    GET_USERS_LIST(state) {
      return state.carsList
    },
    GET_USERS_LOADING(state) {
      return state.usersLoading
    },
    GET_USERS_ERROR(state) {
      return state.carsError
    },
    GET_USER_TOKEN(state) {
      return state.token
    },
    GET_CURRENT_USER(state) {
      return state.currentUser
    },
    GET_TRIED(state) {
      return state.triedToProfile
    },
    GET_IMAGE_ID(state) {
      return state.imageId
    },
    GET_CURRENT_PP(state) {
      return state.currentProfilePicture || ''
    },
    GET_CURRENT_USER_PHOTOS(state) {
      return state.currentUserPhotos
    },
    GET_ALLPOSTS(state) {
      return state.allPosts
    }
  },

  actions: {

    async REGISTER_USER({ state, commit }, object) {

      commit("SET_USERS_LOADING", true)

      try {
        const data = await registerUser(object)
        console.log("fetch", data);
        commit("SET_USERS_LIST", data.token)
        return data
      }
      catch (err) {
        console.log("err", err);
        commit("SET_USERS_ERROR", "server error!!!")
      }
      finally {
        console.log("finally");
        commit("SET_USERS_LOADING", false)
      }
    },
    async LOGIN_USER({ state, commit }, object) {

      commit("SET_USERS_LOADING", true)

      try {
        const data = await loginUser(object)
        console.log("fetch", data);
        commit("SET_USER_TOKEN", data.token)
        commit("SET_CURRENT_USER", data)
        return data
      }
      catch (err) {
        console.log("err", err);
        commit("SET_USERS_ERROR", "server error!!!")
      }
      finally {
        console.log("finally");
        commit("SET_USERS_LOADING", false)
      }
    },
    async EDIT_PROFILE({ state, commit }, { object, token }) {

      commit("SET_USERS_LOADING", true)

      try {
        const data = await editUserProfile(object, token)
        console.log("fetch", data);
        commit("SET_CURRENT_USER", data)
        return data
      }
      catch (err) {
        console.log("err", err);
        commit("SET_USERS_ERROR", "server error!!!")
      }
      finally {
        console.log("finally");
        commit("SET_USERS_LOADING", false)
      }
    },
    async EDIT_PROFILE_PICTURE({ state, commit }, { formData, token }) {

      commit("SET_USERS_LOADING", true)

      try {
        const data = await editUserProfilePicture(formData, token)
        console.log("fetch", data);
        commit("SET_CURRENT_PP", data)
        commit("SET_IMAGE_ID", data.id)
        return data
      }
      catch (err) {
        console.log("err", err);
        commit("SET_USERS_ERROR", "server error!!!")
      }
      finally {
        console.log("finally");
        commit("SET_USERS_LOADING", false)
      }
    },
    async GET_PROFILE_PICTURE({ state, commit }, token) {

      commit("SET_USERS_LOADING", true)

      try {
        const data = await getUserImage(token)
        console.log("fetch", data);
        if (data == 'profile picture not found') {
          commit("SET_CURRENT_PP", '')
        } else {
          commit("SET_CURRENT_PP", data)
          return data
        }

      }
      catch (err) {
        console.log("err", err);
        commit("SET_USERS_ERROR", "server error!!!")
      }
      finally {
        console.log("finally");
        commit("SET_USERS_LOADING", false)
      }
    },
    async POST_IMAGE({ state, commit }, { formData, token }) {
      commit("SET_USERS_LOADING", true)

      try {
        const data = await postUserImage(formData, token)
        console.log("fetch", data);
        commit("SET_CURRENT_USER_PHOTOS", data)
        return data
      }
      catch (err) {
        console.log("err", err);
        commit("SET_USERS_ERROR", "server error!!!")
      }
      finally {
        console.log("finally");
        commit("SET_USERS_LOADING", false)
      }
    },
    async GET_USERS_PICTURES({ state, commit }, token) {
      console.log(token.token);
      commit("SET_USERS_LOADING", true)

      try {
        const data = await getCurrentUserPhotos(token.token)
        console.log("fetch", data);
        if (!data.message) {
          data.forEach(element => {
            commit("SET_CURRENT_USER_PHOTOS", element)
          });
        } else {

        }


      }
      catch (err) {
        console.log("err", err);
        commit("SET_USERS_ERROR", "server error!!!")
      }
      finally {
        console.log("finally");
        commit("SET_USERS_LOADING", false)
      }
    },
    async GET_ALL_POSTS({ state, commit }) {
      commit("SET_USERS_LOADING", true)

      try {
        const data = await getAllPosts()
        console.log("fetch", data);
        if (!data.message) {
          data.forEach(element => {
            commit("SET_ALL_POSTS", element)
          });
        } else {

        }
      }
      catch (err) {
        console.log("err", err);
        commit("SET_USERS_ERROR", "server error!!!")
      }
      finally {
        console.log("finally");
        commit("SET_USERS_LOADING", false)
      }
    }

  }

}

export default users