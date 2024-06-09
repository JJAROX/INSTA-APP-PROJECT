import { createStore } from 'vuex'
import users from './users.js'


const modules = {
  users,

}

export default createStore({
  modules,
})