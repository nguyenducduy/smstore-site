<template>
  <div class="row" v-lazy-container="{ selector: 'img' }">
    <a-spin :spinning="loading">
      <div :class="`col-lg-2 pt-8  bg-gray-50 h-screen ${filterable ? 'shadow-lg' : '' }`">
        
        <orders-filter-form />
      </div>
      <div class="col-lg-10">
        <div class="row">
          <div class="flex items-center mb-4 col-lg-6">
            <!-- <bulk
              class="mr-4"
              :actions="bulkActions"
              :selectedItems="selectedRowKeys"
              displaySelectedField="title"
            /> -->
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
              v-show="orders_aggregate"
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
              :dataSource="orders"
              :columns="columns"
              :pagination="false"
              :rowKey="record => record.id"
              @change="onChange"
            >
              <template slot="_customer" slot-scope="record">
                <p class="text-sm">{{ record.shipping_full_name }}</p>
                <p class="font-bold">{{ record.shipping_phone_number }}</p>
              </template>
              <template slot="_status" slot-scope="record">
                <a-tag :color="_getStatusColor(record.status)">
                  {{ record._status.name }}
                </a-tag>
              </template>
              <template slot="_code" slot-scope="record">
                <code class="text-sm">{{ record.code }}</code>
              </template>
              <template slot="_price" slot-scope="record">
                <span class="font-mono text-xl">{{ record.total_price | number('0,0') }}</span>
                &#8363;
              </template>
              <template slot="_createdAt" slot-scope="record">
                {{ $moment(record.created_at).format('HH:mm, DD/MM/YYYY') }}
              </template>
               <template slot="_isPaid" slot-scope="record">
                <a-tag color="green" v-if="record.is_paid">
                  Đã thanh toán
                </a-tag>
                <a-tag v-else>
                  Chưa thanh toán
                </a-tag>
              </template>
              <template slot="_actions" slot-scope="record">
                <order-detail-modal :orderCode="record.code" :orderId="record.id" />
              </template>
            </a-table>
          </div>
          <div class="mt-4 col-lg-6">
            <!-- <bulk
              :actions="bulkActions"
              :selectedItems="selectedRowKeys"
            /> -->
          </div>
          <div class="mt-4 text-right col-lg-6">
            <a-pagination
              v-show="orders_aggregate && filterable === false"
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
// import DeleteButton from "@/components/Partner/Banner/DeleteButton/index.vue";
// import Bulk from "@/components/Partner/Banner/Bulk/index.vue";
// import EditableOrderNo from "@/components/Partner/Banner/EditableOrderNo/index.vue";
import OrdersFilterForm from "@/components/Partner/Order/FilterForm/index.vue";
import OrderDetailModal from '@/components/Partner/Order/OderDetailModal/index.vue'

import fetchOrders from "@/gql/queries/fetchOrders.gql";
import countOrders from "@/gql/queries/countOrders.gql";

@Component({
  components: {
    // DeleteButton,
    // Bulk,
    // EditableOrderNo,
    OrdersFilterForm,
    OrderDetailModal
  }
})
export default class PartnerOrderItems extends Vue {
  @Getter('orders/pageSize') pageSize
  @Mutation('orders/SET_PAGE_SIZE') setPageSize
  @Watch('orders_aggregate')
  onAggregateChange() {
    this.$bus.$emit('bc.total', this.orders_aggregate.aggregate.count); 
  }

  orderStatus: any = null
  orders: any = null;
  orders_aggregate: any = null;

  // items per page
  pageSizeOptions: any = ['10', '20', '30', '40']
  currentPage: number = 1;
  
  //loading state
  loading: boolean = false;
  
  //sort
  sortedInfo: any = null;

  // filter mode
  filterable: boolean = false;

  get total() {
    if (this.orders_aggregate) {
      return this.orders_aggregate.aggregate.count;
    } else {
      return 0;
    }
  }

  q: string = ''

  get columns() {
    let { sortedInfo } = this;
    sortedInfo = sortedInfo || {};

    const columns: any = [
      // {
      //   title: "#",
      //   align: "center",
      //   key: "id",
      //   dataIndex: "id",
      //   sorter: true,
      //   sortOrder: sortedInfo.columnKey === "id" && sortedInfo.order
      // },
      {
        title: "Mã ĐH",
        scopedSlots: { customRender: "_code" },
        align: "center",
      },
      {
        title: "Khách hàng",
        scopedSlots: { customRender: "_customer" },
      },
      {
        title: "Ngày giờ tạo",
        scopedSlots: { customRender: "_createdAt" }
      },
      {
        title: "Tổng giá",
        scopedSlots: { customRender: "_price" }
      },
      {
        title: "Trạng thái",
        align: "center",
        scopedSlots: { customRender: "_status" }
      },
      {
        title: "Thanh toán?",
        align: "center",
        scopedSlots: { customRender: "_isPaid" }
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
    this.$bus.$on('orders.reload', () => {
      this.__reload();
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

    if (this.orders === null && this.orders_aggregate === null) {
      let r = null

      r = await this.$apollo.query({
        query: fetchOrders,
        variables: variables,
      })
      this.orders = r.data.orders

      r = await this.$apollo.query({
        query: countOrders,
        variables: {
          where: {
            _and: getFilterBy(this)
          }
        },
      })
      this.orders_aggregate = r.data.orders_aggregate

      this.$apollo.addSmartQuery('orders', {
        query: fetchOrders,
        variables: variables
      })
      this.$apollo.addSmartQuery('orders_aggregate', {
        query: countOrders,
        variables: {
          where: {
            _and: getFilterBy(this)
          }
        }
      })
    } else {
      await this.$apollo.queries.orders.refetch(variables);
      await this.$apollo.queries.orders_aggregate.refetch({
        where: {
          _and: getFilterBy(this)
        }
      });
    }

    this.loading = false;
  }

  _getStatusColor(statusValue) {
    let color: string = ''

    switch (statusValue) {
      case 'pending':
        color = '#fdcb6e'
        break;
      case 'confirmed':
        color = '#0984e3'
        break;
      case 'shipping':
        color = '#a29bfe'
        break;
      case 'done':
        color = '#55efc4'
        break;
      case 'canceled':
        color = '#e17055'
        break;
    }

    return color
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
