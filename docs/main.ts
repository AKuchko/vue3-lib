import { createApp } from 'vue';
import akUi from '@ak/ui';
import App from './app.vue';

const app = createApp(App);

app.use(akUi);
app.mount('#app');
