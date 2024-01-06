<template>
  <div>
    ImageManagement
    <button @click="startVideoStream">BUTTON</button>
<!--    <img :src="imgURL" alt="Image">-->
    <img ref="videoPlayer" class="flipped-image"/>
  </div>
</template>

<script>
import axios from "axios";
import { requestDemo } from "@/api";
import { sendImg } from "@/api";
import {test} from "@/api";

export default {
  name: "ImageManagement",
  data(){
    return{
      imgURL:''
    }
  },
  mounted() {
    // requestDemo().then(res=>{
    //   console.log(res.message, "request_demo")
    // })
    // this.startVideoStream()
    test().then(res=>{
      console.log(res, "test")
    })
  },
  methods:{
    clickButton(){

    },
    startVideoStream(){
      const video = this.$refs.videoPlayer;
      const streamURL = "http://192.168.43.69:5000/streamer"
      video.src = streamURL
    }
  }
}
</script>

<style scoped>

</style>