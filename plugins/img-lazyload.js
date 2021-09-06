import Vue from "vue";
import VueLazyload from "vue-lazyload";

import loading from "@/assets/spinner.gif";

Vue.use(VueLazyload, {
  preLoad: 1.3,
  // error: error,
  loading: loading,
  attempt: 1,
  // set observer to true
  observer: true,

  // optional
  observerOptions: {
    rootMargin: '0px',
    threshold: 0.1
  }
});