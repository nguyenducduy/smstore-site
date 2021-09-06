import Vue from 'vue'
import VueStorage from "vue-ls";
import settings from '@/config/settings'

//local storage helper
Vue.use(VueStorage, settings.storageOptions);