<template>
  <div ref="map_area" class="w-full h-full"></div>
</template>

<script>
import { getLongitudeMaskInfo } from '@/api/getMaskInfo'
import store from '@/store'
import _ from 'lodash'

export default {
  name: 'Map',
  data() {
    return {
      map: '',
      listPickObj: '',
      initMapLatitude: 33.4722168175194, // 지도 생성시 초기 위도
      initMapLongitude: 126.5439772775276, // 지도 생성시 초기 경도
      currentLatlng: '', // 지도 현재 중심좌표
      currentLat: '', // 지도 현재 위도
      currentLng: '', // 지도 현재 경도
      currentMapStoreList: [], // 현재 지도 내 판매점 정보
      markerImageSize: '', // 생성된 마커 이미지 크기
      markerImageWidth: 45, // 마커 이미지 넓이
      markerImageHeight: 45, // 마커 이미지 높이
      markerImageUrl: {
        plenty: '/assets/marker/marker_green.png', // 100개 이상 (초록색)
        some: '/assets/marker/marker_yellow.png', // 30개 이상 100개 미만(노랑색)
        few: '/assets/marker/marker_red.png', // 2개 이상 30개 미만(빨강색)
        empty: '/assets/marker/marker_gray.png' // 1개 이하(회색)
      },
      maskCnt: {
        plenty: '100개 이상', // 100개 이상 (초록색)
        some: '30개 이상 100개 미만', // 30개 이상 100개 미만(노랑색)
        few: '2개 이상 30개 미만', // 2개 이상 30개 미만(빨강색)
        empty: '1개 이하' // 1개 이하(회색)
      },
      markerImageObj: {
        plenty: '', // 100개 이상 (초록색)
        some: '', // 30개 이상 100개 미만(노랑색)
        few: '', // 2개 이상 30개 미만(빨강색)
        empty: '' // 1개 이하(회색)
      },
      markerList: [],
      markerWindowPopup: '',
      markerWindowObj: '',
      listPickFlag: false
    }
  },
  created() {
    // 리스트에서 클릭해서 지도로 넘어온 경우 params 값이 있어야 함
    if (this.$route.params) {
      this.listPickFlag = true
      this.listPickObj = { ...this.$route.params }
    }
    // store 에 이전에 저장된 위도,경도 정보가 있으면 해당 값 셋팅
    // store 에 이전에 저장된 위도,경도 정보가 없으면 초기 값 셋팅
    this.currentLat = this.$store.state.map.lat ? this.$store.state.map.lat : this.initMapLatitude
    this.currentLng = this.$store.state.map.lng ? this.$store.state.map.lng : this.initMapLongitude
    this.setCurrentLatLng()
  },
  mounted() {
    this.initMap()
    this.setMapEvent()
  },
  methods: {
    initMap() {
      let container = this.$refs.map_area
      let options = {
        // 지도를 생성할 때 필요한 기본 옵션
        // 리스트를 클릭해서 넘어온 값이 있는 경우 해당 위경도를 중심으로 지도 생성
        // 리스트 클릭 없이 지도를 그릴떄는 store에 있는 값을 중심으로 지도 생성
        center: new window.kakao.maps.LatLng(
          this.listPickObj.lat ? this.listPickObj.lat : this.$store.state.map.lat,
          this.listPickObj.lng ? this.listPickObj.lng : this.$store.state.map.lng
        ), //지도의 중심좌표.
        level: 3 //지도의 레벨(확대, 축소 정도)
      }
      // 지도 생성
      this.map = new window.kakao.maps.Map(container, options)
      // 마커에 사용할 이미지 크기 지정
      this.markerImageSize = new window.kakao.maps.Size(
        this.markerImageWidth,
        this.markerImageHeight
      )
      // 마커에 사용될 4가지 이미지 생성
      for (let key in this.markerImageObj) {
        this.markerImageObj[key] = new window.kakao.maps.MarkerImage(
          this.markerImageUrl[key],
          this.markerImageSize
        )
      }
      this.getMapCenter()
    },
    // 지도에 이벤트 셋팅
    setMapEvent() {
      // 지도 드래그 이동 이벤트
      window.kakao.maps.event.addListener(this.map, 'dragend', () => {
        this.getMapCenter()
      })
      // 지도 레벨 변경 이벤트
      window.kakao.maps.event.addListener(this.map, 'zoom_changed', () => {
        this.getMapCenter()
      })
    },
    // 지도가 이동하거나 센터가 변경된 경우 호출되는 함수
    getMapCenter() {
      // 지도 중심좌표를 얻어옵니다
      this.currentLatlng = this.map.getCenter()
      this.currentLat = this.currentLatlng.getLat()
      this.currentLng = this.currentLatlng.getLng()
      // store에 현재 위경도 셋팅
      this.setCurrentLatLng()
      // 마커 초기화
      this.initMapMarker()
      // 변경된 지도 범위 내 마스크 판매처 정보 조회
      this.getMapStoreList()
    },
    getMapStoreList() {
      getLongitudeMaskInfo(this.currentLat, this.currentLng, 3000).then(res => {
        this.currentMapStoreList = []
        if (res.data.count > 0) {
          for (let i = 0; i < res.data.count; i++) {
            let storeObj = res.data.stores[i]
            // 상태가 break 거나 상태 값이 없는 경우는 리스트에서 제외한다
            if (storeObj.remain_stat !== 'break' && !!storeObj.remain_stat) {
              this.currentMapStoreList.push({
                title: storeObj.name,
                latlng: new window.kakao.maps.LatLng(
                  storeObj.lat,
                  storeObj.lng
                ),
                remain_stat: storeObj.remain_stat,
                storeInfo: { ...storeObj }
              })
            }
          }
          this.setMapMarker()
        } else {
          this.currentMapStoreList = []
        }
      })
    },
    // 지도에 마커를 셋팅한다
    setMapMarker() {
      this.currentMapStoreList.forEach(markerInfo => {
        let markerObj = new window.kakao.maps.Marker({
          map: this.map, // 마커를 표시할 지도
          storeInfo: _.cloneDeep(markerInfo.storeInfo), // 상점 정보 저장
          position: markerInfo.latlng, // 마커를 표시할 위치
          title: markerInfo.title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          image: this.markerImageObj[markerInfo.remain_stat], // 마커 이미지
          clickable: true // 마커 클릭 이벤트 설정
        })
        this.markerList.push(markerObj)
        this.setMarkerClickEvent(markerObj, markerInfo.storeInfo)
      })
      // console.log(this.listPickFlag)
      // if (this.listPickFlag) {
      //   let markerObj = _.find(this.markerList, {
      //     storeInfo: {
      //       code: this.listPickObj.code
      //     }
      //   })

      // console.log(markerObj)
      // this.closeOverlay()
      // this.setMarkerWindowPopup(markerObj, storeInfo)
      // // 마커 위에 정보를 표시합니다
      // this.markerWindowObj.setMap(this.map)
      // }
    },
    // 지도 내 마커 초기화
    initMapMarker() {
      this.closeOverlay()
      this.markerList.forEach(markerObj => {
        markerObj.setMap(null)
      })
      this.markerList = []
    },
    // 마커에 클릭 이벤트를 추가한다
    setMarkerClickEvent(markerObj, storeInfo) {
      window.kakao.maps.event.addListener(markerObj, 'click', () => {
        this.closeOverlay()
        this.setMarkerWindowPopup(markerObj, storeInfo)
        // 마커 위에 정보를 표시합니다
        this.markerWindowObj.setMap(this.map)
      })
    },
    // 마커 정보 표시 창의 기본 셋팅
    setMarkerWindowPopup(markerObj, storeInfo) {
      this.markerWindowObj = new window.kakao.maps.CustomOverlay({
        content: `<div class="w-106 h-15 leading-normal rounded-lg bg-white flex flex-wrap z-10 p-1">
          <div class="w-full border-b-2">${storeInfo.name}</div>
          <div class="w-full pt-1">${storeInfo.addr}</div>
          <div class="w-full">${storeInfo.created_at}</div>
          <div class="w-full">${this.maskCnt[storeInfo.remain_stat]}</div>
        </div>`,
        position: markerObj.getPosition()
      })
    },
    // 마커 정보 표시 창을 닫는다
    closeOverlay() {
      if (this.markerWindowObj) {
        this.markerWindowObj.setMap(null)
      }
    },
    // store에 현재의 위경도 값을 셋팅한다
    // map을 이동할때 갱신된다
    setCurrentLatLng() {
      store.dispatch('setLat', this.currentLat)
      store.dispatch('setLng', this.currentLng)
    }
  },
  beforeDestroy() {}
}
</script>
<style lang="less">
.line1 {
  width: 100%;
  border-top-width: 1.5px;
}
</style>
