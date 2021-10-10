<template>
  <div class="mt-8">
    <a-spin :spinning="loading">
      <a-form :form="form" layout="vertical" :colon="false">
        <div class="row">
          <div class="col-lg-3">
            <!-- General info -->
            <a-form-item v-bind="tailFormItemLayout">
              <h1 class="info-label">
                <span>Thông tin cửa hàng</span>
              </h1>
            </a-form-item>
            <a-form-item
            >
              <section class="grid grid-cols-1 gap-4 mb-5 md:grid-cols-4" v-if="myFiles.length > 0">
                <template v-for="(image, i) in myFiles">
                  <div :key="i">
                     <a class="rounded-lg hover:opacity-75 " target="_blank">
                        <img class="object-cover w-64 rounded-lg" :src="$helper.getImage(image)"/>
                      </a>
                    <a-button icon="delete" size="small" type="danger" class="mt-2" @click="onRemoveImage(i)" />
                  </div>
                </template>
              </section>

              <file-pond
                v-show="myFiles.length < 1"
                ref="pond"
                name="file"
                accepted-file-types="image/jpeg, image/png"
                credits="false"
                allowFileEncode="true"
                allowFileMetadata="true"
                allowMultiple="false"
                :maxFiles="1"
                :instantUpload="false"
              />
            </a-form-item>
            <a-form-item label="Tên cửa hàng">
              <a-input
                allowClear
                v-decorator="[
                  'screen_name',
                  {
                    rules: [
                      { required: true, message: 'Vui lòng nhập tên cửa hàng' }
                    ]
                  }
                ]"
              ></a-input>
            </a-form-item>
            <a-form-item label="Giới thiệu về cửa hàng">
              <a-textarea
                allowClear
                v-decorator="[
                  'description'
                ]"
              ></a-textarea>
            </a-form-item>
            <a-form-item label="Email">
              <a-input
                allowClear
                v-decorator="[
                  'email',
                  {
                    rules: [
                      { required: true, message: 'Vui lòng nhập email cửa hàng' }
                    ]
                  }
                ]"
              ></a-input>
            </a-form-item>
            <a-form-item label="Số điện thoại">
              <a-input
                allowClear
                v-decorator="[
                  'phone_number',
                  {
                    rules: [
                      { required: true, message: 'Vui lòng nhập số điện thoại cửa hàng' }
                    ]
                  }
                ]"
              ></a-input>
            </a-form-item>
            <a-form-item label="Địa chỉ">
              <a-input
                allowClear
                v-decorator="[
                  'address',
                  {
                    rules: [
                      { required: true, message: 'Vui lòng nhập địa chỉ cửa hàng' }
                    ]
                  }
                ]"
              ></a-input>
            </a-form-item>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12 bg-gray-50 save-form-control">
            <a-form-item>
              <a-progress
                v-show="loading"
                type="circle"
                :percent="percent"
                :width="40"
                :stroke-color="{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }"
              />
              <a-button
                class="ml-4 mr-4"
                size="large"
                @click.prevent="form.resetFields()">
                Clear
              </a-button>
              <a-button
                icon="save"
                type="primary"
                size="large"
                :loading="loading"
                @click.prevent="onSubmit"
                >Lưu</a-button
              >
            </a-form-item>
          </div>
        </div>
      </a-form>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Getter } from 'vuex-class'

import updateStore from '@/gql/mutations/updateStore.gql'
import fetchStore from '@/gql/queries/fetchStore.gql'

@Component({})
export default class PartnerSettingEditForm extends Vue {
  @Getter('users/shopId') shopId

  shop: any = null
  
  form: any = {};
  loading: boolean = false;
  hasErrors: any = this.$helper.hasErrors;
  formItemLayout: any = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  };
  tailFormItemLayout: any = {
    wrapperCol: { span: 24 }
  };

  // upload
  myFiles: any = []
  percent: number = 0
  $refs: {
    pond: HTMLFormElement,
  };

  onRemoveImage(index) {
    this.myFiles.splice(index, 1)
  }
  
  async onSubmit(e) {
    e.preventDefault();
    
    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.loading = true;
        
        let logoPath = this.shop.logo_path

        try {  
          // upload files
          const files = await this.$refs.pond.getFiles()
          
          let formData = new FormData();
          if (files.length > 0) {
            files.map((filepondObject, i) => {
              formData.append(`files[${i}]`, filepondObject.file)
            })

            // upload
            const config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              onUploadProgress: e => {
                const uploadPercentage: number = Math.round((e.loaded * 100) / e.total);
                this.percent = uploadPercentage
              }
            }
            const response = await this.$axios.post(
              `${this.$config.NUXT_ENV_STORAGE_ENDPOINT}/logos/upload`,
              formData,
              config
            )
            
            if (response.data) {
              logoPath = response.data[0]
            }
          }
        } catch (error) {
          this.loading = false;
        }

        await this.$apollo.mutate({
          mutation: updateStore,
          variables: {
            id: this.shop.id,
            object: {
              screen_name: values.screen_name,
              description: values.description,
              email: values.email,
              phone_number: values.phone_number,
              address: values.address,
              logo_path: logoPath
            }
          }
        });

        this.loading = false;
        
        await this.$refs.pond.removeFiles()

        // reload images
        this.myFiles = []
        if (logoPath !== null) {
          this.myFiles.push(logoPath)
        }

        // delete old file
        if (logoPath !== this.shop.logo_path) {
          await this.$axios.post(
            `${this.$config.NUXT_ENV_STORAGE_ENDPOINT}/logos/delete`,
            {
              id: this.shopId,
              path: this.shop.logo_path
            }
          )
        }

        this.$message.success(`Cập nhật cửa hàng "${values.screen_name}" thành công`);
      }
    });
  }

  created() {
    this.form = this.$form.createForm(this); 
  }

  async mounted() {
    const r = await this.$apollo.query({
      query: fetchStore,
      variables: { id: this.shopId },
      fetchPolicy: 'no-cache'
    })

    if (r.data) {
      const shop = r.data.stores_by_pk
      this.shop = shop

      this.form = this.$form.createForm(this, {
        mapPropsToFields: () => {
          return {
            screen_name: this.$form.createFormField({
              value: shop.screen_name
            }),
            description: this.$form.createFormField({
              value: shop.description
            }),
            email: this.$form.createFormField({
              value: shop.email
            }),
            phone_number: this.$form.createFormField({
              value: shop.phone_number
            }),
            address: this.$form.createFormField({
              value: shop.address
            }),
          };
        }
      });

      if (shop.logo_path !== null) {
        this.myFiles.push(shop.logo_path)
      }
    }
  }
}
</script>

<style lang="scss">

.ant-card-grid {
  box-shadow: none !important;
}

</style>