<script setup>
import { ref } from 'vue';
import { useToast } from "primevue/usetoast";
import { RouterLink } from 'vue-router';
import { useStore } from 'vuex';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';

const toast = useToast();
const store = useStore();

const name = ref('');
const lastname = ref('');
const email = ref('');
const password = ref('');

// Stan dla dialogu
const dialogVisible = ref(false);
const dialogMessage = ref('');

// Metody
const logValues = () => {
  console.log(name.value);
  console.log(lastname.value);
  console.log(password.value);
  console.log(email.value);
};

const displayValues = async () => {
  const missingFields = [];
  
  if (!name.value) missingFields.push('imię');
  if (!lastname.value) missingFields.push('nazwisko');
  if (!email.value) missingFields.push('email');
  if (!password.value) missingFields.push('hasło');

  if (missingFields.length > 0) {
    dialogMessage.value = `Proszę uzupełnić: ${missingFields.join(', ')}.`;
    dialogVisible.value = true;
  } else {
    const user = { name: name.value, lastName: lastname.value, email: email.value, password: password.value };
  try {
    const response = await store.dispatch('REGISTER_USER', user);
    // Assuming response contains the link
    if (response && response.link) {
      toast.add({ 
        severity: 'info', 
        summary: 'Registration Successful', 
        detail: `Wklej ten link do nowego okna przeglądarki aby potwierdzić konto: ${response.link}`, 
        life: 10000000,
        escape: false
      });
    }
    else if(response.message.startsWith("Użytkownik o podanym adresie email: mm@gmail.com już istnieje")){
      toast.add({ 
        severity: 'error', 
        summary: 'Registration Failed', 
        detail: `${response.message}`, 
        life: 3000,
        escape: false
      });
    }
  } catch (error) {
    toast.add({ 
      severity: 'error', 
      summary: 'Registration Failed', 
      detail: 'Something went wrong. Please try again.', 
      life: 6000 
    });
  }
    console.log(name.value);
    console.log(lastname.value);
    console.log(password.value);
    console.log(email.value);
  }
};
</script>

<template>
  <div class="main-login-container">
   <Toast ref="toast" />
  <Dialog class="custom-dialog":visible.sync="dialogVisible" @hide="dialogVisible = false">
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
              <i class="pi pi-user" />
            </InputIcon>
            <InputText @change="logValues" id="name" v-model="name" type="text" placeholder="Imię" required />
          </IconField>
        </div>
        <div class="field">
          <IconField>
            <InputIcon>
              <i class="pi pi-user" />
            </InputIcon>
            <InputText @change="logValues" id="lastname" v-model="lastname" type="text" placeholder="Nazwisko" required />
          </IconField>
        </div>
        <div class="field">
          <IconField>
            <InputIcon>
              <i class="pi pi-envelope" />
            </InputIcon>
            <InputText @change="logValues" id="email" v-model="email" type="email" placeholder="Email" required />
          </IconField>
        </div>
        <div class="field">
          <IconField>
            <InputIcon>
              <i class="pi pi-key" />
            </InputIcon>
            <InputText @change="logValues" id="password" v-model="password" type="password" placeholder="Hasło" required />
          </IconField>
        </div>
        <Button @click="displayValues" type="submit" label="Zarejestruj się" class="mt-2" />
        <div class="register-section">
          <p class="m-0">Masz już konto?</p>
          <RouterLink :to="`/`">Zaloguj się</RouterLink>
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
  props: ['token'],
  computed: {
    isUsersLoading() {
      return this.$store.getters.GET_USERS_LOADING
    }
  }
}
</script>

<style scoped>
.custom-dialog{
  padding: 45px;
}
</style>
<!-- <script>

export default {
  data() {

    return {
      name: undefined,
      lastname: undefined,
      email: undefined,
      password: undefined,
    }
  },
  methods: {
    logValues() {
      console.log(this.name);
      console.log(this.lastname);
      console.log(this.password);
      console.log(this.email);
    },
    displayValues(){
      if(this.name == undefined || this.name == ''){
        this.confirm1()
      }
      if(this.lastname == undefined || this.lastname == ''){
        this.confirm1()
      }
      if(this.password == undefined || this.password == ''){
        this.confirm1()
      }
      if(this.email == undefined || this.email == ''){
        this.confirm1()
      }
      console.log(this.name);
      console.log(this.lastname);
      console.log(this.password);
      console.log(this.email);
    },
    confirm1(){
    confirm.require({
        message: 'Are you sure you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'Cancel',
        acceptLabel: 'Save',
        accept: () => {
            toast.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
}
  },
};
</script> -->