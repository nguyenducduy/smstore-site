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
                :files="myFiles"
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
                <medium-editor v-model="description" :options="editorOptions" class="p-4 border-2 rounded" />
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
              <a-button
                class="mr-4"
                icon="save"
                type="primary"
                size="large"
                :loading="loading"
                @click.prevent="onSubmit"
                >Lưu</a-button
              >
              <a-button
                class="mr-4"
                size="large"
                type="dashed"
                @click.prevent="form.resetFields()">
                Reset
              </a-button>
              <a-button
                size="large"
                type="danger"
                 @click.prevent="form.resetFields()">
                Xóa
              </a-button>
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

  myFiles: any = null;
  $refs: {
    pond: HTMLFormElement,
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
  description: string = ''
  editorOptions: any = {
    autoLink: true,
    placeholder: {
      text: 'Nhấn 2 lần để nhập mô tả sản phẩm',
      hideOnClick: true
    }
  }

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
      console.log(values);
      console.log(this.options);
      console.log(this.description);

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

        // await this.$refs.pond.processFiles();
        
        try {  
          let productItem = {
            store_id: this.shopId,
            name: values.name,
            options: this.options,
            description: this.description,
            category_id: values.category_id,
            is_active: values.is_active,
            in_stock: values.in_stock,
            price: values.price,
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

          await this.$apollo.mutate({
            mutation: updateProduct,
            variables: {
              id: this.product.id,
              product: productItem,
              attributes: attrs
            }
          });

          this.loading = false;
          
          this.$message.success(`Cập nhật sản phẩm "${values.name}" thành công`)
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
      query: fetchProduct,
      variables: { id: this.$route.params.id }
    })

    if (r.data) {
      const product = r.data.products_by_pk
      this.product = product

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
            attrs: this.$form.createFormField({
              value: []
            }),
          };
        }
      });

      this.options = product.options
    }

    const self = this
    this.$nextTick(() => {
      let attrs = []
      self.product.product_attributes.map(item => {
        attrs[item.attribute.id] = item.value        
      })
      
      self.form.setFieldsValue({
        attrs: attrs
      })
    })
  }
}
</script>

<style lang="scss">
.filepond--item {
    width: calc(50% - 0.5em);
}
.ant-card-grid {
  box-shadow: none !important;
}
</style>