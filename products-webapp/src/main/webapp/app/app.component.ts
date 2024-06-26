import Vue from 'vue';
import Component from 'vue-class-component';
import Ribbon from '@/core/ribbon/ribbon.vue';
import JhiFooter from '@/core/jhi-footer/jhi-footer.vue';
import JhiNavbar from '@/core/jhi-navbar/jhi-navbar.vue';
import LoginForm from '@/account/login-form/login-form.vue';
import NavbarVertical from '@/core/jhi-navbar/navbar-vertical.vue';

import '@/shared/config/dayjs';

@Component({
  components: {
    ribbon: Ribbon,
    'jhi-navbar': JhiNavbar,
    'login-form': LoginForm,
    'navbar-vertical': NavbarVertical,
    'jhi-footer': JhiFooter,
  },
})
export default class App extends Vue {

  public get authenticated(): boolean {
    return this.$store.getters.authenticated;
  }

}
