<template>
  <div class="min-h-screen pt-24 pb-5 font-sans antialiased bg-black">
    <div class="flex flex-col justify-center mx-5 mb-5 space-y-8 sm:w-1/2 sm:m-auto lg:w-1/3 xl:w-1/4 md:w-1/2">
      <h1 class="text-4xl font-bold text-center text-yellow-300">Tiệm của tui<span class="text-blue-500"> Partner</span></h1>
        <div class="flex flex-col p-10 space-y-6 bg-white rounded-lg shadow">
          <h1 class="text-xl font-bold text-center">Đăng nhập tài khoản Partner</h1>
          <a-form class="login-form" :form="form" @submit="onSubmit">
            <a-form-item label="Email">
              <a-input
                v-decorator="[
                  'email',
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Vui lòng nhập email'
                      }
                    ]
                  }
                ]"
              >
                <a-icon
                  slot="prefix"
                  type="user"
                  style="color: rgba(0,0,0,.25);"
                />
              </a-input>
            </a-form-item>
            <a-form-item label="Mật khẩu">
              <a-input-password
                type="password"
                v-decorator="[
                  'password',
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Vui lòng nhập mật khẩu'
                      }
                    ]
                  }
                ]"
              >
                <a-icon
                  slot="prefix"
                  type="lock"
                  style="color: rgba(0,0,0,.25);"
                />
              </a-input-password>
            </a-form-item>
            <a-form-item>
              <a-button type="link">Quên mật khẩu?</a-button>
              <a-button
                size="large"
                type="primary"
                htmlType="submit"
                :loading="loading"
                >Đăng nhập</a-button
              >
            </a-form-item>
          </a-form>
        </div>
      <div class="flex justify-center text-sm text-gray-500">
        <p>&copy; 2021 tiemcuatui.com</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";
import { Mutation, Getter, Action } from "vuex-class";

import loginPartner from "@/gql/queries/loginPartner.gql";
import fetchStore from '@/gql/queries/fetchStore.gql'

@Component({
  name: 'partner-login-page',
  layout: 'default',
  head() {
    return {
      title: 'Đăng nhập tài khoản Partner'
    };
  }
})
export default class PartnerLoginPage extends Vue {
  @Getter("users/isAuth") isAuth;

  form: any = {};
  loading: boolean = false;
  $refs: {
    usernameInput: HTMLFormElement;
  };

  created() {
    if (this.isAuth) {
      this.$router.push("/partner");
    }

    this.form = this.$form.createForm(this);
  }

  onSubmit(e) {
    e.preventDefault();

    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.loading = true;

        try {
          const r = await this.$apollo.query({
            query: loginPartner,
            variables: {
              email: values.email,
              password: values.password
            }
          });

          if (r['data']['login_partner']['token']) {
            const token = r['data']['login_partner']['token'];
            Vue.ls.set('token', token);
            this.$cookiz.set('token', token);

            const redirectUrl: any = this.$route.query.redirect || "/partner";
            return (window.location.href = `${window.location.protocol}//${window.location.hostname
              + (window.location.port ? ":" + window.location.port : "")}${redirectUrl}`);
          }

          this.loading = false;
        } catch (error) {
          this.loading = false; 
        }
      }
    });
  }
}
</script>
