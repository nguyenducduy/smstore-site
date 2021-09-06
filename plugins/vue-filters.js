import Vue from 'vue';
import Vue2Filters from 'vue2-filters';

import settings from '@/config/settings';

Vue.use(Vue2Filters, settings.vue2filterOptions);