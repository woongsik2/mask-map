<template>
  <div class="home_style">
    <p>{{ message ? message : '현재 지도의 중심 좌표가 표시됩니다.' }}</p>
    <div ref="map_area" class="map_style"></div>
  </div>
</template>

<script>

export default {
  name: "Map",
  data () {
    return {
      map: '',
      message: ''
    }
  },
  created () {
  },
  mounted () {
    this.initMap()
    this.setMapEvent()
  },
  methods: {
    initMap() {
      let container = this.$refs.map_area
      let options = { //지도를 생성할 때 필요한 기본 옵션
        center: new window.kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
        level: 3 //지도의 레벨(확대, 축소 정도)
      }

      this.map = new window.kakao.maps.Map(container, options)
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
      let latlng = this.map.getCenter()
      this.message = `변경된 지도 중심좌표는 ${latlng.getLat()}이고, 경도는 ${latlng.getLng()}입니다.`
    }
  },
  beforeDestroy() {

  }
};
</script>
<style lang="less" scoped>
.home_style {
  height: 750px;
}
.map_style {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
</style>
