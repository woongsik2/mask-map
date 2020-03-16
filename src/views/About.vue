<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script>
import axios from "axios";
import { getAddrMaskInfo, getLongitudeMaskInfo } from "../api/getMaskInfo";

export default {
  name: "Home",
  components: {},
  created() {},
  mounted() {
    // console.log(">>>", this.$refs.getUrl);

    this.getAddrMaskInfo1().then(data => {
      console.log("############", data);
    });

    getAddrMaskInfo().then(data => {
      console.log("????????????", data);
    });

    getLongitudeMaskInfo(33.498619383750544, 126.5329107465822, 3000).then(
      data => {
        console.log("!!!!!!!!!!!!", data);
      }
    );
  },
  methods: {
    async getAddrMaskInfo1() {
      try {
        /**
          주소를 기준으로 해당 구 또는 동내에 존재하는 판매처 및 재고 상태 등의 판매 정보 제공.
          예- '서울특별시 강남구' or '서울특별시 강남구 논현동'
          ('서울특별시' 와 같이 '시'단위만 입력하는 것은 불가능합니다.)
         */
        return await axios.get(
          "https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat=37.52084695049799&lng=127.01670798313158&m=2000",
          {
            params: {
              address: "서울특별시 강남구"
            }
          }
        );
      } catch (e) {
        console.error(e);
      }
    }
  }
};
</script>
