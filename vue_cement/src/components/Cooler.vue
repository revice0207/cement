<template>
  <div class="ct">
    <div class="upload-img">
      <div class="upload-wrap">
          <Button class="upload-btn">
            <input type="file" name="file" ref="fileInput" @change="handleFileChange"/>

          </Button>
        <div class="upload-content">
          <p style="font-size: 16px;color: #000;margin-bottom: 5px"></p>
          <p style="font-size: 10px"> </p>
        </div>
      </div>
      <div class="upload-text">
        <p>• 为展示更清晰的，可通过上传图片进行人流量预测</p>
        <p>• 支持多种上传图片的格式，大小不限</p>
        <p>• 单张图片的上传会返回模型预测结果和运行速度等数据</p>
      </div>
    </div>
    <div class="show-img">
      <div class="show-wrap">
        <div v-if="!isUpload">{{text}}</div>
        <img v-else src="http://192.168.43.69:5000/upload-show"/>
      </div>
      <div class="show-analysis">
        <div class="analysis-data">
          <p>• 图片读取时间：<span>{{read_img_time}}</span></p>
          <p>• 模型加载时间：<span>{{load_model_time}}</span></p>
          <p>• 模型预测时间：<span>{{pre_time}}</span></p>
          <p>• 模型预测人数：<span>{{pre_numbers}}</span></p>
        </div>
        <div class="analysis-img">
          <img src="../assets/main_head_img.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {uploadImg} from "@/api";
import {uploadImage} from "@/api";
import axios from "axios";
import {test} from "@/api";

export default {
  name: "ct",
  data(){
    return{
      file:null,
      show_URL:'',
      imgURL:'',
      read_img_time:'-',
      load_model_time:'-',
      pre_time:'-',
      pre_numbers:'-',
      isUpload:false,
      text:'未上传图片'
    }
  },
  methods:{
    handleFileChange(e){
      this.text = '请等待识别'
      let file = e.target.files[0];
      let param = new FormData(); //创建form对象
      param.append('file',file);//通过append向form对象添加数据
      console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
      this.$axios.post('http://192.168.43.69:5000/upload',param,{headers:{'Content-Type':'application/x-www-form-urlencoded' }}, ) //请求头要为表单
          .then(response=>{
            console.log(response)
            this.isUpload = true
            if (response.data){
              const imgElement = document.getElementById('Img')
              imgElement.src = ''
              imgElement.src = 'http://192.168.43.69:5000/upload-show'
              this.read_img_time = response.data.read_img_time
              this.load_model_time = response.data.prepare_model_time
              this.pre_numbers = response.data.pre_num
              this.pre_time = response.data.out_img_time
            }
          })
          .catch(function (error) {
            console.log(error);
          })
    },
    getData(){
      this.$axios.get('all/').then((res)=>{
        console.log(res)
        console.log("this is zrc")
      })
    }
  },
  mounted() {
    console.log("tesst")
    test().then(res=>{
      console.log(res, "test")
    })
    this.getData()
  }

}
</script>

<style scoped>
.ct{
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 20px;
  display: flex;
  justify-content: space-between;
}
.upload-img{
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 30px;
}
.upload-wrap{
  width: 100%;
  height: 65%;
  background-color: #efefef;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  /*box-shadow: 0px 3px 3px 3px #efefef;*/
  margin-bottom: 20px;
}
.upload-text{
  width: 100%;
  flex: 1;
  box-shadow: 0px 5px 7px 7px #efefef;
  box-sizing: border-box;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 5px;
  font-size: 14px;
  color: #000;
}
.upload-btn{
  width: 240px;
  height: 60px;
  margin-bottom: 30px;
  background-color: #3862F7;
  color: #fff;
  font-weight: bolder;
  overflow: hidden;
}
.upload-btn input{
  background-color: #3862F7;
  color: #fff;
}
.upload-content{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.template{
  flex-grow: 1;
}
.show-img{
  flex: 1;
  height: 100%;
  /*background-color: #efefef;*/
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.show-wrap{
  width: 100%;
  height:65%;
  background-color: #efefef;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-bottom: 20px;
}
.show-wrap img{
  height: 100%;
}
.show-analysis{
  width: 100%;
  flex: 1;
  /*background-color: #3862F7;*/
  border-radius: 5px;
  box-shadow: 0px 5px 7px 7px #efefef;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.analysis-data{
  width: 60%;
  height: 100%;
  /*background-color: #FF5722;*/
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.analysis-data p{
  color: #000;
  font-size: 14px;
}
.analysis-data p span{
  color: #3862F7;
  font-weight: bolder;
}
.analysis-img{
  width: 25%;
}
.analysis-img img{
  width: 100%;
}
/deep/ #file-upload-button{
  display: none;
}
</style>