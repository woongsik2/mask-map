<template>
  <div class="home_style">
    <div class="map_style">
      <div>
        <v-text-field v-model="inputAddr" label="주소 검색" @keypress.enter="search"></v-text-field>
        <v-btn @click="search">검색</v-btn>
      </div>
      <v-data-table
        :headers="headers"
        :items="testData"
        :items-per-page="15"
        class="elevation-1"
        :loading="loadingFlag"
        @click:row="selectedRow"
      >
        <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      </v-data-table>
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
          width: '30%'
        },
        { text: '주소', value: 'addr', sortable: false, width: '50%' },
        { text: '재고', value: 'age', sortable: false, width: '20%' }
      ],
      testData: [],
      loadingFlag: false
    }
  },
  created() {},
  mounted() {},
  methods: {
    search() {
      this.loadingFlag = true
      getAddrMaskInfo(this.inputAddr).then(data => {
        this.testData = []
        let stores = data.data.stores
        console.log(stores)
        stores.forEach(v => {
          this.testData.push({ ...v })
        })
        console.log(this.testData)
        this.loadingFlag = false
      })
    },
    selectedRow(selectData) {
      this.$router.push({ name: 'Map', params: selectData })
    }
  }
}
</script>
