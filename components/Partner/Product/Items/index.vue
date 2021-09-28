<template>
  <div class="row" v-lazy-container="{ selector: 'img' }">
    <a-spin :spinning="loading">
      <div :class="`col-lg-2 pt-6 ${filterable ? 'shadow-lg' : '' }`">
        <p class="mb-4 filterable-header">
          <span>
            <a-icon type="filter" /> &nbsp; Bộ lọc
          </span>
        </p>
        <products-filter-form />
      </div>
      <div class="col-lg-10">
        <div class="row">
          <div class="flex items-center mb-4 col-lg-6">
            <bulk
              class="mr-4"
              :actions="bulkActions"
              :selectedItems="selectedRowKeys"
              displaySelectedField="title"
            />
            <a-button
              size="small"
              type="link"
              icon="reload"
              :loading="loading"
              @click.prevent="__reload()"
              >REFRESH</a-button
            >
          </div>
          <div class="mb-4 text-right col-lg-6" style="line-height: 30px">
            <a-pagination
              v-show="products_aggregate"
              size="small"
              :total="total"
              :current="currentPage"
              hideOnSinglePage
              @change="onPageChange"
              style="display: inline;"
              show-size-changer
              :pageSize="pageSize"
              @showSizeChange="onChangePageSize"
              :pageSizeOptions="pageSizeOptions"
            >
              <template slot="buildOptionText" slot-scope="props">
                <span>{{ props.value }} / trang</span>
              </template>
            </a-pagination>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <a-table
              size="small"
              class="box-white"
              :dataSource="products"
              :columns="columns"
              :pagination="false"
              :rowKey="record => record.id"
              @change="onChange"
              :row-selection="{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange
              }"
            >
              <template slot="_images" slot-scope="record">
                <img v-if="record.images && record.images.length > 0" :data-src="$helper.getImage(record.images[0]['path'])" />
              </template>
              <template slot="_name" slot-scope="record">
                <small>{{ record.category.name }}</small>
                <br/>
                <nuxt-link
                  class="text-xl"
                  :to="`/partner/product/edit/${record.id}`">
                  {{ record.name }}
                </nuxt-link>
                <a-space>{{ record.sku }}</a-space>
                <br/>
                <a-space class="pt-2" v-if="record.options.length > 0">
                  <i class="fa fa-clone"></i>
                  {{ record.options.length }} tùy chọn
                </a-space>
              </template>
              <template slot="_price" slot-scope="record">
                <span class="font-mono text-xl">{{ record.price | number('0,0') }}</span>
                đ
              </template>
              <template slot="_inStock" slot-scope="record">
                <a-tag color="green" v-if="record.in_stock">
                  Còn hàng
                </a-tag>
                <a-tag v-else>
                  Hết hàng
                </a-tag>
              </template>
              <template slot="_orderNo" slot-scope="record">
                <editable-order-no :id="record.id" :text="record.order_no" size="small" width="50" />
              </template>
              <template slot="_category" slot-scope="record">
                {{ record.category.name }}
              </template>
              <template slot="_isActive" slot-scope="record">
                <a-tag color="green" v-if="record.is_active">
                  Hiện
                </a-tag>
                <a-tag v-else>
                  Ẩn
                </a-tag>
              </template>
              <template slot="_actions" slot-scope="record">
                <a-button
                  type="dashed"
                  icon="copy"
                  @click="$router.push(`/partner/product/clone/${record.id}`)"
                >Nhân bản</a-button>
                <a-button
                  type="link"
                  icon="edit"
                  @click="$router.push(`/partner/product/edit/${record.id}`)"
                >Sửa</a-button>
                <delete-button :id="record.id" />
              </template>
            </a-table>
          </div>
          <div class="mt-4 col-lg-6">
            <bulk
              :actions="bulkActions"
              :selectedItems="selectedRowKeys"
              displaySelectedField="title"
            />
          </div>
          <div class="mt-4 text-right col-lg-6">
            <a-pagination
              v-show="products_aggregate && filterable === false"
              size="small"
              :total="total"
              :current="currentPage"
              hideOnSinglePage
              @change="onPageChange"
              style="display: inline;"
              show-size-changer
              :pageSize="pageSize"
              @showSizeChange="onChangePageSize"
              :pageSizeOptions="pageSizeOptions"
            >
              <template slot="buildOptionText" slot-scope="props">
                <span>{{ props.value }} / trang</span>
              </template>
            </a-pagination>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "nuxt-property-decorator";
import { Getter, Mutation } from 'vuex-class'
import { getOrderBy, getFilterBy, initQs, createUrl } from "@/helper/paginate";
import DeleteButton from "@/components/Partner/Product/DeleteButton/index.vue";
import Bulk from "@/components/Partner/Product/Bulk/index.vue";
import EditableOrderNo from "@/components/Partner/Product/EditableOrderNo/index.vue";
import ProductsFilterForm from "@/components/Partner/Product/FilterForm/index.vue";

import fetchProducts from "@/gql/queries/fetchProducts.gql";
import countProducts from "@/gql/queries/countProducts.gql";

@Component({
  components: {
    DeleteButton,
    Bulk,
    EditableOrderNo,
    ProductsFilterForm
  }
})
export default class PartnerProductItems extends Vue {
  @Getter('products/pageSize') pageSize
  @Mutation('products/SET_PAGE_SIZE') setPageSize
  @Watch('products_aggregate')
  onProductsAggregateChange() {
    this.$bus.$emit('bc.total', this.products_aggregate.aggregate.count); 
  }

  products: any = null;
  products_aggregate: any = null;

  // items per page
  pageSizeOptions: any = ['10', '20', '30', '40']
  currentPage: number = 1;
  
  //loading state
  loading: boolean = false;
  
  //sort
  sortedInfo: any = null;

  // filter mode
  filterable: boolean = false;

  //search
  q: string = '';

  //table properties
  selectedRowKeys: any = [];

  bulkActions: any = [
    { action: "active", label: "Hiện" },
    { action: "inactive", label: "Ẩn" },
    { action: "delete", label: "Xóa" },
  ];

  get total() {
    if (this.products_aggregate) {
      return this.products_aggregate.aggregate.count;
    } else {
      return 0;
    }
  }

  get hasSelected() {
    return this.selectedRowKeys.length > 0;
  }

  get columns() {
    let { sortedInfo } = this;
    sortedInfo = sortedInfo || {};

    const columns: any = [
      {
        title: "#",
        align: "center",
        key: "id",
        dataIndex: "id",
        sorter: true,
        sortOrder: sortedInfo.columnKey === "id" && sortedInfo.order
      },
      {
        scopedSlots: { customRender: "_images" },
        width: 100,
      },
      {
        title: "Tên SP",
        scopedSlots: { customRender: "_name" }
      },
      {
        title: "Giá",
        scopedSlots: { customRender: "_price" }
      },
      {
        title: "Thứ tự",
        scopedSlots: { customRender: "_orderNo" },
        width: 150,
        align: "center",
        key: "order_no",
        sorter: true,
        sortOrder: sortedInfo.columnKey === "order_no" && sortedInfo.order,
      },
      {
        title: "Trạng thái",
        align: "center",
        scopedSlots: { customRender: "_isActive" },
        key: "is_active",
        sorter: true,
        sortOrder: sortedInfo.columnKey === "is_published" && sortedInfo.order,
      },
      {
        title: "Còn hàng?",
        scopedSlots: { customRender: "_inStock" },
        key: "in_stock",
      },
      
      {
        align: "right",
        scopedSlots: { customRender: "_actions" }
      }
    ];

    return columns;
  }

  onChangePageSize(current, pageSize) {
    this.setPageSize(pageSize)
    Vue.ls.set('products.pageSize', pageSize);
    this.$cookiz.set('products.pageSize', pageSize);
    this.__reload()
  }

  //table select event
  onSelectChange(selectedRowKeys) {
    this.selectedRowKeys = selectedRowKeys;
  }

  //table event
  onChange(pagination, filters, sorter) {
    this.sortedInfo = sorter;
    const { currentFilters } = initQs(this);

    return this.$router.push(
      `?${createUrl(
        this.sortedInfo, currentFilters, { q: this.q }, this
      )}`
    );
  }

  onPageChange(pageNumber) {
    const { currentSort, currentFilters } = initQs(this);
    this.currentPage = pageNumber;

    this.$router.push(
      `?${createUrl(
        currentSort, currentFilters, { q: this.q }, this
      )}&page=${pageNumber}`
    );
  }

  mounted() {    
    const { page } = this.$route.query;
    this.currentPage = typeof page !== "undefined" ? +page : 1;

    this.__reload();
    
    // event hook
    this.$bus.$on('products.reload', () => {
      this.__reload();
      this.selectedRowKeys = [];
    });
  }

  // re-arsange search result
  __reOrder(searchStr) {
    let reOrder = [];

    if (typeof searchStr !== 'undefined') {
      searchStr.split(',').map(id => {
        const existedItem = this.products.find(x => x.id === parseInt(id));

        if (typeof existedItem !== 'undefined') {
          reOrder.push(this.products.find(x => x.id === parseInt(id)));
        }
      });

      this.products = reOrder;
    }
  }

  async __reload() {
    this.loading = true;

    const { currentSort, currentFilters, currentSearchText, currentSearchResult } = initQs(this);
    if (Object.keys(currentFilters).length !== 0) {
      this.filterable = true;
    } else {
      this.filterable = false;
    }

    const variables =  {
      limit: this.pageSize,
      offset: (this.currentPage - 1) * this.pageSize,
      order_by: getOrderBy(this),
      where: {
        _and: getFilterBy(this)
      }
    };
    
    this.sortedInfo = currentSort;
    this.q = currentSearchText;

    if (this.products === null && this.products_aggregate === null) {
      const r1 = await this.$apollo.query({
        query: fetchProducts,
        variables: variables,
      })
      this.products = r1.data.products

      const r2 = await this.$apollo.query({
        query: countProducts,
        variables: {
          where: {
            _and: getFilterBy(this)
          }
        },
      })
      this.products_aggregate = r2.data.products_aggregate

      this.$apollo.addSmartQuery('products', {
        query: fetchProducts,
        variables: variables
      })
      this.$apollo.addSmartQuery('products_aggregate', {
        query: countProducts,
        variables: {
          where: {
            _and: getFilterBy(this)
          }
        }
      })
    } else {
      await this.$apollo.queries.products.refetch(variables);
      await this.$apollo.queries.products_aggregate.refetch({
        where: {
          _and: getFilterBy(this)
        }
      });
    }

    // must re-arrange because graphql return not match order of search engine
    if (currentSearchText.length > 0) {
      this.__reOrder(currentSearchResult)
    }

    this.loading = false;
  }
}
</script>


<style lang="scss">
.ant-table-body {
  img {
    border-radius: 5px;;
  }
}
</style>
