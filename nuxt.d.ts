import { WebStorage } from "vue-ls";
import { notification, Form, message } from "ant-design-vue";

declare global {
  interface Window {
    stream: any;
    AudioContext: any;
    webkitAudioContext: any;
  }
}

declare module "vue/types/vue" {
  // Global properties can be declared
  // on the `VueConstructor` interface
  interface VueConstructor {
    $apollo: any;
    $axios: any;
    $apolloHelpers: any;
    $cookiz: any;
    $auth: any;
    $bus: any;
    $nprogress: any;
    $form: Form;
    $notification: typeof notification;
    $message: typeof message;
    router: any;
    ls: WebStorage;
    $helper: any;
    $moment: any;
  }

  interface Vue {
    $apollo: any;
    $axios: any;
    $apolloHelpers: any;
    $cookiz: any;
    $auth: any;
    $bus: any;
    $nprogress: any;
    $form: Form;
    $notification: typeof notification;
    $message: typeof message;
    router: any;
    ls: WebStorage;
    $helper: any;
    $moment: any;
  }
}
