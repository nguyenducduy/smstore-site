<template>
  <div class="min-h-screen pt-24 pb-5 font-sans antialiased bg-blue-900">
    <div class="flex flex-col justify-center mx-5 mb-5 space-y-8 sm:w-1/4 sm:m-auto">
      <h1 class="text-4xl font-bold text-center text-yellow-500">Tiệm của tui<span class="text-blue-500"> Partner</span></h1>
        <div class="flex flex-col p-10 space-y-6 bg-white rounded-lg shadow">
          <h1 class="text-xl font-bold text-center">Kích hoạt tài khoản & tiệm</h1>
          <p>
            Vui lòng điền đầy đủ thông tin để chúng tôi dễ dàng hỗ trợ bạn cài đặt và sử dụng hệ thống hiệu quả nhất.
          </p>
          <a-form :form="form" @submit="onSubmit" :layout="formLayout">
            <a-form-item label="Mã kích hoạt" 
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input
                disabled
                v-decorator="[
                  'activated_code',
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Vui lòng nhập mã kích hoạt'
                      }
                    ]
                  }
                ]"
              />
            </a-form-item>
            <a-form-item label="Email"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input
                disabled
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
              />
            </a-form-item>
            <a-form-item label="Tên tiệm"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input
                v-decorator="[
                  'screen_name',
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Vui lòng nhập tên tiệm'
                      }
                    ]
                  }
                ]"
              />
            </a-form-item>
            <a-form-item label="Tên miền"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              extra="ten_mien.tiemcuatui.com"
            >
              <a-input
                v-decorator="[
                  'name',
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Vui lòng nhập tên miền'
                      }
                    ]
                  }
                ]"
              />
            </a-form-item>
            <a-form-item class="text-center">
              <a-button
                type="primary"
                htmlType="submit"
                :loading="loading"
                >Đăng ký</a-button>
            </a-form-item>
          </a-form>
        </div>
      <div class="flex justify-center text-sm text-gray-100">
        <p>&copy;2021. tiemcuatui.com</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";
import { Mutation, Getter, Action } from "vuex-class";

import registerUser from "@/gql/mutations/registerUser.gql";

@Component({
  name: 'partner-activate-page',
  layout: 'default',
  head() {
    return {
      title: 'Kích hoạt tài khoản Partner'
    };
  }
})
export default class PartnerActivatePage extends Vue {
  @Getter("users/isAuth") isAuth;

  formLayout: string = 'horizontal'
  formItemLayout: any = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }

  form: any = {};
  loading: boolean = false;
  isOke: boolean = false;

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
    //         mutation: registerUser,
    //         variables: {
    //           full_name: values.full_name,
    //           email: values.email,
    //           phone_number: values.phone_number
    //         }
    //       });

    //       if (r['data']['register_user'] && r['data']['register_user']['ok'] === true) {
    //         this.isOke = true
    //       }

    //       this.loading = false;
    //     } catch (error) {
    //       this.loading = false; 
    //     }
    //   }
    // });
  }

  mounted() {
    this.form = this.$form.createForm(this, {
        mapPropsToFields: () => {
          return {
            activated_code: this.$form.createFormField({
              value: this.$route.query.c
            }),
            email: this.$form.createFormField({
              value: this.$route.query.e
            })
          };
        }
      });
  }
}
</script>
