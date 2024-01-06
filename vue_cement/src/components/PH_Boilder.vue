<template>
  <div class="threeD">
    <div class="threeD-left">
      <div class="head"></div>
      <div class="video-content">
        <div v-if="!isOpen"></div>
        <img v-else :src="videoURL" />
      </div>
      <div class="msg">
        <Button class="video-btn" icon="md-power" @click="startVideo"></Button>
        <Button class="video-btn" icon="md-refresh" @click="refreshPage"></Button>
      </div>
    </div>
    <div class="threeD-right">
      <div id="mychart" class="right-chart"></div>
      <div class="right-data">
        <div class="content">
          <p>• <span>{{read_img_time}}</span></p>
          <p>• <span>{{load_model_time}}</span></p>
          <p>• <span>{{pre_time}}</span></p>
          <p>• <span>{{pre_numbers}}</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import data from "@/router/video_json";
export default {
  name: "threeDModel",
  data(){
    return{
      videoURL:'',
      data:[1,2,3,4,5],
      xData: [1,2,3,4,5,6,7,8,9,10],
      yData: [],
      data_json : data,
      tempList:[],
      addData:{
        xAxis: {
          boundaryGap: false,
          type: 'category',
          data: this.xData
        },
        yAxis: {
          name:'',
          type:'value'
        },
        series: [
          {
            // data: this.yData,
            data: [],
            type: "line", // 类型设置为饼图
            areaStyle:{}
          }
        ],
      },
      index:10,
      read_img_time:'-',
      load_model_time:'-',
      pre_time:'-',
      pre_numbers:'-',
      isOpen:false
    }
  },
  methods:{
    startVideo(){
      this.isOpen = true
      this.videoURL = 'http://192.168.43.69:5000/show-video'
      setInterval(this.changeEcharts, 1000); // 每过1/20秒执行一次，即50毫秒
    },
    refreshPage(){
      // this.videoURL = 'http://192.168.43.69:5000/show-video'
      this.isOpen = false
      this.videoURL = ''

    },
    changeEcharts(){
      // 获取下一个数据
      const nextData = this.data_json[this.index];
      // 移除tempList的第一个数据
      this.tempList.shift();

      // 将下一个数据添加到tempList末尾
      this.tempList.push(nextData);

      // 增加索引
      this.index++;

      // 如果已经遍历完data_json数组，重置索引并重新加载tempList
      if (this.index >= this.data_json.length) {
        this.index = 0;
        this.tempList = this.data_json.slice(0, 10);
      }
      this.xData.shift()
      this.xData.push(this.index)
      this.yData.length = 0
      this.tempList.map((item, index)=>{
        this.yData.push(item.pre_num)
      })
      this.addData.xAxis.data = this.xData
      this.addData.series[0].data = this.yData
      this.myChart.setOption(this.addData)

      this.read_img_time = nextData.read_img_time
      this.load_model_time = nextData.pre_model_time
      this.pre_time = nextData.out_img_time
      this.pre_numbers = nextData.pre_num
      console.log(nextData)
    }
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById("mychart"), 'light');
    this.myChart.setOption(this.addData, 1000);
    //随着屏幕大小调节
    window.addEventListener("resize", () => {
      this.myChart.resize();
    });

    this.tempList = this.data_json.slice(0,10)


  }
}
</script>

<style scoped>
.threeD{
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 20px;
  display: flex;
  justify-content: space-between;
}
.threeD-left{
  width: 60%;
  height: 100%;
  /*background-color: #FF5722;*/
  margin-right: 20px;
  box-sizing: border-box;
  padding: 0 15px;
  box-shadow: 0px 5px 7px 7px #efefef;
  border-radius: 5px;
}
.head{
  width: 100%;
  height: 10%;
  /*background-color: #3862F7;*/
  line-height: 60px;
  color: #000000;
  font-weight: bolder;
  font-size: 20px;
}
.video-content{
  width: 100%;
  height: 75%;
  /*background-color: #808080;*/
  margin-bottom: 20px;
  border: 1px solid #808080;
  display: flex;
  align-items: center;
  justify-content: center;
}
.video-content img{
  width: 100%;
  height: 100%;
}
.msg{
  width: 100%;
  height: 9%;
  /*background-color: #FF5722;*/
}
.video-btn{
  width: 120px;
  height: 100%;
  background-color: #3862F7;
  color: #fff;
  margin-right: 40px;
  font-size: 16px;
}
.threeD-right{
  flex: 1;
  height: 100%;
  /*background-color: #3862F7;*/
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.right-chart{
  width: 100%;
  height: 40%;
  box-sizing: border-box;
  box-shadow: 0px 5px 7px 7px #efefef;
  margin-bottom: 20px;
  border-radius: 5px;
}
.right-data{
  width: 100%;
  height: calc(60% - 20px);
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 20px;
  box-shadow: 0px 5px 7px 7px #efefef;
  border-radius: 5px;
}
.title{
  height: 30%;
  width: 100%;
  color: #3862F7;
  font-weight: bolder;
  font-size: 20px;
}
.content{
  height: 50%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.content p{
  color: #000;
}
.content span{
  color: #3862F7;
  font-weight: bolder;
}
</style>