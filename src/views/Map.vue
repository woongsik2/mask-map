<template>
  <div class="home_style">
    <p>{{ message ? message : '현재 지도의 중심 좌표가 표시됩니다.' }}</p>
    <div ref="map_area" class="map_style"></div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "Map",
  data() {
    return {
      map: '',
      message: '',
      initMapLatitude: '33.450701', // 지도 생성시 초기 위도
      initMapLongitude: '126.570667', // 지도 생성시 초기 경도
      currentLatlng: '', // 지도 현재 중심좌표
      currentMapStoreList: [], // 현재 지도 내 판매점 정보
      mackerImageSize: '', // 생성된 마커 이미지 크기
      mackerImageWidth: '', // 마커 이미지 넓이
      mackerImageHeight: '', // 마커 이미지 높이
      mackerImageUrl: {
        plenty: 'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png', // 100개 이상 (초록색)
        some: 'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/category.png', // 30개 이상 100개 미만(노랑색)
        few: 'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png', // 2개 이상 30개 미만(빨강색)
        empty: 'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png' // 1개 이하(회색)
      },
      mackerImageObj: {
        plenty: '', // 100개 이상 (초록색)
        some: '', // 30개 이상 100개 미만(노랑색)
        few: '', // 2개 이상 30개 미만(빨강색)
        empty: '' // 1개 이하(회색)
      },
      mackerList: []
    }
  },
  created() {},
  mounted() {
    this.initMap();
    this.setMapEvent();
  },
  methods: {
    initMap() {
      let container = this.$refs.map_area
      let options = { //지도를 생성할 때 필요한 기본 옵션
        center: new window.kakao.maps.LatLng(this.initMapLatitude, this.initMapLongitude), //지도의 중심좌표.
        level: 3 //지도의 레벨(확대, 축소 정도)
      };

      this.map = new window.kakao.maps.Map(container, options)
      this.mackerImageSize = new window.kakao.maps.Size(this.mackerImageWidth, this.mackerImageHeight) // 마커에 사용할 이미지 크기 지정
      for (let key in this.mackerImageObj) { // 마커에 사용될 4가지 이미지 생성
        this.mackerImageObj[key] = new window.kakao.maps.MarkerImage(this.mackerImageUrl[key], this.mackerImageSize)
      }
      this.getMapCenter()
    },
    setMapEvent() {
      window.kakao.maps.event.addListener(this.map, "dragend", () => {
        this.getMapCenter();
      });

      window.kakao.maps.event.addListener(this.map, "zoom_changed", () => {
        this.getMapCenter();
      });
    },
    getMapCenter() {
      // 지도 중심좌표를 얻어옵니다 
      this.currentLatlng = this.map.getCenter()
      this.message = `변경된 지도 중심좌표는 ${this.currentLatlng.getLat()}이고, 경도는 ${this.currentLatlng.getLng()}입니다.`
      this.initMapMacker()
      this.getMapStoreList()
    },
    getMapStoreList() {
      axios.get(`https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat=${this.currentLatlng.getLat()}&lng=${this.currentLatlng.getLng()}&m=500`).then(res => {
        console.log(res)
        this.currentMapStoreList = []
        if( res.data.count > 0 ) {
          for (let i = 0; i < res.data.count; i++) {
            let storeObj = res.data.stores[i]
            if ( storeObj.remain_stat !== 'break' && !!storeObj.remain_stat ) {
              this.currentMapStoreList.push({ title: storeObj.name, latlng: new window.kakao.maps.LatLng(storeObj.lat, storeObj.lng), remain_stat: storeObj.remain_stat })
            }
          }
          // this.currentMapStoreList = res.data.stores.filter(storeObj => {
          //   if (storeObj.remain_stat !== 'break') {
          //     return { title: storeObj.name, latlng: new window.kakao.maps.LatLng(storeObj.lat, storeObj.lng), remain_stat: storeObj.remain_stat }
          //   }
          // })
          console.log(this.currentMapStoreList)
          this.setMapMacker()
        } else {
          this.currentMapStoreList = []
        }
      })
    },
    setMapMacker() {
      this.currentMapStoreList.forEach(mackerObj => {
        console.log(mackerObj.title, mackerObj.remain_stat)
        console.log(this.mackerImageObj)
        this.mackerList.push(new window.kakao.maps.Marker({
          map: this.map, // 마커를 표시할 지도
          position: mackerObj.latlng, // 마커를 표시할 위치
          title : mackerObj.title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          image : this.mackerImageObj[mackerObj.remain_stat] // 마커 이미지 
        }))
      })
    },
    initMapMacker() {
      this.mackerList.forEach(mackerObj => {
        mackerObj.setMap(null)
      })
      this.mackerList = []
    }
  },
  beforeDestroy() {}
};
</script>
<style lang="less" scoped>
.home_style {
  text-align: center;
  height: 750px;
}
.map_style {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
</style>
