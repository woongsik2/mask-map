/**
 * main 내 tag 형식으로 페이지 히스토리 관리를 위한 기능의 Store
 */
const map = {
  state: {
    lat: '',
    lng: ''
  },
  mutations: {
    SET_LAT: (state, lat) => {
      state.lat = lat
    },
    SET_LNG: (state, lng) => {
      state.lng = lng
    }
  },
  actions: {
    setLat({ commit }, view) {
      commit('SET_LAT', view)
    },
    setLng({ commit }, view) {
      commit('SET_LNG', view)
    }
  }
}

export default map
