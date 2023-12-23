<template>
  <div id="app">
    <router-link to="/home"></router-link>
    <router-view />
  </div>

</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld
  }
}
</script>

<style>
html {
  font-size: 16px; /* 设置根元素的字体大小为 16px */
}

#app {
  width: 100%;
  height: 100%;
}

</style>
