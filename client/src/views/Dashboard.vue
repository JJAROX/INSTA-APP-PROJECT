<script setup>
import { RouterLink, RouterView } from 'vue-router'
import sideBar from '@/components/sideBar.vue'
import scrollDash from '@/components/scrollDash.vue'
import { useStore } from 'vuex';

const store = useStore()

store.commit("CLEAR_CURRENT_USER_PHOTOS")
</script>

<template>
  <div class="dashboard-container">
    <sideBar></sideBar>
    <scrollDash></scrollDash>
  </div>


</template>
<script>
export default {
  data() {
    return {

    }
  },
  computed: {
    isUsersLoading() {
      return this.$store.getters.GET_USERS_LOADING
    }
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