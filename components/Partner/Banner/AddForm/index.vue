<template>
  <div class="mt-8">
    <a-spin :spinning="loading">
      <a-form :form="form" layout="vertical" :colon="false">
        <div class="row">
          <div class="col-lg-6">
            <!-- General info -->
            <a-form-item v-bind="tailFormItemLayout">
              <h1 class="info-label">
                <span>Thông tin cơ bản</span>
              </h1>
            </a-form-item>
            <a-form-item
            >
              <file-pond
                ref="pond"
                name="file"
                accepted-file-types="image/jpeg, image/png"
                credits="false"
                allowFileEncode="true"
                allowFileMetadata="true"
                allowMultiple="true"
                maxFiles="1"
                :instantUpload="false"
              />
            </a-form-item>
            <div class="row">
              <div class="col-lg-6">
                <a-form-item
                  label="Trang hiển thị"
                >
                  <a-select
                    v-decorator="[
                      'page',
                      {
                        rules: [
                          {
                            required: true,
                            message: 'Vui lòng chọn trang hiển thị'
                          }
                        ]
                      },
                      { initialValue: [] }
                    ]"
                    placeholder="Chọn trang hiển thị"
                  >
                    <a-select-option :value="bp.value" v-for="(bp, i) in bannerPages" :key="i">
                      {{ bp.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div class="col-lg-3">
                <a-form-item label="Hiển thị?">
                  <a-switch v-decorator="['is_active', { valuePropName: 'checked', initialValue: true }]" />
                </a-form-item>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12">
                <a-form-item label="Đường dẫn thực thi">
                  <a-input
                    allowClear
                    v-decorator="[
                      'link',
                      {
                        rules: [
                          { required: true, message: 'Vui lòng nhập đường dẫn thực thi' }
                        ]
                      }
                    ]"
                  ></a-input>
                </a-form-item>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12 bg-blue-50 save-form-control">
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
              <a-button class="ml-4" size="large" @click.prevent="form.resetFields()"
                >Clear</a-button
              >
              <a-button
                class="ml-4"
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
import settings from '@/config/settings'

import insertBanner from '@/gql/mutations/insertBanner.gql'

@Component({})
export default class PartnerBannerAddForm extends Vue {
  @Getter('users/shopId') shopId

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

  // banner pages
  bannerPages = settings.bannerPages

  // upload
  percent: number = 0
  $refs: {
    pond: HTMLFormElement,
  };
  
  async onSubmit(e) {
    e.preventDefault();
    
    this.form.validateFields(async (err, values) => {
      if (!err) {         
        this.loading = true;

        try {  
          let bannerItem = {
            store_id: this.shopId,
            link: values.link,
            page: values.page,
            is_active: values.is_active,
            image_path: null
          }

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
              `${this.$config.NUXT_ENV_STORAGE_ENDPOINT}/banners/upload`,
              formData,
              config
            )

            if (response.data) {
              bannerItem['image_path'] = response.data[0]
            }
          }

          await this.$apollo.mutate({
            mutation: insertBanner,
            variables: {
              object: bannerItem
            }
          });

          await this.$refs.pond.removeFiles()
          this.$message.success(`Banner đã được thêm`)
          this.$bus.$emit('banners.reload')
          this.loading = false;
        } catch (error) {
          this.loading = false;
        }
      }
    });
  }

  created() {
    this.form = this.$form.createForm(this); 
  }
}
</script>

<style lang="scss">

.ant-card-grid {
  box-shadow: none !important;
}
</style>