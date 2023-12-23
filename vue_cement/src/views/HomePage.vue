<template>
  <div class="homepage">
    <div class="home_title">
      <!--   1-1: bread crumb   -->
      <el-page-header
          @back="isCollapse = !isCollapse"
          title="Collapse"
          :icon="null">
<!--        <template #breadcrumb>-->
<!--          <el-breadcrumb separator="/">-->
<!--            <el-breadcrumb-item>-->
<!--                HomePage-->
<!--            </el-breadcrumb-item>-->
<!--          </el-breadcrumb>-->
<!--        </template>-->
        <template #content>
          <div class="flex items-center">
            <el-avatar
                class="mr-3"
                :size="32"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
            <span
                class="text-large font-600 mr-3"
                style="margin: 0 10px"
            > Title   </span>
            <span
                class="text-sm mr-2"
                style="color: var(--el-text-color-regular);margin-right: 20px"
            >
            Sub title
          </span>
            <el-tag>Default</el-tag>
          </div>
        </template>
        <template #extra>
          <div class="flex items-center">
            <el-button circle>
              <el-icon><Sunny /></el-icon>
            </el-button>
            <el-button circle>
              <el-icon><Moon /></el-icon>
            </el-button>
          </div>
        </template>
      </el-page-header>
    </div>
    <div class="home_body">
      <!--   2-1: menu options  -->
      <div class="menu_list">
        <!-- radio group and menu -->
<!--        <el-button @click="isCollapse = !isCollapse">Click Me</el-button>-->
        <el-menu
          default-active="2"
          :collapse="isCollapse"
          @open="handleOpen"
          @close="handleClose"
          :collapse-transition="false"
        >
          <el-menu-item v-for="(item, index) in menuList" :key="index" :index="item.index">
            <el-icon><component :is="item.icon" /></el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </el-menu>
        <el-button>demo</el-button>
      </div>
      <!--   2-2: analysis data - input/output   -->
      <div class="analysis_content">
        <!--    2-2-1: upload component    -->
        <div class="upload_data">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
          >
            <template #trigger>
              <el-button type="default" style="margin-right: 20px">uploadFile</el-button>

            </template>
            <el-button type="primary" @click="handleUpload">
              analysis
            </el-button>
          </el-upload>
        </div>
        <!--    2-2-2: data wrap    -->
        <div class="data_wrap">
          <!--     2-2-2-1: input and output     -->
          <div class="data_stream">
            <!--      2-2-2-1-1: input data      -->
            <el-scrollbar class="data_input">
              <p>111</p>
            </el-scrollbar>
            <!--      2-2-2-1-2: output data      -->
            <el-scrollbar class="data_output">
              <!--       2-2-1-2-1: output title       -->
              <div class="output_title">
                <el-text>
                  Output data
                  <el-icon><Odometer/></el-icon>
                </el-text>
                <el-button>Button</el-button>
              </div>
              <!--       2-2-1-2-2: output draw       -->
              <div class="output_draw">
                <div class="chart_item">
                  <div class="chart_title">
                    chart_title
                  </div>
                  <div class="pie_chart" ref="pieChart1"></div>
                </div>
                <div class="chart_item">
                  <div class="chart_title">
                    chart_title
                  </div>
                  <div class="pie_chart" ref="pieChart2"></div>
                </div>
                <div class="chart_item">
                  <div class="chart_title">
                    chart_title
                  </div>
                  <div class="pie_chart" ref="pieChart3"></div>
                </div>
              </div>
              <!--       2-2-1-2-3: output context       -->
              <div class="output_context"></div>
            </el-scrollbar>
          </div>
          <!--     2-2-2-2: data introduce     -->
          <div class="data_introduce">
            <div class="data_latex">
              <el-text style="margin-bottom: 20px">相关公式</el-text>
              <el-carousel height="150px">
                <el-carousel-item class="latex_wrap">
                  <div v-katex class="latex_item">{{latexContent}}</div>
                  <span class="latex_content">预热器飞灰计算公式</span>
                </el-carousel-item>
                <el-carousel-item>
                  <div v-katex class="latex_item">
                    {{latexContent}}
                  </div>
                </el-carousel-item>
                <el-carousel-item>
                  <div v-katex class="latex_item">
                    {{latexContent}}
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
            <el-scrollbar class="data_markdown">
              <div v-html="renderedMarkDown"></div>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Odometer} from "@element-plus/icons-vue";
import * as echarts from 'echarts'
import katex from 'katex'
import MarkdownIt from 'markdown-it'
export default {
  name: "HomePage",
  components: {Odometer},
  data(){
    return{
      isCollapse:true,
      menuList:[
        {index:1, icon:'Dish', title:'PH锅炉'},
        {index:2, icon:'Cpu', title:'悬浮预热器'},
        {index:3, icon:'Help', title:'分解炉'},
        {index:4, icon:'Place', title:'回转窑'},
        {index:5, icon:'IceCream', title:'冷却机'},
        {index:6, icon:'PictureRounded', title:'AQC锅炉'},
      ],
      latexContent: '$$ \\rho_f=\\frac{C O_2^f \\times \\rho_{C O_2}+C O^f \\times \\rho_{C O}+O_2^f \\times \\rho_{O_2}+N_2^f \\times \\rho_{N_2}+H_2 O^f \\times \\rho_{H_2 O}}{100}\n $$',
      markdownText: `### 6. AQC锅炉

进入节点：来自冷却机的空气，飞灰，以及液态水

| 冷却机空气 | mAk |
| --- | --- |
| 冷却机的飞灰 | mAfh |
| 液态水 | mAw |

进入节点的物质总和：mAk+mAfh+mAw

进入节点的能量总和：QAk+QAfh+QAw

---

离开节点：AQC锅炉排出冷却机空气和飞灰，以及水蒸气

| AQC锅炉排出冷却机空气 | m’Ak | Q’Ak |
| ------- | ------- | ------- |
| 冷却机飞灰 | m’Afh | Q’Afh |
| 水蒸气 | mAzq | QAzq |

离开节点的物质总和：m’Ak+m’Afh+mAzq

离开节点的能量总和：Q’Ak+Q’Afh+QAzq`
    }
  },
  methods:{
    // 处理上传文件
    handleUpload(){
      this.$refs.uploadRef.submit()
    },
    // 上传成功的处理
    handleSuccess(){

    },
    createChart(param){
      const myChart = echarts.init(param);
      const option = {
        title: {
          text: '40%',
          left: 'center',
          top: 61.5,
          textStyle:{
            color:'#1890fe'
          }
        },
        visualMap: {
          show: false,
        },
        // stillShowZeroSum: true,
        //鼠标划过时饼状图上显示的数据
        tooltip: {
          trigger: 'item',
          formatter: '{a}<br/>{b}:{c} ({d}%)'
        },
        //图例
        legend: {//图例  标注各种颜色代表的模块
          // orient: 'vertical',//图例的显示方式  默认横向显示
          bottom: 10,//控制图例出现的距离  默认左上角
          left: 'center',//控制图例的位置
          // itemWidth: 16,//图例颜色块的宽度和高度
          // itemHeight: 12,
          textStyle: {//图例中文字的样式
            color: '#000',
            fontSize: 16
          },
          data: ['未领取', '处理中', '已完成']//图例上显示的饼图各模块上的名字
        },
        //饼图中各模块的颜色
        color: ['#32dadd', '#b6a2de', '#5ab1ef'],
        // 饼图数据
        series: [
          {
            type: 'pie',
            //环形显示饼状图，实际上显示的是50-80之间的部分
            //上限不建议设置为100，echarts自带动画效果，设置为100动画效果很丑
            radius: ['50%', '80%'],
            center: ['50%', '50%'],
            data: [
              //itemSyle是单项的背景颜色设置。
              { value: 60, itemStyle: { color: '#f1f1f1' } },
              { value: 40, itemStyle: { color: '#1890fe' } },
            ],
            label: {
              //将视觉引导图关闭
              show: false,
            },
            itemStyle:{
              //设置的是每项之间的留白
              borderWidth:7,
              borderColor:'#fff'
            },
            // 初始化echarts的动画效果
            animationType: 'scale',
            animationEasing: 'elasticOut',
            // animationDelay: function (idx) {
            //   return Math.random() * 200;
            // }
          }
        ]
      }
      myChart.setOption(option)
    }
  },
  mounted() {
    this.createChart(this.$refs.pieChart1)
    this.createChart(this.$refs.pieChart2)
    this.createChart(this.$refs.pieChart3)
  },
  computed:{
    renderedLatex(){
      try {
        return katex.render(this.latexContent, this.$refs.LatexItem, {throwOnError: false})
      }catch (error){
        return `<p>Error rendering LaTeX: ${error.message}</p>`;
      }
    },
    renderedMarkDown(){
      const md = new MarkdownIt()
      return md.render(this.markdownText)
    }
  }
}
</script>

<style scoped>
:root{
  --background-day: #fff;
  --background-night: #000
}
html {
  font-size: 16px; /* 设置根元素字体大小为 16px */
}

.homepage{
  width: 100%;
  height: 100vh;
  /*background-color: #42b983;*/
}
/* 1 home title */
.home_title{
  width: 100%;
  height: 8vh;
  box-sizing: border-box;
  padding: 10px;
  /*background-color: #cccccc;*/
  /*display: flex;*/
  /*align-items: center;*/
  /*justify-content: space-between;*/
}
.home_body{
  width: 100%;
  height: 92vh;
  display: flex;
}
.menu_list{
  /*flex-basis: 240px;*/
  height: 100%;
  box-sizing: border-box;
  padding-right: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}
.analysis_content{
  box-sizing: border-box;
  padding: 0 10px;
  flex-grow: 1;
  height: 100%;
  /*background-color: plum;*/
  display: flex;
  flex-direction: column;
}
.upload_data{
  width: 100%;
  /*background-color: mediumvioletred;*/
  height: 8vh;
  box-sizing: border-box;
  margin-bottom: 10px;
}
.data_wrap{
  width: 100%;
  /*background-color: deeppink;*/
  background-color: #e0e0e0;
  height: calc(100% - 60px);
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
}
.data_stream{
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 10px;
  /*margin-right: 10px;*/
  /*background-color: #42b983;*/
}
.data_input{
  width: 100%;
  height: 50%;
  background-color: #ffffff;
  box-sizing: border-box;
  margin-bottom: 10px;
}
.data_output{
  width: 100%;
  height: 50%;
  background-color: #ffffff;
}
.output_title{
  width: 100%;
  height: 60px;
  /*background-color: coral;*/
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 10px;
}
.output_draw{
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: space-between;
  /*background-color: peachpuff;*/
}
.chart_item{
  width: 30%;
  height: 100%;
  /*background-color: #42b983;*/
}
.chart_title{
  width: 100%;
  margin: 10px auto;
  text-align: center;
}
.pie_chart{
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.output_context{
  width: 100%;
  height: 100px;
  background-color: violet;
}
.data_introduce{
  width: 40%;
  height: 100%;
  /*background-color: darkorange;*/
  box-sizing: border-box;
  padding: 10px 10px 10px 0;
}
.data_latex{
  background-color: #fff;
  box-sizing: border-box;
  padding: 10px;
  margin-bottom: 10px;
  height: 25%;
}
.latex_wrap{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.latex_item{
  font-size: 12px;
  margin-bottom: 30px;
}
.latex_content{
  font-size: 14px;
}
.data_markdown{
  /*background-color: #42b983;*/
  background-color: white;
  width: 100%;
  height: calc(75% - 10px);
  overflow: hidden;
  box-sizing: border-box;
  padding: 10px;
  margin-bottom: 10px;
}
/* inside */
.items-center{
  display: flex;
  align-items: center;
}
@media screen and (max-width: 767px){
  .homepage{
    background-color: #9C1A1C;
    width: 100%;
    height: 100%;
  }
  /* 1 home title */
  .home_title{
    background-color: #485F6E;
    height: 3rem;
  }
  .home_body{
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .menu_list{
    flex-basis: unset;
    width: 100%;
    height: 5rem;

  }
  .analysis_content{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: gold;
  }
  .upload_data{
    width: 100%;
    height: 3rem;
    background-color: chartreuse;
  }
  .data_wrap{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: khaki;
  }
  .data_stream{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: tan;
  }
  .data_input{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 10rem;
    background-color: linen;
  }
  .data_output{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: darksalmon;
  }
  .output_title{
    width: 100%;
    height: 3rem;
    background-color: yellow;
  }
  .output_draw{
    display: flex;
    flex-direction: column;
    background-color: orange;
    width: 100%;
    height: 15rem;
  }
  .output_context{
    width: 100%;
    height: 10rem;
    background-color: yellowgreen;
  }
  .data_introduce{
    width: 100%;
    height: 10rem;
  }
}
/* element plus */
/deep/ .el-page-header{
  /*background-color: #42b983;*/
  width: 100%;
}
/deep/ .el-menu{
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
/deep/ .el-menu-item{
  /*margin-bottom: 60px;*/
}
</style>