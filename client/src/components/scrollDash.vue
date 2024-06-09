<script setup>
</script>
<template>
  <div class="scroll-dash-container">
    <div class="heading">
      <h1>Posty</h1>
      <!-- <button @click="logPosts(posts)">lognij kurwa postaees</button> -->
    </div>
    <div class="main-posts-container">
      <div v-if="posts.length > 0" v-for="post in posts" class="post-container">
        <div class="post-heading">
          <img :src="getPhotoSrc(post.profileUrl)" alt="aaa" height="50" width="50">
          <div class="account-info">
            <h5>{{ post.name }}{{ post.lastName }}</h5>
            <p>{{ getTimeDifference(post.id) }}</p>
          </div>
        </div>
        <img :src="getPhotoSrc(post.url)" alt="photo" class="main-image">
        <div class="photo-info">
          <p>{{ post.originalName }}</p>
        </div>
      </div>
      <div v-else class="main-posts-container">
        <p>Nie ma jeszcze postów</p>
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
    logPosts(object) {
      console.log(object);
    },
    getPhotoSrc(photo) {
      if (photo && typeof photo === 'string') {
        return `http://localhost:3000/${photo.replace(/\\/g, '/')}`;
      }
      return 'src/img/default-user.png'
    },
    getTimeDifference(timestamp) {
      const now = Date.now();
      const timeDifference = now - timestamp;

      const seconds = Math.floor(timeDifference / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        if (days == 1) {
          return `${days} day ago`;
        } else {
          return `${days} days ago`;
        }

      } else if (hours > 0) {
        if (hours == 1) {
          return `${hours} hour ago`;
        } else {
          return `${hours} hours ago`;
        }
      } else if (minutes > 0) {
        if (minutes == 1) {
          return `${minutes} minute ago`;
        } else {
          return `${minutes} minutes ago`;
        }
      } else {
        if (seconds == 1) {
          return `${seconds} second ago`;
        } else {
          return `${seconds} seconds ago`;
        }
      }
    }
  },
  computed: {
    posts() {
      return this.$store.getters.GET_ALLPOSTS
    },
    isUsersLoading() {
      return this.$store.getters.GET_USERS_LOADING
    }
  },
}
</script>
<style scoped>
.heading {
  margin-top: 5%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.main-posts-container {
  margin-top: 2.5%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column-reverse;
  width: 50%;
  background-color: black;
  height: fit-content;
  /* overflow-y: scroll; */
}

.post-container {
  background-color: black;
  height: 550px;
  width: 65%;
  margin-bottom: 2.5%;
  border: 1px solid rgb(49, 49, 49);
}

.post-heading {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 10%;
  background-color: black;
}

.post-heading img {
  margin-left: 2.5%;
  max-width: 70%;
  max-height: 70%;
  width: auto;
  height: auto;
  object-fit: cover;
  border-radius: 100%;

}

.account-info {
  margin-left: 2.5%;
  max-height: 100%;
  max-width: 100%;
  display: flex;
  width: auto;
  height: auto;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  object-fit: cover;
  flex-wrap: wrap;
  gap: 0.5%;
}

.main-image {
  height: 80%;
  width: 100%;
  background-color: transparent;
}

.photo-info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 2.5%;
  height: 10%;
  width: 100%;
}
</style>