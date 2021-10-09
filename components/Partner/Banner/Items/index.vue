<template>
  <div class="row" v-lazy-container="{ selector: 'img' }">
    <a-spin :spinning="loading">
      <div :class="`col-lg-2 pt-8 ${filterable ? 'shadow-lg' : '' }`">
        <p class="mb-4 filterable-header">
          <span>
            <a-icon type="filter" /> &nbsp; Bộ lọc
          </span>
        </p>
        <banners-filter-form />
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
              v-show="banners_aggregate"
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
              :dataSource="banners"
              :columns="columns"
              :pagination="false"
              :rowKey="record => record.id"
              @change="onChange"
              :row-selection="{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange
              }"
            >
              <template slot="_image" slot-scope="record">
                <img :data-src="$helper.getImage(record.image_path)" />
                <small>{{ record.link }}</small>
              </template>
              <template slot="_page" slot-scope="record">
                <a-tag v-if="record.page === 'home'">
                  Trang chủ
                </a-tag>
                <a-tag v-if="record.page === 'category'">
                  Trang danh mục
                </a-tag>
                <a-tag v-if="record.page === 'detail'">
                  Trang chi tiết sản phẩm
                </a-tag>
              </template>
              <template slot="_orderNo" slot-scope="record">
                <editable-order-no :id="record.id" :text="record.order_no" size="small" width="50" />
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
                  type="link"
                  icon="edit"
                  @click="$router.push(`/partner/product/edit/${record.id}`)"
                >Sửa</a-button>
                <delete-button :id="record.id" :imagePath="record.image_path" />
              </template>
            </a-table>
          </div>
          <div class="mt-4 col-lg-6">
            <bulk
              :actions="bulkActions"
              :selectedItems="selectedRowKeys"
            />
          </div>
          <div class="mt-4 text-right col-lg-6">
            <a-pagination
              v-show="banners_aggregate && filterable === false"
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
import DeleteButton from "@/components/Partner/Banner/DeleteButton/index.vue";
import Bulk from "@/components/Partner/Banner/Bulk/index.vue";
import EditableOrderNo from "@/components/Partner/Banner/EditableOrderNo/index.vue";
import BannersFilterForm from "@/components/Partner/Banner/FilterForm/index.vue";

import fetchBanners from "@/gql/queries/fetchBanners.gql";
import countBanners from "@/gql/queries/countBanners.gql";

@Component({
  components: {
    DeleteButton,
    Bulk,
    EditableOrderNo,
    BannersFilterForm
  }
})
export default class PartnerBannerItems extends Vue {
  @Getter('banners/pageSize') pageSize
  @Mutation('banners/SET_PAGE_SIZE') setPageSize
  @Watch('banners_aggregate')
  onAggregateChange() {
    this.$bus.$emit('bc.total', this.banners_aggregate.aggregate.count); 
  }

  banners: any = null;
  banners_aggregate: any = null;

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
    if (this.banners_aggregate) {
      return this.banners_aggregate.aggregate.count;
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
        scopedSlots: { customRender: "_image" },
        width: 300,
      },
      {
        title: "Trang",
        scopedSlots: { customRender: "_page" }
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
        align: "right",
        scopedSlots: { customRender: "_actions" }
      }
    ];

    return columns;
  }

  onChangePageSize(current, pageSize) {
    this.setPageSize(pageSize)
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

  async mounted() {    
    const { page } = this.$route.query;
    this.currentPage = typeof page !== "undefined" ? +page : 1;

    await this.__reload();
    
    // event hook
    this.$bus.$on('banners.reload', () => {
      this.__reload();
      this.selectedRowKeys = [];
    });
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

    if (this.banners === null && this.banners_aggregate === null) {
      
      
      let r = null

      r = await this.$apollo.query({
        query: fetchBanners,
        variables: variables,
      })
      this.banners = r.data.banners

      r = await this.$apollo.query({
        query: countBanners,
        variables: {
          where: {
            _and: getFilterBy(this)
          }
        },
      })
      this.banners_aggregate = r.data.banners_aggregate

      this.$apollo.addSmartQuery('banners', {
        query: fetchBanners,
        variables: variables
      })
      this.$apollo.addSmartQuery('banners_aggregate', {
        query: countBanners,
        variables: {
          where: {
            _and: getFilterBy(this)
          }
        }
      })
    } else {
      await this.$apollo.queries.banners.refetch(variables);
      await this.$apollo.queries.banners_aggregate.refetch({
        where: {
          _and: getFilterBy(this)
        }
      });
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
