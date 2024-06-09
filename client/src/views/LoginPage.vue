<script setup>
import { ref } from 'vue';
import { useToast } from "primevue/usetoast";
import { RouterLink, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';


const toast = useToast();
const store = useStore();
const router = useRouter()
const email = ref('');
const password = ref('');

const dialogVisible = ref(false);
const dialogMessage = ref('');

let usersLoading = store.getters.GET_USERS_LOADING

const logValues = () => {
  console.log(password.value);
  console.log(email.value);
};
console.log(store.getters.GET_TRIED);
if (store.getters.GET_TRIED == true) {
  toast.add({
    severity: 'error',
    summary: 'Login Failed',
    detail: 'Nie tak łatwo cwaniaczku',
    life: 6000
  });
}
const displayValues = async () => {
  const missingFields = [];

  if (!email.value) missingFields.push('email');
  if (!password.value) missingFields.push('hasło');

  if (missingFields.length > 0) {
    dialogMessage.value = `Proszę uzupełnić: ${missingFields.join(', ')}.`;
    dialogVisible.value = true;
  } else {
    const user = { email: email.value, password: password.value }
    try {
      const response = await store.dispatch('LOGIN_USER', user);
      // Assuming response contains the link
      if (response && !response.message) {
        toast.add({
          severity: 'success',
          summary: 'Login Successful',
          detail: `Zalogowano`,
          life: 6000,
          escape: false
        });
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);

      }
      else if (response.message) {
        toast.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: `Konto nie zostało potwierdzone`,
          life: 6000,
          escape: false
        });
      }
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Login Failed',
        detail: 'Something went wrong. Please try again.',
        life: 6000
      });
    }
    console.log(password.value);
    console.log(email.value);
  }
}
</script>

<template>
  <div class="main-login-container">
    <Toast ref="toast" />
    <Dialog class="custom-dialog" :visible.sync="dialogVisible" @hide="dialogVisible = false">
      <template #header>
        <h3>Brakujące dane</h3>
      </template>
      <p>{{ dialogMessage }}</p>
      <template #footer>
        <Button label="Ok" @click="dialogVisible = false" />
      </template>
    </Dialog>
    <div class="logo-section"></div>
    <div class="form-container">
      <img src="../img/instalogo2.png" alt="logo" width="250px">
      <div class="card flex justify-content-center p-fluid">
        <div v-focustrap class="w-full" style="max-width: 20rem">
          <div class="field">
            <IconField>
              <InputIcon>
                <i class="pi pi-envelope" />
              </InputIcon>
              <InputText @change="logValues" id="email" v-model="email" type="email" placeholder="Email" />
            </IconField>
          </div>
          <div class="field">
            <IconField>
              <InputIcon>
                <i class="pi pi-key" />
              </InputIcon>
              <InputText @change="logValues" id="password" v-model="password" type="password" placeholder="Hasło" />
            </IconField>
          </div>
          <Button @click="displayValues" type="submit" label="Zaloguj się" class="mt-2" />
          <div class="register-section">
            <p class="m-0">Nie masz konta?</p>
            <RouterLink :to="`/register`">Zarejestruj się</RouterLink>
            <br>
            <ProgressSpinner v-if="isUsersLoading" style="width: 50px; height: 50px" strokeWidth="8"
              fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
          </div>
        </div>
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
  computed: {
    isUsersLoading() {
      return this.$store.getters.GET_USERS_LOADING
    }
  }
}
</script>