<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { useStore } from 'vuex';
const router = useRouter()
const toast = useToast();
const store = useStore()
const goToProfile = () => {
  store.commit("CLEAR_ALL_PHOTOS")
  setTimeout(() => {
    router.push('/profile');
  }, 500);
}
const goToHome = () => {
  store.commit("CLEAR_ALL_PHOTOS")
  setTimeout(() => {
    router.push('/dashboard')
  }, 500);
}
const logOut = () => {
  toast.add({
    severity: 'success',
    summary: 'Logout Successful',
    detail: `Wylogowano`,
    life: 6000,
    escape: false
  });
  setTimeout(() => {
    store.commit("CLEAR_ALL_PHOTOS")
    router.push('/');
    store.commit("CLEAR_CURRENT_USER_PHOTOS")
  }, 1000);
}
</script>
<template>
  <Toast></Toast>
  <div class="side-bar-container">
    <div class="logo-div">
      <img @click="reloadPage" class="logo-instagram" src="../img/instalogo3.png" alt="instagram" width="43%">
    </div>
    <div class="side-div-click" @click="goToHome">
      <div class="avatar-i-div">
        <i class="pi pi-home" style="color: white;font-size: 1.5rem"></i>
      </div>
      <div class="p-div">
        <p>Strona Główna</p>
      </div>
    </div>
    <div class="side-div-click" @click="goToProfile">
      <div class="avatar-i-div">
        <img :src="profilePictureLink" alt="default" height="30" width="30" style="border-radius: 100%;">
      </div>
      <div class="p-div">
        <p>Profil</p>
      </div>
    </div>
    <div class="side-div-click" @click="logOut">
      <div class="avatar-i-div">
        <i class="pi pi-sign-out" style="color: white;font-size: 1.25rem"></i>
      </div>
      <div class="p-div">
        <p>Wyloguj</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    reloadPage() {
      location.reload()
    },


  },
  computed: {
    profilePictureLink() {
      const currentPP = this.$store.getters.GET_CURRENT_PP
      console.log(currentPP)
      if (typeof currentPP === 'string' && currentPP !== '' && currentPP !== 'profile picture not found') {
        return `http://localhost:3000/${currentPP.replace(/\\/g, '/')}`;
      } else {
        return `src/img/default-user.png`;
      }
    }
  },
  created() {
    this.$store.dispatch("GET_PROFILE_PICTURE", { token: this.$store.getters.GET_USER_TOKEN })
    this.$store.dispatch("GET_ALL_POSTS")
  }
}
</script>
<style scoped>
.logo-div {
  margin-top: 8%;
  display: flex;
  justify-content: center;
  align-items: center;

}

.logo-instagram {
  margin-top: 8.5%;
  margin-right: 37.5%;
  margin-bottom: 13%;
  cursor: pointer;
}

.avatar-i-div {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.side-div-click {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  color: white;
  width: 90%;
  height: 6%;
  font-size: 95%;
  font-weight: bold;
  justify-content: space-around;
  align-items: center;
  padding: 5%;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 5%;
}

.p-div {
  width: 70%;
}

.side-div-click:hover {
  background-color: hsl(0, 0%, 10%);
}
</style>