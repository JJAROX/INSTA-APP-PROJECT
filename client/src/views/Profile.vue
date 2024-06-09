<script setup>
import { RouterLink, RouterView } from 'vue-router'
import sideBar from '@/components/sideBar.vue'
import profileVue from '@/components/profileVue.vue'
</script>

<template>
  <div class="dashboard-container">
    <sideBar></sideBar>
    <profileVue></profileVue>
  </div>


</template>
<script>
export default {
  data() {

    return {
      selectedFile: null,
      selectedFile2: null,
      visible2: false,
      profilePictureUrl: this.profilePictureLink
    }
  },
  created() {
    this.$store.dispatch("GET_USERS_PICTURES", { token: this.$store.getters.GET_USER_TOKEN })
  }
}
</script>
<style scoped>
html {
  font-size: 14px;
}

body {
  font-family: var(--font-family);
  font-weight: normal;
  background: var(--surface-ground);
  color: var(--text-color);
  padding: 1rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.card {
  background: var(--surface-card);
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}

p {
  line-height: 1.75;
}
</style>