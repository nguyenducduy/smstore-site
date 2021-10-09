<template>
  <div class="mt-8" v-if="product">
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
              <section class="grid grid-cols-1 gap-4 mb-5 md:grid-cols-4" v-if="myFiles.length > 0">
                <template v-for="(image, i) in myFiles">
                  <div :key="i">
                     <a class="rounded-lg hover:opacity-75 " target="_blank">
                        <img class="object-cover w-full h-64 rounded-lg" :src="$helper.getImage(image.path)"/>
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
                allowMultiple="true"
                :maxFiles="1"
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
              <div class="col-lg-6">
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
              <div class="col-lg-3">
                <a-form-item label="Giá">
                  <a-input-number
                    style="width: 100%"
                    :formatter="value => `đ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\đ\s?|(,*)/g, '')"
                    v-decorator="[
                      'price',
                      {
                        rules: [
                          { required: true, message: 'Vui lòng nhập giá sản phẩm' }
                        ]
                      }
                    ]"
                  ></a-input-number>
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
import settings from '@/config/settings'

import updateBanner from '@/gql/mutations/updateBanner.gql'
import fetchBanner from '@/gql/queries/fetchBanner.gql'

@Component({})
export default class PartnerBannerEditForm extends Vue {
  @Getter('users/shopId') shopId

  banner: any = null
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

        try {  
          let bannerItem = {
            store_id: this.shopId,
            link: values.link,
            page: values.page,
            is_active: values.is_active,
            image_path: null
          }

          let bannerPath = this.banner.image_path
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
              bannerPath = response.data[0]
            }
          }

          bannerItem.image_path = bannerPath

          await this.$apollo.mutate({
            mutation: updateBanner,
            variables: {
              id: this.banner.id,
              banner: bannerItem,
            }
          });

          this.loading = false;
          
          await this.$refs.pond.removeFiles()

          // reload images
          this.myFiles = []
          if (bannerPath !== null) {
            this.myFiles.push(bannerPath)
          }

          // delete old file
          if (bannerPath !== this.banner.logo_path) {
            await this.$axios.post(
              `${this.$config.NUXT_ENV_STORAGE_ENDPOINT}/banners/delete`,
              {
                id: this.shopId,
                path: this.banner.image_path
              }
            )
          }

          this.$bus.$emit('banners.reload')
          this.$message.success(`Cập nhật banner thành công`);
        } catch (error) {
          this.loading = false;
        }
      }
    });
  }

  created() {
    this.form = this.$form.createForm(this); 
  }

  async mounted() {
    const r = await this.$apollo.query({
      query: fetchBanner,
      variables: { id: this.$route.params.id },
      fetchPolicy: 'no-cache'
    })

    if (r.data) {
      const banner = r.data.banners_by_pk
      this.banner = banner
     
      this.form = this.$form.createForm(this, {
        mapPropsToFields: () => {
          return {
            page: this.$form.createFormField({
              value: banner.page
            }),
            link: this.$form.createFormField({
              value: banner.link
            }),
            is_Active: this.$form.createFormField({
              value: banner.is_Active
            })
          };
        }
      });

      if (banner.image_path !== null) {
        this.myFiles.push(banner.image_path)
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