<template>
  <div :class="[$style.login_container]">
    <div :class="$style.block">
      <div class="row">
        <div class="col-lg-12">
          <div :class="$style.inner">
            <h3 class="text-3xl text-center m-b-20">OLLI Content Store</h3>
            <div :class="$style.form">
              <a-form class="login-form" :form="form" @submit="onSubmit">
                <a-form-item label="Tài khoản">
                  <a-input
                    ref="usernameInput"
                    v-decorator="[
                      'username',
                      {
                        rules: [
                          {
                            required: true,
                            message: 'Vui lòng nhập tài khoản'
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
                  <a-input
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
                  </a-input>
                </a-form-item>
                <div>
                  <a-button type="link">Quên mật khẩu?</a-button>
                </div>
                <div class="text-right form-actions">
                  <a-button
                    type="primary"
                    htmlType="submit"
                    class="login-form-button width-150"
                    :loading="loading"
                    >Đăng nhập</a-button
                  >
                </div>
              </a-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";
import { Mutation, Getter, Action } from "vuex-class";
// import loginAdmin from "@/apollo/mutations/loginAdmin.gql";

@Component({
  name: 'login-page',
  layout: 'default',
  head() {
    return {
      title: 'Đăng nhập dành cho Partner'
    };
  }
})
export default class LoginPage extends Vue {
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

    // this.form.validateFields(async (err, values) => {
    //   if (!err) {
    //     this.loading = true;

    //     try {
    //       const r = await this.$apollo.mutate({
    //         mutation: loginAdmin,
    //         variables: {
    //           username: values.username,
    //           password: values.password
    //         }
    //       });

    //       console.log(r);
    //       if (r['data']['login_user_admin']['token']) {
    //         const token = r['data']['login_user_admin']['token'];
    //         Vue.ls.set('token', token);
    //         this.$cookiz.set('token', token);

    //         const redirectUrl: any = this.$route.query.redirect || "/admin";
    //         return (window.location.href = `${window.location.protocol}//${window.location.hostname
    //           + (window.location.port ? ":" + window.location.port : "")}${redirectUrl}`);
    //       }

    //       this.loading = false;
    //     } catch (error) {
    //       this.loading = false; 
    //     }
    //   }
    // });
  }

  mounted() {
    this.$nextTick(() => {
      this.$refs.usernameInput.focus();
    });
  }
}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
