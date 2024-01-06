<template>
  <div class="home">
    <!--  侧边栏  -->
    <aside :class="asideClassName">
      <!--   logo   -->
      <div class="aside-logo" :class="isShowAsideTitle? '' : 'aside-logo-img-center'">
        <img src="../assets/logo1.png" alt="logo" class="aside-logo-img" >
        <span v-show="isShowAsideTitle" style="margin-left: 20px"></span>
      </div>
      <!-- search -->
      <!--      <div class="aside-search">-->

      <!--      </div>-->
      <!--   菜单栏   -->
      <Menu
          class="menu"
          ref="asideMenu"
          width="100%"
          :open-names="openMenus"
          :active-name="currentPage"
          @on-select="selectMenuCallBack"
          @on-open-change="menuChange"
      >
        <div v-for="(item, index) in menuItems" :key="index">
          <!-- 菜单栏包含一级菜单的二级动态菜单 -->
          <MenuGroup
              v-if="item.children"
              :title="isShowAsideTitle? item.text : item.hide"
              :class="isShowAsideTitle? '' : 'group-hide'"
              :name="index"
          >
            <div v-for="(subItem, i) in item.children" :key="index + i" >
              <template>
                <MenuItem
                    :name="'external-link-' + index + '-' + i"
                    class="menu-item"
                    :class="isShowAsideTitle? '' : 'shrink'"
                >
                  <Icon size="18" :type="subItem.type"/>
                  <span v-show="isShowAsideTitle">{{subItem.text}}</span>
                </MenuItem>
              </template>
            </div>
          </MenuGroup>

          <!-- 一级菜单 -->
          <template v-else-if="!item.hidden">
            <MenuItem
                :class="isShowAsideTitle? '' : 'shrink'"
                :name="'external-link-' + index"
            >
              <Icon :size="item.size" :type="item.type"/>
              <span v-show="isShowAsideTitle">{{item.text}}</span>
            </MenuItem>
          </template>
        </div>
      </Menu>
    </aside>
    <!--  右边部分  -->
    <section class="selection-right">
      <!--   上方部分: head+tags   -->
      <div class="selection-top">
        <!-- 头部状态栏 -->
        <header>
          <!-- 左侧：隐藏按钮+面包屑 -->
          <div class="top-left">
            <div class="pointer" title="收缩/展开" @click="isShrinkAside">
              <Icon type="md-apps" size="50" color="#ff6700"></Icon>
            </div>
            <!-- 面包屑 -->
            <div class="title-crumbs">
              <span class="crumbs" style="font-size: 18px; font-weight: bold; color: #000">Good Morning, Dr.Dai</span>
              <p class="crumbs">{{crumbs}}</p>
            </div>
          </div>
          <!-- 右侧：头像+控制面板 -->
          <div class="top-right">
            <!-- 设置 -->
            <div class="right-item">
              <Icon color="#000" type="md-cog" size="20"></Icon>
            </div>
            <!-- 消息 -->
            <div class="right-item">
              <Icon color="#000" type="ios-chatboxes" size="20"></Icon>
            </div>
            <!-- 头像 -->
            <div class="right-item">
              <img src="../assets/img.png" style="width: 40px;height: 40px;"/>
            </div>
            <!-- 下拉菜单 -->
          </div>
        </header>
        <!-- 标签栏 -->
        <div class="selection-tags">
          <!-- 标签列表 -->
          <ul class="tags-ul">
            <li v-for="(item, index) in tagsArray" :key="index" :class="{active: isActive(item.name)}" @click="activeTag(index)">
              <a class="tags-li-a">{{item.text}}1111</a>
              <Icon size="16" @click="closeTag(index)" type="md-close" />
            </li>
          </ul>
          <!-- 功能列表 -->
          <div class="tags-icons">
            <div class="icons-refresh" @click="reloadPage" title="刷新当前标签页">
              <Icon type="md-refresh" />
            </div>
            <div class="icons-close" title="关闭标签">
              <Dropdown trigger="click" @on-click="closeTags">
                <Icon type="ios-options" />
                <DropdownMenu slot="list">
                  <DropdownItem name="1">关闭其他标签</DropdownItem>
                  <DropdownItem name="2">关闭所有标签</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
      <!--   页面主体   -->

      <div class="main-content">
        <div class="view-c">
          <keep-alive :include="keepAliveData">
            <!-- 子页面 -->
            <!--            <router-view v-if="isShowRouter" />-->
            <router-link to="/main">!</router-link>
            <router-view/>
          </keep-alive>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {resetTokenAndClearUser} from "@/utils";

export default {
  name: "Home",
  data(){
    return{
      paths:{}, // 存储页面路径
      openMenus:[], // 要打开的菜单名字（name）
      menuCache:[], // 缓存已经打开的菜单
      currentPage:'',
      isShowRouter:true,
      isShowAsideTitle:true,
      asideArrowIcons:[], // 缓存左侧剪头图标
      asideClassName:'aside-big', // 缓存左侧箭头图标
      tagsArray:[],
      main:null, // 页面主要区域
      crumbs:'主页', // 面包屑
      arrowUp: false, // 用户详情向上箭头
      arrowDown: true, // 用户详情向下箭头
      home:'home', // 主页路由名称

    }
  },
  computed:{
    // 菜单栏
    menuItems(){
      return this.$store.state.menuItems
    },
    // 缓存路由
    keepAliveData(){
      return this.tagsArray.map(item =>item.name)
    },
    // 所以需要在这定义组件名称和标签栏标题的映射表 有多少个页面就有多少个映射条数
    nameToTitle() {
      const obj = {}
      this.menuItems.forEach(e => {
        this.processNameToTitle(obj, e)
      })

      return obj
    },
  },
  // 挂载
  mounted() {
    // 第一个标签
    const name = this.$route.name
    this.currentPage = name
    this.tagsArray.push({
      text: this.nameToTitle[name],
      name,
    })

    // 根据路由打开对应的菜单栏
    this.openMenus = this.getMenus(name)
    this.$nextTick(() => {
      this.$refs.asideMenu.updateOpened()
    })

    this.main = document.querySelector('.selection-right')
    console.log("main:", this.main)
    this.asideArrowIcons = document.querySelectorAll('aside')

    // 监听窗口
    this.monitorWindowSize()
  },
  // 监听部分
  watch:{
    // 路由变化
    $route(to) {
      const name = to.name
      this.currentPage = name
      if (name == 'error') {
        this.crumbs = '404'
        return
      }

      if (!this.keepAliveData.includes(name)) {
        // 如果标签超过8个 则将第一个标签删除
        if (this.tagsArray.length == 8) {
          this.tagsArray.shift()
        }
        this.tagsArray.push({ name, text: this.nameToTitle[name] })
      }

      setTimeout(() => {
        this.crumbs = this.paths[name]
      }, 0)
    },
  },
  methods:{
    // 选择菜单回调函数
    selectMenuCallBack(name){
      console.log("selectMenuCallBack")
      //if (name.includes('external-link')) return
      this.gotoPage(name)
      this.expandAside()
      setTimeout(() => {
        this.isShowAsideTitle = true
      }, 200)
    },
    // 菜单栏改变实践
    menuChange(data){
      this.menuCache = data
    },
    //
    processNameToTitle(obj, data, text) {
      if (data.name) {
        obj[data.name] = data.text
        this.paths[data.name] = text ? `${text} / ${data.text}` : data.text
      }
      if (data.children) {
        data.children.forEach(e => {
          this.processNameToTitle(obj, e, text ? `${text} / ${data.text}` : data.text)
        })
      }
    },
    // 判断是否打开左侧
    isShrinkAside(){
      if(this.isShowAsideTitle){
        this.shrinkAside()
      }else{
        this.expandAside()
      }
    },
    // 收缩左侧
    shrinkAside(){
      for (let i = 0, len = this.asideArrowIcons.length; i < len; i++) {
        //this.asideArrowIcons[i].style.display = 'none'
      }

      this.isShowAsideTitle = false
      this.openMenus = []
      this.$nextTick(() => {
        if (this.$refs.asideMenu) {
          this.$refs.asideMenu.updateOpened()
        }
      })

      setTimeout(() => {
        this.asideClassName = ''
        this.main.style.marginLeft = '90px'
      }, 0)
    },
    // 展开左侧
    expandAside(){
      setTimeout(() => {
        this.isShowAsideTitle = true
        for (let i = 0, len = this.asideArrowIcons.length; i < len; i++) {
          this.asideArrowIcons[i].style.display = 'block'
        }

        this.openMenus = this.menuCache
        if (this.$refs.asideMenu) {
          this.$refs.asideMenu.updateOpened()
        }
      }, 200)
      this.asideClassName = 'aside-big'
      this.main.style.marginLeft = '220px'
    },
    // 监听窗口大小，自动收缩侧边栏
    monitorWindowSize() {
      let w = document.documentElement.clientWidth || document.body.clientWidth
      if (w < 1300) {
        this.shrinkAside()
      }

      window.onresize = () => {
        // 可视窗口宽度太小 自动收缩侧边栏
        if (w < 1300 && this.isShowAsideTitle
            && w > (document.documentElement.clientWidth || document.body.clientWidth)) {
          this.shrinkAside()
        }

        w = document.documentElement.clientWidth || document.body.clientWidth
      }
    },
    // 跳转页面 路由名称和参数
    gotoPage(name, params){
      console.log("gotoPage", name)
      this.currentPage = name
      this.crumbs = this.paths[name]
      this.$router.push({ name, params })

      if (!this.keepAliveData.includes(name)) {
        // 如果标签超过8个 则将第一个标签删除
        if (this.tagsArray.length == 8) {
          this.tagsArray.shift()
        }
        this.tagsArray.push({ name, text: this.nameToTitle[name] })
      }
    },
    //
    getMenus(name){
      let menus
      const tagTitle = this.nameToTitle[name]
      for (let i = 0, l = this.menuItems.length; i < l; i++) {
        const item = this.menuItems[i]
        menus = []
        menus[0] = i
        if (item.text == tagTitle) {
          return menus
        }

        if (item.children) {
          for (let j = 0, ll = item.children.length; j < ll; j++) {
            const child = item.children[j]
            menus[1] = i + '-' + j
            menus.length = 2
            if (child.text == tagTitle) {
              return menus
            }

            if (child.children) {
              for (let k = 0, lll = child.children.length; k < lll; k++) {
                const grandson = child.children[k]
                menus[2] = i + '-' + j + '-' + k
                if (grandson.text == tagTitle) {
                  return menus
                }
              }
            }
          }
        }
      }
    },

    // 判断当前标签页是否激活状态
    isActive(name) {
      return this.$route.name === name
    },
    // 激活标签
    activeTag(i) {
      this.gotoPage(this.tagsArray[i].name)
      console.log("1")
      console.log(this.tagsArray)
    },
    // 关闭单个标签
    closeTag(i) {
      let name = this.tagsArray[i].name
      this.tagsArray.splice(i, 1)
      window.event.stopPropagation()
      // 如果关闭的是当前标签 则激活前一个标签
      // 如果关闭的是第一个标签 则激活后一个标签
      if (this.tagsArray.length) {
        if (this.isActive(name)) {
          if (i != 0) {
            this.gotoPage(this.tagsArray[i - 1].name)
          } else {
            this.gotoPage(this.tagsArray[i].name)
          }
        }
      } else if (name != this.home) {
        // 如果没有标签则跳往首页
        this.gotoPage(this.home)
      } else {
        this.reloadPage()
      }
    },
    // 批量关闭标签
    closeTags(flag){
      console.log(this.$router)
      if (flag == 1) {
        // 关闭其他标签
        this.tagsArray = []
        this.gotoPage(this.$route.name)
      } else {
        // 关闭所有标签
        this.tagsArray = []
        this.gotoPage(this.home)
        this.reloadPage()
      }
    },
    // 刷新当前标签页
    reloadPage() {
      let name = this.$route.name
      let index = this.keepAliveData.indexOf(name)
      this.$nextTick(() => {
        if (this.tagsArray.length) {
          this.isShowRouter = false
          this.tagsArray.splice(index, 1)
          this.$nextTick(() => {
            this.tagsArray.splice(index, 0, { name, text: this.nameToTitle[name] })
            this.gotoPage(name)
            this.isShowRouter = true
          })
        } else {
          this.isShowRouter = false
          this.$nextTick(() => {
            this.tagsArray.push({ name, text: this.nameToTitle[name] })
            this.gotoPage(name)
            this.isShowRouter = true
          })
        }
      })
    },
    // 消息通知
    info() {
      const self = this
      this.$Notice.info({
        title: `您有${this.msgNum}条消息`,
        render(h) {
          return h('Button', {
            attrs: {
              type: 'info',
              size: 'small',
            },
            on: {
              click() {
                // 点击查看跳转到消息页
                self.gotoPage('msg')
                self.hasNewMsg = false
                self.msgNum = 0
              },
            },
          }, [
            '点击查看',
          ])
        },
      })
    },
  }
}
</script>

<style scoped>
.home{
  height: 100%;
  color: #868686;
}
aside{
  position: fixed;
  top: 0;
  left: 0;
  width: 90px;
  height: 100%;
  transition: width .3s;
  overflow: auto;
  background-color: #efefef;
  /*background-color: #ff6700;*/
}
.aside-logo{
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 16px;
  padding: 15px;
  box-sizing: border-box;
  /*justify-content: center;*/
  margin-bottom: 4px;
  background-color: white;
}
.aside-logo-img{
  width: 40px;
}
.aside-logo-img-center{
  display: flex;
  justify-content: center;
}
.aside-search{
  margin: 15px;
  background-color: #efe0e1;
  width: 220px;
  height: 40px;
  box-sizing: border-box;

}
.aside-big{
  width: 220px;
}
.shrink{
  text-align: center;
}
.group-hide{
  max-width: 60px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
/* 菜单栏 */
.menu{
  justify-content: left;
  text-align: left;
}
.menu-item{
  /*margin-left: 15px;*/
  color: #868686;
}
.menu-item:hover{
  color: #3862F7;
}

/* 二级菜单栏*/

/* 右边部分 */
.selection-right{
  height: 100%;
  margin-left: 220px;
  transition: margin-left .3s;
  overflow: hidden;
  background-color: #efefef;
  padding-left: 4px;
}
/* 头部 */
header{
  height: 70px;
  border-bottom: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 40px;
  padding-left: 10px;
  font-size: 14px;
  /*background-color: #97a8be;*/
  box-sizing: border-box;
  background-color: white;
  margin-bottom: 4px;
}
.top-left{
  display: flex;
  align-items: center;
}
.crumbs {
  margin-left: 10px;
  cursor: default;
}
.top-right{
  display: flex;
}
.right-item{
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  margin-right: 10px;
  border-radius: 50%;
  border: 1px solid #efefef;
  overflow: hidden;
}
/* 标签栏 */
.selection-tags{
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px 0 10px;
  background-color: white;
}
.tags-ul{
  height: 40px;
  background: #fff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 10px;
  overflow: hidden;
  width: calc(100% - 160px);
}
.tags-ul li {
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  height: 24px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 3px 5px 2px 3px;
  border: 1px solid #e6e6e6;
}
.tags-li-a{
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.tags-icons{
  display: flex;
  width: 100px;
  font-size: 18px;
  justify-content: flex-start;
  align-items: center;

}
.icons-refresh{
  margin: 0 30px;
  cursor: pointer;
}
/* 页面主体 */
.main-content{
  height: calc(100% - 88px);
  overflow: hidden;
}
.view-c {
  position: relative;
  height: 100%;
  overflow: hidden;
}

/*
 修改原生样式
 */
/deep/ .ivu-menu-item-group-title{
  color: #d0d0d0;
}
</style>