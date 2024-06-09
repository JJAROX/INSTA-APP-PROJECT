<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import FileUpload from 'primevue/fileupload';
import { usePrimeVue } from 'primevue/config';

const $primevue = usePrimeVue();

const totalSize = ref(0);
const totalSizePercent = ref(0);
const files = ref([]);

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
  removeFileCallback(index);
  totalSize.value -= parseInt(formatSize(file.size));
  totalSizePercent.value = totalSize.value / 10;
};

const onClearTemplatingUpload = (clear) => {
  clear();
  totalSize.value = 0;
  totalSizePercent.value = 0;
};

const onSelectedFiles = (event) => {
  files.value = event.files;
  files.value.forEach((file) => {
    totalSize.value += parseInt(formatSize(file.size));
  });
};

const uploadEvent = (callback) => {
  totalSizePercent.value = totalSize.value / 10;
  callback();
};

const onTemplatedUpload = () => {
  toast.add({ severity: "info", summary: "Success", detail: "File Uploaded", life: 3000 });
};

const formatSize = (bytes) => {
  const k = 1024;
  const dm = 3;
  const sizes = $primevue.config.locale.fileSizeTypes;

  if (bytes === 0) {
    return `0 ${sizes[0]}`;
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${formattedSize} ${sizes[i]}`;
};
const name = ref('')
const lastName = ref('')
let visible = ref(false);
let visible2 = ref(false);
let visible3 = ref(false);
const store = useStore()
const router = useRouter()
const dialogVisible = ref(false);
const dialogMessage = ref('');
const toast = useToast();
const displayValues = async () => {
  console.log(store.getters.GET_USER_TOKEN);
  const missingFields = [];
  visible = false
  if (!name.value) missingFields.push('imię');
  if (!lastName.value) missingFields.push('nazwisko');

  if (missingFields.length > 0) {
    dialogMessage.value = `Proszę uzupełnić: ${missingFields.join(', ')}.`;
    dialogVisible.value = true;
  } else {
    const user = { name: name.value, lastname: lastName.value }
    try {
      const response = await store.dispatch('EDIT_PROFILE', { object: user, token: store.getters.GET_USER_TOKEN });
      // Assuming response contains the link
      if (response) {
        toast.add({
          severity: 'success',
          summary: 'Profile Edited',
          detail: `Zaktualizowano profil`,
          life: 6000,
          escape: false
        });
        setTimeout(() => {
          router.push('/');
        }, 1000);

      }
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Profile Edit Failed',
        detail: 'Something went wrong. Please try again.',
        life: 6000
      });
    }
  }
}


</script>
<template>
  <Toast ref="toast" />
  <Dialog v-model:visible="visible" modal header="Edytuj profil" :style="{ width: '25rem', padding: '2rem' }">
    <span class="p-text-secondary block mb-5"
      style="color: rgb(100, 100, 100); display: block; margin-bottom: 15px;">Zaktualizuj twoje
      informacje.</span>
    <div class="flex align-items-center gap-3 mb-3"
      style="display: flex; align-items: center; gap: 3px; margin-bottom: 15px; ">
      <label for="name" class="font-semibold w-6rem" style="font-weight: bold; width: 6rem;">Imię</label>
      <InputText v-model="name" id="name" class="flex-auto" style="flex: auto;" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-5"
      style="display: flex; align-items: center; gap: 3px; margin-bottom: 15px;">
      <label for="surname" class="font-semibold w-6rem" style="font-weight: bold; width: 6rem;">Nazwisko</label>
      <InputText v-model="lastName" id="surname" class="flex-auto" style="flex: auto;" autocomplete="off" />
    </div>
    <ProgressSpinner v-if="isUsersLoading" style="width: 25px; height: 25px" strokeWidth="8"
      fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    <div class="flex justify-content-end gap-2" style="display: flex; justify-content: flex-end; gap: 2px;">
      <Button type="button" label="Anuluj" severity="secondary" @click="visible = false" style="padding: 5px;"></Button>
      <Button type="button" label="Zapisz" @click="displayValues" style="padding: 5px;"></Button>
    </div>
  </Dialog>


  <Dialog v-model:visible="visible2" modal header="Zmień zdjęcie profilowe"
    :style="{ width: '25rem', padding: '2rem', display: 'flex', justifyContent: 'center' }">
    <span class="p-text-secondary block mb-5"
      style="color: rgb(100, 100, 100); display: block; margin-bottom: 15px;">Zaktualizuj twoje
      informacje.</span>
    <!-- <FileUpload @uploader="handleFileUpload" style="padding: 2.5%;" mode="basic" name="file"
      url="http://localhost:3000/api/profile" accept="image/*" required /> -->
    <input type="file" name="file" id="file" @change="handleFileUpload">
    <ProgressSpinner v-if="isUsersLoading" style="width: 25px; height: 25px" strokeWidth="8"
      fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    <div class="flex justify-content-end gap-2" style="display: flex; justify-content: flex-end; gap: 2px;">
      <Button type="button" label="Anuluj" severity="secondary" @click="visible2 = false"
        style="padding: 5px;"></Button>
      <Button type="button" label="Zapisz" @click="uploadFile" style="padding: 5px;"></Button>
    </div>
  </Dialog>
  <Dialog v-model:visible="visible3" modal header="Udostępnij zdjęcie"
    :style="{ width: '25rem', padding: '2rem', display: 'flex', justifyContent: 'center' }">
    <!-- <FileUpload @uploader="handleFileUpload" style="padding: 2.5%;" mode="basic" name="file"
      url="http://localhost:3000/api/profile" accept="image/*" required /> -->
    <input type="file" name="file" id="file" @change="handleFileUpload2">
    <ProgressSpinner v-if="isUsersLoading" style="width: 25px; height: 25px" strokeWidth="8"
      fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    <div class="flex justify-content-end gap-2" style="display: flex; justify-content: flex-end; gap: 2px;">
      <Button type="button" label="Anuluj" severity="secondary" @click="visible3 = false"
        style="padding: 5px;"></Button>
      <Button type="button" label="Zapisz" @click="uploadFile2" style="padding: 5px;"></Button>
    </div>
  </Dialog>
  <div class="profile-vue-container">
    <div class="profile-info-container">
      <div class="profile-picture-section">
        <div class="avatar-i-div">
          <img @click="visible2 = true" :src="profilePictureLink" alt="default" height="150" width="150">
        </div>
      </div>
      <div class="profile-info-section">
        <div class="edit-profile-row">
          <p v-if="user.name">
            {{ user.name + ' ' + user.lastName }}
          </p>
          <p v-else>username</p>
          <div>
            <Button label="Show" @click="visible = true">Edytuj profil</Button>
          </div>
        </div>
        <div class="info-profile-row">
          <p>Posty: {{ usersPhotos.length }}</p>
        </div>
      </div>
    </div>
    <div v-if="usersPhotos.length == 0" class="profile-pictures-container" style="flex-direction: column;">
      <h1>Udostępnij zdjęcia</h1>
      <p>Gdy udostępniasz zdjęcia, pojawiają się one na Twoim profilu.</p>
      <button @click="visible3 = true">Udostępnij zdjęcie</button>
    </div>
    <div v-else-if="usersPhotos.length > 0" class="profile-pictures-container">
      <button @click="visible3 = true">Udostępnij zdjęcie</button>
      <div class="in-pictures-container">
        <div v-for=" photo in usersPhotos" class="photo-div">
          <Image :src="getPhotoSrc(photo)" alt=" photo" preview width="275px" height="275px" />
        </div>
      </div>

    </div>
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
  methods: {
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0]
      console.log(event.target.files[0]);
      console.log(this.profilePictureLink);
    },
    handleFileUpload2(event) {
      this.selectedFile2 = event.target.files[0]
      console.log(event.target.files[0]);
      console.log(this.usersPhotos);
    },
    async uploadFile() {
      if (!this.selectedFile) {
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file', life: 3000 });
        return;
      }
      const formData = new FormData();
      formData.append('file', this.selectedFile)
      try {
        const response = await this.$store.dispatch('EDIT_PROFILE_PICTURE', { formData: formData, token: this.$store.getters.GET_USER_TOKEN })
        console.log(response);
        this.profilePictureUrl = `http://localhost:3000/${response.url.replace(/\\/g, '/')}`
        console.log(this.profilePictureUrl);
        this.$toast.add({ severity: 'success', summary: 'Success', detail: 'File uploaded successfully', life: 3000 });
        setTimeout(() => {
          location.reload()
        }, 1000);

      } catch (error) {
        console.error(error);
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'File upload failed', life: 3000 });
      }
    },
    async uploadFile2() {
      if (!this.selectedFile2) {
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file', life: 3000 });
        return;
      }
      const formData = new FormData();
      formData.append('file', this.selectedFile2)
      try {
        const response = await this.$store.dispatch('POST_IMAGE', { formData: formData, token: this.$store.getters.GET_USER_TOKEN })
        console.log(response);
        this.$toast.add({ severity: 'success', summary: 'Success', detail: 'File uploaded successfully', life: 3000 });
      } catch (error) {
        console.error(error);
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'File upload failed', life: 3000 });
      }
    },
    getPhotoSrc(photo) {
      if (photo && typeof photo === 'string') {
        return `http://localhost:3000/${photo.replace(/\\/g, '/')}`;
      }
      return 'src/img/default-user.png'
    }
  },
  computed: {
    user() {
      return this.$store.getters.GET_CURRENT_USER;
    },
    usersPhotos() {
      console.log(this.$store.getters.GET_CURRENT_USER_PHOTOS);
      return this.$store.getters.GET_CURRENT_USER_PHOTOS
    },
    profilePictureLink() {
      const currentPP = this.$store.getters.GET_CURRENT_PP
      console.log(currentPP)
      if (typeof currentPP === 'string' && currentPP !== '' && currentPP !== 'profile picture not found') {
        return `http://localhost:3000/${currentPP.replace(/\\/g, '/')}`;
      } else {
        return `src/img/default-user.png`;
      }
    },
    isUsersLoading() {
      return this.$store.getters.GET_USERS_LOADING
    }
  },
  created() {
    this.$store.dispatch("GET_PROFILE_PICTURE", { token: this.$store.getters.GET_USER_TOKEN })
  }
}
</script>
<style scoped>
.profile-info-container {
  width: 70%;
  height: 350px;
  background-color: black;
  display: flex;
  flex-direction: row;
  color: white;
}

.profile-pictures-container {
  border-top: 1px solid rgb(49, 49, 49);
  margin-top: 2%;
  width: 70%;
  height: 350px;
  background-color: black;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

}

.profile-pictures-container button {
  border: none;
  background-color: transparent;
  color: rgb(0, 110, 255);
  font-weight: bold;
  cursor: pointer;
}

.profile-pictures-container button:hover {
  color: white;
}

.profile-pictures-container>* {
  margin-top: 15px;
}

.profile-picutres-container-2 .photo-div {}

.profile-picture-section {
  width: 33%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-picture-section img:hover {
  transition: 0.5s;
  cursor: pointer;
  height: 165px;
  width: 165px;
}

.profile-picture-section img {
  transition: 0.5s;
  border-radius: 100%;
}

.profile-info-section {
  margin-top: 5%;
  width: 66%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 3%;
}

.edit-profile-row {
  width: 100%;
  height: fit-content;
  align-items: center;
  justify-content: flex-start;
  display: flex;
  flex-direction: row;
  gap: 2.5%;
}

.edit-profile-row button {
  border: none;
  background-color: hsl(0, 0%, 30%);
  color: white;
  padding-inline: 12px;
  padding-block: 8px;
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;
}

.edit-profile-row button:hover {
  background-color: hsl(0, 0%, 20%);
}

.in-pictures-container {
  display: flex;
  width: 100%;
  height: fit-content;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 1%;
}

.photo-div {
  width: 17.188rem;
  height: 17.188rem;
  background-color: white;
  margin-bottom: 1%;
}

.photo-div img {
  width: 100%;
  height: 100%;
}
</style>