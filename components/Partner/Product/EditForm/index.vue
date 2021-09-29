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
                v-show="myFiles.length < 4"
                ref="pond"
                name="file"
                accepted-file-types="image/jpeg, image/png"
                credits="false"
                allowFileEncode="true"
                allowFileMetadata="true"
                allowMultiple="true"
                :maxFiles="4 - myFiles.length"
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
                <!-- <medium-editor v-model="description" :options="editorOptions" class="p-4 border-2 rounded" /> -->
              </div>
            </div>
          </div>
          <div class="col-lg-3">
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
                    <a-select v-model="value.mode" placeholder="Tăng/Giảm">
                      <a-select-option value="inc">
                        + Tăng
                      </a-select-option>
                      <a-select-option value="dec">
                        - Giảm
                      </a-select-option>
                    </a-select>
                    <a-input v-model="value.price" suffix="đ"></a-input>
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
            <a-form-item label="Chọn loại SP">
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
import debounce from 'lodash/debounce'

import updateProduct from '@/gql/mutations/updateProduct.gql'
import fetchProductCategories from '@/gql/queries/fetchProductCategories.gql'
import fetchProductTypes from '@/gql/queries/fetchProductTypes.gql'
import fetchProduct from '@/gql/queries/fetchProduct.gql'

@Component({
  apollo: {
    categories: {
      query: fetchProductCategories,
      prefetch: true
    },
    types: {
      query: fetchProductTypes,
      prefetch: true
    }
  }
})
export default class PartnerProductEditForm extends Vue {
  @Getter('users/shopId') shopId

  product: any = null
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
  myFiles: any = []
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

  onRemoveImage(index) {
    this.myFiles.splice(index, 1)
  }
  
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

        this.loading = true;
        
        try {  
          let productItem = {
            store_id: this.shopId,
            name: values.name,
            options: this.options,
            description: this.$helper.replaceBRWithEmptyBlock(this.$refs.editor.invoke('getHTML')),
            category_id: values.category_id,
            is_active: values.is_active,
            in_stock: values.in_stock,
            price: values.price,
            sku: values.sku,
            type_id: this.types[this.type_selected]['id']
          }

          let attrs = []
          if (values.attrs.length > 0) {
            values.attrs.map((attr_value, attr_id) => {
              attrs.push({
                attribute_id: attr_id,
                product_id: this.product.id,
                store_id: this.shopId,
                value: typeof attr_value !== 'undefined' ? attr_value : ''
              })
            })
          }

          // diff to remove image from user old images
          if (this.myFiles.length !== this.product.images.length) {
            const diff = this.product.images.filter(({ id: id1 }) => !this.myFiles.some(({ id: id2 }) => id2 === id1))
            // console.log(diff);
            diff.map(async image => {
              await this.$axios.post(
                `${this.$config.NUXT_ENV_STORAGE_ENDPOINT}/products/delete`,
                {
                  id: image.id,
                  path: image.path
                }
              )
            })
          }

          // upload files
          let images = []
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
              response.data.map(path => {  
                images.push({
                  product_id: this.product.id,
                  store_id: this.shopId,
                  path: path
                })
              })
            }
          }

          await this.$apollo.mutate({
            mutation: updateProduct,
            variables: {
              id: this.product.id,
              product: productItem,
              attributes: attrs,
              images: images
            }
          });

          this.loading = false;
          
          await this.$refs.pond.removeFiles()

          // reload images
          this.myFiles = []
          const r = await this.$apollo.query({
            query: fetchProduct,
            variables: { id: this.$route.params.id },
            fetchPolicy: 'no-cache'
          })

          if (r.data.products_by_pk.images.length > 0) {
            r.data.products_by_pk.images.map(image => {
              this.myFiles.push(image)
            });
          }

          this.$message.success(`Cập nhật sản phẩm "${values.name}" thành công`);
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
    console.log('a');
    
    const r = await this.$apollo.query({
      query: fetchProduct,
      variables: { id: this.$route.params.id },
      fetchPolicy: 'no-cache'
    })

    if (r.data) {
      const product = r.data.products_by_pk
      this.product = product
      // console.log(this.types);
      
      this.type_selected = this.types.filter(x => x.id === product.type_id)
      const typeIndex = this.types.findIndex(x => x.id === product.type_id)
      this.type_selected = typeIndex
      this.type_selected_values = this.types[typeIndex]['attributes']

      this.form = this.$form.createForm(this, {
        mapPropsToFields: () => {
          return {
            category_id: this.$form.createFormField({
              value: product.category_id
            }),
            name: this.$form.createFormField({
              value: product.name
            }),
            price: this.$form.createFormField({
              value: product.price
            }),
            sku: this.$form.createFormField({
              value: product.sku
            }),
            attrs: this.$form.createFormField({
              value: []
            }),
          };
        }
      });

      this.options = product.options

      if (product.images.length > 0) {
        product.images.map(image => {
          this.myFiles.push(image)
        })
      }
    }

    // await this.$helper.sleep(1000)
    const self = this
    this.$nextTick(() => {
      let attrs = []
      self.product.product_attributes.map(item => {
        attrs[item.attribute.id] = item.value        
      })
      
      self.form.setFieldsValue({
        attrs: attrs
      })
      
      self.$refs.editor.invoke('setHTML', self.product.description)
    })
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