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
                maxFiles="4"
                :instantUpload="false"
              />
            </a-form-item>
            <div class="row">
              <div class="col-lg-6">
                <a-form-item
                  label="Danh mục"
                >
                  <a-tree-select
                    v-decorator="[
                      'category_id',
                      {
                        rules: [
                          {
                            required: true,
                            message: 'Vui lòng chọn danh mục'
                          }
                        ]
                      },
                      { initialValue: [] }
                    ]"
                    placeholder="Chọn danh mục"
                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                    treeDefaultExpandAll
                    :replaceFields="replaceFields"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    :tree-data="categories"
                    tree-default-expand-all
                    allow-clear
                  ></a-tree-select>
                </a-form-item>
              </div>
              <div class="col-lg-3">
                <a-form-item label="Hiển thị?">
                  <a-switch v-decorator="['is_active', { valuePropName: 'checked', initialValue: true }]" />
                </a-form-item>
              </div>
              <div class="col-lg-3">
                <a-form-item label="Còn hàng?">
                  <a-switch v-decorator="['in_stock', { valuePropName: 'checked', initialValue: true }]" />
                </a-form-item>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-6">
                <a-form-item label="Tên SP">
                  <a-input
                    allowClear
                    v-decorator="[
                      'name',
                      {
                        rules: [
                          { required: true, message: 'Vui lòng nhập tên sản phẩm' }
                        ]
                      }
                    ]"
                  ></a-input>
                </a-form-item>
              </div>
              <div class="col-lg-3">
                <a-form-item label="SKU">
                  <a-input
                    allowClear
                    v-decorator="[
                      'sku'
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
            <div class="row">
              <div class="col-lg-12">
                <editor
                  ref="editor"
                  :options="editorOptions" 
                  initialEditType="wysiwyg"
                  height="800px"
                />
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <!-- Options info -->
            <a-form-item v-bind="tailFormItemLayout">
              <h1 class="info-label">
                <span>Tùy chọn</span>
              </h1>
            </a-form-item>
            <div class="mb-10 row">
              <div class="flex gap-2 mb-4 col-lg-12">
                <a-input @keyup.enter="addOption" type="text" v-model="newOptionName" placeholder="Tên tùy chọn"></a-input>
                <a-button type="primary" @click="addOption">Thêm</a-button>
              </div>
              <div class="mt-2 col-lg-12" v-if="options.length > 0">
                <div v-for="option, i in options" :key="i" class="mb-4 row">
                  <div class="flex gap-2 mb-4 col-lg-12">
                    <a-input v-model="option.name"></a-input>
                    <a-button icon="plus" type="dashed" @click="addOptionValue(i)">Thêm giá trị</a-button>
                    <a-button icon="minus" type="dashed" @click="removeOption(i)">Xóa</a-button>
                  </div>
                  <div class="flex gap-2 pb-2 bg-gray-50 col-lg-12" v-for="value, k in option.values" :key="k">
                    <a-input v-model="value.val" @keyup.enter="addOptionValue(i)"></a-input>
                    <a-select v-model="value.mode" placeholder="Tăng/Giảm" style="width: 200px">
                      <a-select-option value="inc">
                        + Tăng
                      </a-select-option>
                      <a-select-option value="dec">
                        - Giảm
                      </a-select-option>
                    </a-select>
                    <a-input-number
                      style="width: 300px"
                      v-model="value.price"
                      suffix="đ"
                      :formatter="value => `đ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                      :parser="value => value.replace(/\đ\s?|(,*)/g, '')"
                    ></a-input-number>
                    <a-button type="link" icon="minus" @click="removeOptionValue(i, k)"></a-button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Attributes info -->
            <a-form-item v-bind="tailFormItemLayout">
              <h1 class="info-label">
                <span>Thuộc tính</span>
              </h1>
            </a-form-item>
            <div v-if="types === null || types.length === 0">
              <a-alert class="mb-4" type="error" message="Vui lòng vào Sản phẩm > Thuộc tính để tạo Loại sản phẩm và Thuộc tính" banner/>
                <br/>
            </div>
            <a-form-item label="Chọn loại SP" v-if="types && types.length > 0">
              <a-select @change="onSelectType" v-model="type_selected">
                <a-select-option :value="i" v-for="type, i in types" :key="i">
                  {{ type.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <div v-if="type_selected_values.length > 0">
              <template v-for="attr, i in type_selected_values">
                <a-form-item :key="i" v-bind="formItemLayout" :label="attr['name']">
                  <a-input type="text" v-decorator="[
                    `attrs[${attr['id']}]`
                  ]"></a-input>
                </a-form-item>
              </template>
            </div>
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

import insertProduct from '@/gql/mutations/insertProduct.gql'
import fetchProductCategories from '@/gql/queries/fetchProductCategories.gql'
import fetchProductTypes from '@/gql/queries/fetchProductTypes.gql'

@Component({

})
export default class PartnerProductAddForm extends Vue {
  @Getter('users/shopId') shopId

  categories: any = null
  types: any = null
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
  percent: number = 0
  $refs: {
    pond: HTMLFormElement,
    editor: any
  };

  // attributes
  type_selected: any = null
  type_selected_values : any = []
  attrs: any = []

  // categories
  replaceFields: any = {
    children: "children",
    title: "name",
    key: "id",
    value: "id"
  };
  
  // editor
  editorOptions = settings.editorOptions

  // product options
  newOptionName: string = ''
  options: any = []
  
  onSelectType(value) {
    this.attrs = []
    this.type_selected_values = this.types[value]['attributes']    
  }

  addOption(key) {
    if (this.newOptionName.length === 0) {
      return this.$message.warning('Vui lòng nhập tên tùy chọn')
    }
    
    this.options.push({
      'name': this.newOptionName,
      'values': []
    })

    this.newOptionName = ''
  }

  removeOption(key) {
    this.options.splice(key, 1)
  }

  addOptionValue(key) {    
    this.options[key]['values'].push({
      'val': '',
      'mode': '',
      'price': ''
    })
  }

  removeOptionValue(keyOption, keyValue) {
    this.options[keyOption]['values'].splice(keyValue, 1)
  }

  async onSubmit(e) {
    e.preventDefault();
    
    this.form.validateFields(async (err, values) => {
      if (!err) {
        if (this.options.length == 0) {
          return this.$message.warning(`Vui lòng nhập ít nhất 1 tùy chọn cho sản phẩm`)
        } 

        this.options.map(option => {
          if (option['values'].length > 0) {
            option['values'].map(value => {
              if (value['val'].length === 0) {
                return this.$message.warning(`Vui lòng nhập giá trị cho tùy chọn ${option['name']}`)
              }
            })
          } else {
            return this.$message.warning(`Vui lòng nhập giá trị cho tùy chọn ${option['name']}`)
          }
        })
        
        try {  
          let productItem = {
            store_id: this.shopId,
            name: values.name,
            slug: `${this.$helper.getSlug(values.name)}-${this.shopId}`,
            options: this.options,
            description: this.$helper.replaceBRWithEmptyBlock(this.$refs.editor.invoke('getHTML')),
            category_id: values.category_id,
            is_active: values.is_active,
            in_stock: values.in_stock,
            price: values.price,
            sku: values.sku,
          }
          
          if (typeof values.attrs !== 'undefined') {
            productItem['type_id'] = this.types[this.type_selected]['id']
            productItem['product_attributes'] = {
              data: []
            }

            values.attrs.map((attr_value, attr_id) => {
              productItem['product_attributes']['data'].push({
                attribute_id: attr_id,
                store_id: this.shopId,
                value: typeof attr_value !== 'undefined' ? attr_value : ''
              })
            })
          } else {
            return this.$message.warning(`Vui lòng nhập Thuộc tính sản phẩm`)
          }

          this.loading = true;

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
              `${this.$config.NUXT_ENV_STORAGE_ENDPOINT}/products/upload`,
              formData,
              config
            )

            if (response.data) {
              productItem['images'] = {}
              productItem['images']['data'] = []

              response.data.map(path => {  
                productItem['images']['data'].push({
                  store_id: this.shopId,
                  path: path
                })
              })
            }
          }

          await this.$apollo.mutate({
            mutation: insertProduct,
            variables: {
              object: productItem
            }
          });

          await this.$refs.pond.removeFiles()
          this.$message.success(`Sản phẩm "${values.name}" đã được thêm`)
          this.$bus.$emit('products.reload')
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

  async mounted() {
    await this._reload()
  }

  async _reload() {
    let r = null
    r = await this.$apollo.query({
      query: fetchProductCategories
    })

    this.$apollo.addSmartQuery('categories', { query: fetchProductCategories })
    this.categories = r.data.categories

    r = await this.$apollo.query({
      query: fetchProductTypes
    })

    this.$apollo.addSmartQuery('types', { query: fetchProductTypes })
    this.types = r.data.types
  }
}
</script>

<style lang="scss">
.filepond--item {
    width: calc(25% - 0.5em);
}
.ant-card-grid {
  box-shadow: none !important;
}
</style>