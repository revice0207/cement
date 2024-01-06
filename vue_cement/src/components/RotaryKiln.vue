<template>
  <div class="main">
    <div class="img-video">
      <div class="flipped-image">
<!--        <img v-if="!isStart" src="../assets/logo1.png" style="width: 100%; height: 100%;" />-->
        <div v-if="!isStart"></div>
        <img v-else ref="videoPlayer" style="width: 100%; height: 100%;" />
      </div>
      <div class="img-right">
        <div class="img-right-item" @click="startVideoStream">
          <div class="right-item-left">
            <p class="p-head"></p>
            <p class="p-content"></p>
          </div>
          <div class="right-item-right">
            <img src="../assets/main_head_img.png" style="width: 100%;position: absolute;bottom: 0px;">
          </div>
        </div>
        <div class="img-right-item" @click="runModel">
          <div class="right-item-left">
            <p class="p-head"></p>
            <p class="p-content"></p>
          </div>
          <div class="right-item-right">
            <img src="../assets/main_head_img.png" style="width: 100%;position: absolute;bottom: 0px;">
          </div>
        </div>
        <div class="img-right-data">
          <div class="data-head">
            <p v-if="!isOpen">未开启</p>
            <p v-if="isOpen">结果</p>
            <Icon v-if="!isOpen" type="ios-alert-outline" size="20"/>
            <Icon v-if="isOpen" type="md-checkmark-circle-outline" color="#B6EDC4" size="20"/>
          </div>
          <div class="data-body">
            <div class="data-content">
              <div class="data-content-left">
                <div class="data">
                  <Icon type="ios-body" color="#868686" size="16"/>
                  <p><span style="font-weight: bolder; color: #3862F7">{{ pre_num }}</span></p>
                </div>
              </div>
              <div class="data-content-right"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {initFlask} from "@/api";
import {showtModel} from "@/api";

export default {
  name: "Main",
  data(){
    return{
      headList:[
        {
          title:'未处理',
          counts:86,
          icon:'ios-at',
          text:'Available hospital beds'
        },
        {
          title:'已处理',
          counts:127,
          icon:'ios-at',
          text:'Available hospital beds'
        },
        {
          title:'未数据分析',
          counts:100,
          icon:'ios-at',
          text:'Available hospital beds'
        }
      ],
      isStart:false,
      isOpen:false,
      pre_num:'-'
    }
  },
  methods:{
    startVideoStream() {
      this.isStart = true
      this.isOpen = false
      const video = this.$refs.videoPlayer;
      const streamURL = "http://192.168.43.69:5000/streamer"
      video.src = streamURL
      this.pre_num = '-'
    },
    stopVideoStream(){
      const video = this.$refs.videoPlayer;
      const streamURL = ""
      video.src = streamURL
    },
    runModel(){
      // const video = this.$refs.videoPlayer;
      // const streamURL = "http://192.168.43.69:5000/show-model"
      // video.src = streamURL
      this.isStart = true
      this.isOpen = true
      showtModel().then(res=>{
        // console.log(res)
        const video = this.$refs.videoPlayer;
        const streamURL = "http://192.168.43.69:5000/show-model"
        video.src = streamURL
        this.pre_num = 8
      })
    }
  },
  mounted() {
    initFlask().then(res=>{
      console.log(res)
      console.log("前端已启动后端")
    })
  },
}
</script>

<style scoped>
.main{
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 20px;
}
.main-head{
  width: 100%;
  height: 200px;
  background-color: #f8f8f8;
  display: flex;
  border-radius: 5px;
  box-sizing: border-box;
  border: 1px solid #efefef;
  align-items: center;
  padding-left: 20px;
  justify-content: space-between;
}
.img-deal{
  width: 340px;
  height: 160px;
  background-color: #fff;
  box-sizing: border-box;
  padding: 10px 20px;
  margin-right: 20px;
  border-radius: 5px;
  border: 1px solid #efefef;
}
.img-deal-top{
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #efefef;
}
.img-deal-bottom{
  padding-top: 10px;
  height: 85px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.bottom-left{
  display: flex;
  flex-direction: column;
}
.img-video{
  width: 100%;
  background-color: #efefef;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  height: 560px;
}
.flipped-image{
  /*transform: scaleX(-1);*/
  /*transform: scaleY(-1);*/
  width:853px;
  height: 520px;
  border-radius: 5px;
  margin-right: 20px;
  background-color: #fff;
  overflow: hidden;
  box-sizing: border-box;
  border: 1px solid #808080;
  display: flex;
  align-items: center;
  justify-content: center;
}
.img-right{
  width: 0;
  flex: 1;
  height: 100%;
  position: relative;
}
.img-right-item{
  width: 100%;
  height: 80px;
  background-color: #fff;
  box-sizing: border-box;
  margin-bottom: 30px;
  box-shadow: 2px 3px 6px #d2d2d2;
  border-radius: 5px;
  padding: 10px 14px;
  display: flex;
  justify-content: space-between;
}
.right-item-left{
  width: 0;
  flex: 1;
  height: 100%;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.right-item-right{
  width: 30%;
  height: 100%;
  position: relative;
}
.p-head{
  font-size: 16px;
  color: #000;
  font-weight: bolder;
}
.p-content{
  white-space: nowrap; /* 防止文本换行 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  overflow: hidden;
  font-size: 10px;
  color: #868686;
}

/**/
.img-right-data{
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 140px;
  background-color: #fff;
  box-sizing: border-box;
  border: 1px solid #d2d2d2;
  border-radius: 5px;
  box-shadow: 2px 3px 6px #d2d2d2;
  display: flex;
  flex-direction: column;
}
.data-head{
  width: 100%;
  height: 50px;
  display: flex;
  padding: 10px 14px;
  justify-content: space-between;
  box-sizing: border-box;
  border-bottom: 1px solid #d2d2d2;
  align-items: center;
}
.data-head p{
  font-weight: bolder;
}
.data-body{
  box-sizing: border-box;
  width: 100%;
  height: 0;
  flex: 1;
  padding: 20px 14px;
}
.data-content{
  width: 100%;
  display: flex;
  height: 100%;
  border-radius: 5px;
  overflow: hidden;
}
.data-content-left{
  width: 30%;
  height: 100%;
  background-color: #3862F7;
  box-sizing: border-box;
  padding: 10px;
  position: relative;
}
.data-content-right{
  width: 0;
  flex: 1;
  height: 100%;
  background-color: #C7D5F8;
}
.data{
  width: 220%;
  height: 60%;
  background-color: #ffffff;
  position: absolute;
  border-radius: 3px;
  z-index: 10;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  padding: 0px 4px;
}
.data p{
  margin-left: 4px;
  font-size: 12px;
}
</style>