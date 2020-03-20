<template>
  <div ref="map_area" class="w-full h-full"></div>
</template>

<script>
import { getLongitudeMaskInfo } from '@/api/getMaskInfo'

export default {
  name: 'Map',
  data() {
    return {
      map: '',
      listPickObj: '',
      initMapLatitude: 33.4722168175194, // 지도 생성시 초기 위도
      initMapLongitude: 126.5439772775276, // 지도 생성시 초기 경도
      currentLatlng: '', // 지도 현재 중심좌표
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
      markerWindowObj: ''
    }
  },
  created() {
    if (this.$route.params) {
      this.listPickObj = { ...this.$route.params }
    }
  },
  mounted() {
    this.initMap()
    this.setMapEvent()
  },
  methods: {
    initMap() {
      let container = this.$refs.map_area
      let options = {
        //지도를 생성할 때 필요한 기본 옵션
        center: new window.kakao.maps.LatLng(
          this.listPickObj.lat ? this.listPickObj.lat : this.initMapLatitude,
          this.listPickObj.lng ? this.listPickObj.lng : this.initMapLongitude
        ), //지도의 중심좌표.
        level: 3 //지도의 레벨(확대, 축소 정도)
      }

      this.map = new window.kakao.maps.Map(container, options)
      this.markerImageSize = new window.kakao.maps.Size(
        this.markerImageWidth,
        this.markerImageHeight
      ) // 마커에 사용할 이미지 크기 지정
      for (let key in this.markerImageObj) {
        // 마커에 사용될 4가지 이미지 생성
        this.markerImageObj[key] = new window.kakao.maps.MarkerImage(
          this.markerImageUrl[key],
          this.markerImageSize
        )
      }
      this.getMapCenter()
    },
    setMapEvent() {
      window.kakao.maps.event.addListener(this.map, 'dragend', () => {
        this.getMapCenter()
      })

      window.kakao.maps.event.addListener(this.map, 'zoom_changed', () => {
        this.getMapCenter()
      })
    },
    getMapCenter() {
      // 지도 중심좌표를 얻어옵니다
      this.currentLatlng = this.map.getCenter()
      console.log(this.currentLatlng)
      this.initMapMarker()
      this.getMapStoreList()
    },
    getMapStoreList() {
      getLongitudeMaskInfo(
        this.currentLatlng.getLat(),
        this.currentLatlng.getLng(),
        3000
      ).then(res => {
        this.currentMapStoreList = []
        if (res.data.count > 0) {
          for (let i = 0; i < res.data.count; i++) {
            let storeObj = res.data.stores[i]
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
    setMapMarker() {
      this.currentMapStoreList.forEach(markerInfo => {
        let markerObj = new window.kakao.maps.Marker({
          map: this.map, // 마커를 표시할 지도
          position: markerInfo.latlng, // 마커를 표시할 위치
          title: markerInfo.title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          image: this.markerImageObj[markerInfo.remain_stat], // 마커 이미지
          clickable: true // 마커 클릭 이벤트 설정
        })
        this.markerList.push(markerObj)
        this.setMarkerClickEvent(markerObj, markerInfo.storeInfo)
      })
    },
    setMarkerClickEvent(markerObj, storeInfo) {
      window.kakao.maps.event.addListener(markerObj, 'click', () => {
        this.closeOverlay()
        this.setMarkerWindowPopup(markerObj, storeInfo)
        // 마커 위에 인포윈도우를 표시합니다
        this.markerWindowObj.setMap(this.map)
      })
    },
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
    closeOverlay() {
      if (this.markerWindowObj) {
        this.markerWindowObj.setMap(null)
      }
    },
    initMapMarker() {
      this.closeOverlay()
      this.markerList.forEach(markerObj => {
        markerObj.setMap(null)
      })
      this.markerList = []
    }
  },
  beforeDestroy() {
    this.$route.params = ''
  }
}
</script>
<style lang="less">
.line1 {
  width: 100%;
  border-top-width: 1.5px;
}
</style>
