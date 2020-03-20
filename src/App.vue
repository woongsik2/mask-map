<template>
  <v-app class="flex flex-wrap w-full h-full">
    <div class="w-full component_area">
      <router-view></router-view>
    </div>
    <v-bottom-navigation :value="activeBtn" grow color="teal">
      <v-btn class="mt-2" @click="activeNaviBtn(0)">
        <span>지도</span>
        <v-icon>mdi-map-marker</v-icon>
      </v-btn>

      <v-btn class="mt-2" @click="activeNaviBtn(1)">
        <span>리스트</span>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn class="mt-2" @click="activeNaviBtn(2)">
        <span>정보</span>
        <v-icon>mdi-information-outline</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
// import HelloWorld from "./components/HelloWorld";

export default {
  name: 'App',

  components: {
    // HelloWorld
  },

  data: () => ({
    activeBtn: 0
  }),
  methods: {
    activeNaviBtn(no) {
      this.activeBtn = no
      if (no === 0) {
        this.$router.push({ name: 'Map' })
      }
      if (no === 1) {
        this.$router.push({ name: 'List' })
      }
      if (no === 2) {
        this.$router.push({ name: 'About' })
      }
    }
  }
}
</script>

<style lang="less">
@tailwind base;
@tailwind components;
@tailwind utilities;
@import './assets/main.less';

.component_area {
  height: calc(100% - 56px);
}
</style>
