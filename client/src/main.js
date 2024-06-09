import './assets/main.css'
import { createApp } from 'vue';
import store from './store/index.js'
import Avatar from 'primevue/avatar';
import PrimeVue from 'primevue/config';
import FocusTrap from 'primevue/focustrap';
import InputText from 'primevue/inputtext';
import InputIcon from 'primevue/inputicon';
import IconField from 'primevue/iconfield'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import InputGroup from 'primevue/inputgroup'
import Image from 'primevue/image';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Ripple from 'primevue/ripple';
import StyleClass from 'primevue/styleclass';
import Dialog from 'primevue/dialog';
import FileUpload from 'primevue/fileupload';
import ProgressSpinner from 'primevue/progressspinner';
import 'primevue/resources/themes/aura-light-noir/theme.css'
import 'primeicons/primeicons.css'
import App from './App.vue'
import router from './router'
const app = createApp(App)

app.use(router)
app.use(PrimeVue);
app.use(ToastService);
app.use(ConfirmationService);
app.use(store)
app.directive('ripple', Ripple);
app.directive('focustrap', FocusTrap);
app.directive('styleclass', StyleClass)
app.component('Avatar', Avatar);
app.component('ProgressSpinner', ProgressSpinner)
app.component('InputText', InputText);
app.component('InputIcon', InputIcon);
app.component('IconField', IconField);
app.component('Checkbox', Checkbox)
app.component('Button', Button)
app.component('Dialog', Dialog)
app.component('FileUpload', FileUpload)
app.component('InputGroup', InputGroup)
app.component('Image', Image)
app.component('Toast', Toast)
app.component('ConfirmDialog', ConfirmDialog)
app.mount('#app')