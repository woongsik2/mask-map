<template>
  <div class="home_style">
    <div class="flex flex-wrap">
      <div class="w-10/12">
        <v-text-field
          v-model="inputAddr"
          label="'서울특별시 강남구' 형식으로 입력 해 주세요."
          @keypress.enter="search"
        ></v-text-field>
      </div>
      <div class="w-2/12 mt-2">
        <v-btn @click="search" fab small color="secondary">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </div>
      <div class="w-full">
        <v-data-table
          :headers="headers"
          :items="testData"
          :items-per-page="itemsPerPage"
          :page.sync="page"
          hide-default-footer
          class="elevation-1"
          :loading="loadingFlag"
          @page-count="pageCount = $event"
          @click:row="selectedRow"
        >
          <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
          <template v-slot:item.remain_stat="{ item }">
            <v-chip :color="getColor(item, item.remain_stat)" dark>{{item.status}}</v-chip>
          </template>
        </v-data-table>
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="totalVisible"
          :circle="true"
        ></v-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getAddrMaskInfo } from '@/api/getMaskInfo'
export default {
  name: 'List',
  components: {},
  data() {
    return {
      inputAddr: '',
      headers: [
        {
          text: '판매처 명',
          align: 'start',
          sortable: false,
          value: 'name',
          width: '20%'
        },
        { text: '주소', value: 'addr', sortable: false, width: '50%' },
        {
          text: '업데이트 시간',
          value: 'created_at',
          sortable: false,
          width: '20%'
        },
        {
          text: '재고 현황',
          value: 'remain_stat',
          sortable: false,
          width: '10%'
        }
      ],
      testData: [],
      loadingFlag: false,
      page: 1,
      pageCount: 10,
      totalVisible: 10,
      itemsPerPage: 15
    }
  },
  created() {},
  mounted() {},
  methods: {
    search() {
      if (this.inputAddr.trim() == '') {
        alert('주소를 입력 해 주세요.')
        return false
      }
      this.page = 1 // page init
      this.loadingFlag = true
      getAddrMaskInfo(this.inputAddr).then(data => {
        this.testData = []
        let stores = data.data.stores
        stores.forEach(v => {
          if (v.remain_stat != 'break') {
            this.testData.push({ ...v, status })
          }
        })
        this.loadingFlag = false
      })
    },
    selectedRow(selectData) {
      this.$router.push({ name: 'Map', params: selectData })
    },
    getColor(item, status) {
      console.log(item)
      if (status == 'plenty') {
        item.status = '100개 이상'
        return 'green'
      } else if (status == 'some') {
        item.status = '30개 이상'
        return 'yellow'
      } else if (status == 'few') {
        item.status = '1개 이상'
        return 'red'
      } else {
        item.status = '재고 없음'
        return 'gray'
      }
    }
  }
}
</script>
