<!DOCTYPE html>
<template>
  <div>
    <div class="otherTipELD" v-show="otherTipELD">
      <div class="pic">
        <div :class="erweima">
          <img :src="loginCodeImg" alt="">
        </div>
        <p v-text="logintext"></p>
      </div>
    </div>
    <div class="nav">
      <div class="brand">
        <img class="logo" :src="LOGO" alt="">
        <p class="pageTitle">{{TITLE}}</p>
        <div class="pageTime" v-html="time"></div>
      </div>
      <div class="topOther">
        <img src="../assets/icon_tixing@2x.png" alt="">
        <span>设计师/合作匠人/合作内控/合作质检/订单收款流水等更多功能，正在开发中··· 敬请期待！</span>
      </div>
    </div>

    <div class="flex">
      <ul class="pageslide">
        <li class="h355">
          <div class="itemData" @click.prevent="brandtemp">
            <div class="itemTitle"><span>工厂品牌环节数量</span></div>
            <div style="width: 80%;height: 90%;" id="pietable1"></div>
          </div>
        </li>
        <li class="h295">
          <div class="itemData" @click.prevent="theHousetemplate">
            <div class="itemTitle"><span>样板房城市数量</span></div>
            <div id="bartable1"></div>
          </div>
        </li>
        <li class="h275 flex">
          <div class="itemData specialitemData"  @click="theServerstemplate">
            <div class="itemTitle"><span>合作业务员城市分布</span></div>
            <div style="width: 100%;height: 90%;margin: 0 auto 0;" id="pietable2"></div>
          </div>
          <div class="itemData ml10 specialitemData" @click.prevent="showThisPage(7)">
            <div class="itemTitle"><span>服务商城市分布</span></div>
            <div style="width: 100%;height: 90%;margin: 0 auto 0;" id="pietable3"></div>
          </div>
        </li>
      </ul>
      <div class="templateinner ml10" id="pietable1" style="overflow: hidden;">
        <div class="template">
          <brands v-if="showPage==1" @productPage="productPage" :linkIDH="linkID" :brandSortList="brandSortList"></brands>
          <houses v-if="showPage==2" :houseregionInfoID="houseregionInfoID" :housecityList="housecityList"></houses>
          <products v-if="showPage==3" :brandID="brandID" :brandName="brandName" @productDetailPage="productDetailPage"></products>
          <productDetail v-if="showPage==4" @backProductPage="backProductPage" :productName="productName" :productID="productID"
            :brandName="brandName"></productDetail>

          <serverPartner @backserversMap="backserversMap" @changeregionInfoID="changeregionInfoID" :provinceID="provinceID"
            :provinceName="provinceName" :provinceNameH="provinceNameH" v-if="showPage==5"></serverPartner>
          <serverPartnerMap @backserversMap="backserversMap" @backserversCityMap="backserversCityMap" :provinceNameH="provinceNameH"
            :serveregionInfoName="serveregionInfoName" :regionInfoID="regionInfoID" v-if="showPage==6"></serverPartnerMap>
          <serverPartnerBigMap @changeProvinceID="changeProvinceID" v-if="showPage==7"></serverPartnerBigMap>
          <servers v-if="showPage==8" @serversDetailPage="serversDetailPage" :serversregionInfoID="serversregionInfoID"
            :serverscityList="serverscityList"></servers>
          <serversDetail v-if="showPage==9" @theServerstemplate="theServerstemplate" @backtheServerstemplate="backtheServerstemplate"
            :serversregionInfoID="serversregionInfoID" :serversmemberGUID="serversmemberGUID" :serversName="serversName"
            :serversCity="serversCity"></serversDetail>

          <houseAllMap @changeProvinceHouseID="changeProvinceHouseID" v-if="showPage==10"></houseAllMap>
          <housePrivemceMap @backHouseMap="backHouseMap" @changeregionHouseInfoID="changeregionHouseInfoID"
            :provinceHouseID="provinceHouseID" :provinceHouseName="provinceHouseName" :provinceHouseNameH="provinceHouseNameH"
            v-if="showPage==11"></housePrivemceMap>
          <houseCityMap @backHouseCityMap="backHouseCityMap" @backHouseMap="backHouseMap" v-if="showPage==12"
            :provinceHouseNameH="provinceHouseNameH" :houseregionInfoIDName="houseregionInfoIDName" :regionHouseInfoID="regionHouseInfoID"></houseCityMap>

          <earningsAllMap @changeProvinceearningsID="changeProvinceearningsID" v-if="showPage==13"></earningsAllMap>
          <earningsPrivemceMap @backerMap="backerMap" @changeregionearningsInfoID="changeregionearningsInfoID"
            :provinceearningsID="provinceearningsID" :provinceearningsName="provinceearningsName"
            :provinceearningsNameH="provinceearningsNameH" v-if="showPage==14"></earningsPrivemceMap>
          <earningsCityMap @backerMap="backerMap" @backerCityMap="backerCityMap" v-if="showPage==15" :erregionInfoName="erregionInfoName"
            :provinceearningsNameH="provinceearningsNameH" :regionearningsInfoID="regionearningsInfoID"></earningsCityMap>
        </div>
      </div>
      <ul class="pageslide">
        <li class="h405">
          <div class="itemData" @click.prevent="showThisPage(10)">
            <div class="itemTitle"><span>城市服务楼盘</span></div>
            <div id="pietable4"></div>
          </div>
        </li>
        <li class="h540">
          <div class="itemData" @click.prevent="showThisPage(13)">
            <div class="itemTitle"><span>城市收益</span></div>
            <div style="width: 92%;height: 60%;margin: 20% auto 0;" id="bartable2"></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import "../css/index.css"
  import $ from 'jquery'

  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/bar')
  require('echarts/lib/chart/pie')
  require('echarts/lib/chart/line')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  require('echarts/lib/component/legend')
  require('echarts/lib/chart/scatter')

  import Vue from 'vue'
  import brands from './brands'
  import houses from './houses'
  import products from './products'
  import productDetail from './productDetail'
  import servers from './servers'
  import serversDetail from './serversDetail'
  // 服务商地图
  import serverPartnerBigMap from './serverPartnerBigMap'
  import serverPartnerMap from './serverPartnerMap'
  import serverPartner from './serverPartner'
  // 楼盘地图
  import houseAllMap from './houseAllMap'
  import housePrivemceMap from './housePrivemceMap'
  import houseCityMap from './houseCityMap'
  // 收益地图
  import earningsAllMap from './earningsAllMap'
  import earningsPrivemceMap from './earningsPrivemceMap'
  import earningsCityMap from './earningsCityMap'


  export default {
    data() {
      return {
        LOGO: "",
        TITLE: "",
        time: "",
        erweima: "",
        logintext: "请使用互联广场APP扫描登录",
        showPage: 0,
        otherTipELD: false,
        loginCodeImg: "",
        QRCodeToken: "",

        // 省份服务商信息
        provinceID: -1,
        provinceName: "",
        provinceNameH: "",
        // 城市服务商信息
        regionInfoID: -1,
        // 省份楼盘信息
        provinceHouseID: -1,
        provinceHouseName: "",
        provinceHouseNameH: "",
        // 城市楼盘信息
        regionHouseInfoID: -1,
        // 样板房
        housecityList: [],
        houseregionInfoID: -1,
        // 业务员
        serverscityList: [],
        serversregionInfoID: -1,
        provinceearningsNameH: '',
        // 业务员整装订单
        serversmemberGUID: "",
        serversName: "",
        serversCity: "",
        // 品牌产品
        brandID: -1,
        brandName: "",
        productID: "",
        productName: "",
        // 楼盘城市名字
        houseregionInfoIDName: "",
        serveregionInfoName: "",
        erregionInfoName: "",

        param: -1,
        linkID: "",
        getindexdata: 0,
        getindexdatax: 0,

        linkIDOld: -1,
      }
    },
    components: {
      brands,
      houses,
      products,
      productDetail,
      serverPartner,
      serverPartnerMap,
      serverPartnerBigMap,
      servers,
      serversDetail,

      houseAllMap,
      housePrivemceMap,
      houseCityMap,

      earningsAllMap,
      earningsPrivemceMap,
      earningsCityMap,
    },
    created() {},
    mounted() {
      this.getCodeimg()
      // this.testData(JSON.parse(localStorage.getItem("data")))
    },
    methods: {
      // 获取登录二维码
      getCodeimg() {
        let QRCodeToken = localStorage.getItem("QRCodeToken")
        if( QRCodeToken ){
          this.getindexdata = 0
          let _this = this
          _this.getindexdata = setInterval(()=>{
            _this.getinitMsg(QRCodeToken)
          },30000)
          return
        }else{
          this.otherTipELD = true
        }
        let _this = this
        $.ajax({
          url: baseURL + "WholeDecoration/GetWholeDecorationScreenLoginQRCode_WDBoss",
          success: res => {
            _this.loginCodeImg = res.data.QRCodeUrl
            _this.QRCodeToken = res.data.QRCodeToken
            _this.getinitMsg(_this.QRCodeToken)
          }
        })
      },

      // 获取主页信息
      getinitMsg(QRCodeToken) {
        let _this = this
        let getting = setInterval(() => {
          $.ajax({
            url: baseURL + "WholeDecoration/GetWholeDecorationScreenIndex_WDBoss",
            data: {
              QRCodeToken: QRCodeToken
            },
            success: res => {
              if (res.code == 1) {
                localStorage.setItem("QRCodeToken",QRCodeToken)
                _this.erweima = "erweima"
                if (_this.otherTipELD) {
                  setTimeout(() => {
                    _this.logintext = "登录成功"
                  }, 520)
                  setTimeout(() => {
                    _this.otherTipELD = false
                  }, 1200)
                }
                clearInterval(getting)
                let data = res.data
                // localStorage.setItem("data", JSON.stringify(data))
                // _this.brandData(data.brandData)
                _this.testData(data)
              }
            },
            error: err => {
              _this.erweima = "erweima"
              setTimeout(() => {
                _this.logintext = err.errmsg
              }, 520)
              clearInterval(getting)
            }
          })
        }, 500)
      },

      testData(data) {
        this.otherTipELD = false
          this.brandData(data.brandData)
        this.salesmanData(data.salesmanData)
        this.providerData(data.providerData)
        this.houseData(data.houseData)
        this.modelHouseData(data.modelHouseData)
        this.earningsData(data.earningsData)
        Vue.prototype.WholeDecorationID = data.WholeDecorationID
        Vue.prototype.memberGUID = data.memberGUID
        this.brandSortList = data.brandData
        if( this.getindexdatax != 1 ){
          this.showPage = 1
          this.getCodeimg()
          this.getTimeNow(data.nowTime)
        }
        this.getindexdatax = 1
        this.LOGO = data.organizationLogoUrlM
        this.TITLE = data.organizationName
      },

      // 获取当前时间
      getTimeNow(timex) {
        window.clearInterval(timerunning)
        let o = timex.split(".")
        let p = o[0].split("T")
        let data1 = p[0] + " " + p[1];
        var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")
        let time1 = new Date(Date.parse(data1.replace(/-/g, "/"))).getTime();
        let _this = this
        initTime(time1)

        function initTime(T) {
          let data3 = new Date(T); //精确到毫秒的就不用 *1000  了
          let y = data3.getFullYear(),
            month = data3.getMonth() + 1,
            dayH = data3.getDay(),
            m = month < 10 ? "0" + month : month,
            d = (data3.getDate() < 10) ? "0" + data3.getDate() : data3.getDate(),
            h = (data3.getHours() < 10) ? "0" + data3.getHours() : data3.getHours(),
            mi = (data3.getMinutes() < 10) ? "0" + data3.getMinutes() : data3.getMinutes(),
            s = (data3.getSeconds() < 10) ? "0" + data3.getSeconds() : data3.getSeconds();
          let week = weeks[dayH];
          let sendDate = y + "-" + m + "-" + d + "<span></span>" + h + ":" + mi + ":" + s + "<span></span>" + week;
          _this.time = sendDate
        }
        let timerunning = setInterval(() => {
          time1 += 1000
          initTime(time1)
        }, 1000)
      },

      // 工厂品牌环节
      brandData(list) {

        let canvas = document.getElementById('pietable1')
        var myChart = echarts.init(canvas);

        let nameList = []
        let dataList = []
        list.forEach((item, index) => {
          nameList.push(item.linkName)
          let obj = {}
          obj.value = item.brandSL
          obj.name = item.linkName
          obj.linkID = item.linkID
          dataList.push(obj)
        })

        let option = {
          color: ["#598AF1", "#C4D4F5", "#58CFA2", "#C4E9DD", "#5A6D8F", "#C5CCD7", "#ECB619", "#F1E2B4", "#DE6152",
            "#EDC8C5", "#6AC0E5", "#CAE4F1"
          ],
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          legend: {
            type: "scroll",
            left: 'center',
            bottom: 'bottom',
            data: nameList,
            textStyle: {
              color: "#fff",
            },
            pageTextStyle: {
              color: "#fff"
            },
            pageIconColor: "#fff",
            z: 99999
          },
          label: {
            formatter: "{d}%",
            color: "#fff",
          },
          hoverOffset: 4,
          series: [{
            name: '合作品牌',
            type: 'pie',
            radius: [30, 110],
            center: ['65%', '50%'],
            roseType: 'area',
            width: "80%",
            height: "80%",
            animation: false,
            label: {
              show: true
            },
            labelLine: {
              show: true,
              length: 7,
              length2: 7,
              lineStyle: {
                color: "transparent"
              }
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data: dataList
          }]
        };

        myChart.dispatchAction({ type: '' })
        myChart.setOption(option);
        window.addEventListener('resize', function() {
          myChart.resize()
        })
        let _this = this
        myChart.on('legendselectchanged', function(param) {
            _this.param = 1
        })
        myChart.on('legendscroll', function(param) {
            _this.param = 1
        })
        myChart.on('click', function(param) {
          _this.param = 1
          if( _this.showPage == 1 && _this.linkID == param.data.linkID ){
            return
          }else{
            _this.showPage = -1
            setTimeout( () => {
              _this.linkID = param.data.linkID
              if (_this.showPage == 1) {
                _this.showPage = -1
                setTimeout(() => {
                  _this.showPage = 1
                })
              } else {
                _this.showPage = 1
              }
            } )
          }
        });
      },
      brandtemp() {
        let _this = this
        if( _this.showPage == 1 && _this.linkID === '' ){
          return
        }else{
          setTimeout(() => {
            if( _this.param != -1 ){
              _this.param = -1
              return
            }else{
              _this.linkID = ""
              _this.showPage = -1
              setTimeout(() => {
                _this.showPage = 1
              })
            }
          },10)
        }
      },
      // 品牌产品
      productPage(data) {
        this.brandID = data.brandID
        this.brandName = data.brandName
        this.showPage = 3
      },
      productDetailPage(data) {
        this.productID = data.productID
        this.productName = data.productName
        this.showPage = 4
      },
      backProductPage() {
        this.showPage = 3
      },

      // 合作业务员
      salesmanData(list) {
        let _this = this
        let canvas = document.getElementById('pietable2')
        var myChart = echarts.init(canvas);

        let nameList = []
        let dataList = []
        list.forEach((item, index) => {
          let obj = {}
          obj.value = item.brandSL
          if (item.regionName == "测试") {
            item.regionName = "杭州市"
          } else if (item.regionName == "测试_徐州") {
            item.regionName = "徐州市"
          }
          obj.name = item.regionName
          obj.regionInfoID = item.regionInfoID
          dataList.push(obj)
          nameList.push(item.regionName)
        })
        this.serverscityList = list
        let option = {
          color: ['#052994', '#0E69E6', '#33C0F6', '#24D554', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074',
            '#546570', '#c4ccd3'
          ],
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)',
            position: ['20%', '90%']
          },
          label: {
            formatter: "{d}%",
            color: "#fff"
          },
          legend: {
            type: "scroll",
            left: 'center',
            bottom: 'bottom',
            textStyle: {
              color: "#fff",
            },
            pageTextStyle: {
              color: "#fff"
            },
             pageIconColor: "#fff",
            data: nameList,
          },
          series: [{
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            animation: false,
            labelLine: {
              show: true,
              length: 1,
              length2: 1,
              lineStyle: {
                color: "transparent"
              }
            },
            data: dataList,
            emphasis: {
              itemStyle: {
                shadowBlur: 0,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        };
        myChart.setOption(option);
        window.addEventListener('resize', function() {
          myChart.resize()
        });

        myChart.on('legendselectchanged', function(param) {
            _this.param = 1
        })
        myChart.on('legendscroll', function(param) {
            _this.param = 1
        })
        myChart.on('click', function(param) {
          _this.param = 1
          if( _this.showPage == 8 && _this.serversregionInfoID == param.data.regionInfoID ){
            return
          }else{
            _this.serversregionInfoID = param.data.regionInfoID
            if (_this.showPage == 8) {
              _this.showPage = -1
              setTimeout(() => {
                _this.showPage = 8
              })
            } else {
              _this.showPage = 8
            }
          }
        });
      },
      theServerstemplate() {
        let _this = this
        if( _this.showPage == 8 && _this.serversregionInfoID == -1 ){
          return
        }else{
          setTimeout(() => {
            if( _this.param != -1 ){
              _this.param = -1
              return
            }else{
              this.serversregionInfoID = -1
              if (_this.showPage == 8) {
                _this.showPage = -1
                setTimeout(() => {
                  _this.showPage = 8
                })
              } else {
                _this.showPage = 8
              }
            }
          },10)
        }
      },
      // 业务员整装订单
      serversDetailPage(data, serversCity, id) {
        this.serversmemberGUID = data.memberGUID
        this.serversName = data.memberName
        this.serversCity = serversCity
        this.serversregionInfoID = id
        this.showPage = 9
      },
      backtheServerstemplate() {
        this.showPage = 8
      },
      // 合作服务商
      providerData(list) {
        let canvas = document.getElementById('pietable3')
        var myChart = echarts.init(canvas);

        let dataList = []
        let nameList = []
        list.forEach((item, index) => {
          let obj = {}
          obj.value = item.providerSL
          if (item.regionName == "测试") {
            item.regionName = "杭州市"
          } else if (item.regionName == "测试_徐州") {
            item.regionName = "徐州市"
          }
          obj.name = item.regionName
          obj.regionInfoID = item.regionInfoID
          obj.provinceName = item.provinceName
          obj.provinceID = item.provinceID
          dataList.push(obj)
          nameList.push(item.regionName)
        })

        let option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)',
            position: ['20%', '90%']
          },
          label: {
            formatter: "{d}%",
            color: "#fff",
          },
          legend: {
            type: "scroll",
            left: 'center',
            bottom: 'bottom',
            textStyle: {
              color: "#fff",
            },
            pageTextStyle: {
              color: "#fff"
            },
             pageIconColor: "#fff",
            data: nameList
          },
          series: [{
            type: 'pie',
            radius: ['30%', '50%'],
            avoidLabelOverlap: false,
            animation: false,
            labelLine: {
              show: true,
              length: 1,
              length2: 1,
              lineStyle: {
                color: "transparent"
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '14',
              }
            },
            data: dataList
          }]
        };
        myChart.setOption(option);
        window.addEventListener('resize', function() {
          myChart.resize()
        })
        let _this = this
        myChart.on('legendselectchanged', function(param) {
            _this.param = 1
        })
        myChart.on('legendscroll', function(param) {
            _this.param = 1
        })
        myChart.on('click', function(param) {
          console.log(1,param)
          _this.showPage = -1
          setTimeout(()=>{
            _this.param = 1
            let regionInfoID = param.data.regionInfoID
            if (regionInfoID == -1) {
              _this.alertTip("暂未开放");
              return
            };
            _this.provinceName =  _this.pinyin.getFullChars(param.data.provinceName).toLowerCase()
            _this.provinceNameH = param.data.provinceName
            _this.provinceID = param.data.provinceID
            let serveregionInfoName = param.name
            _this.changeregionInfoID(regionInfoID, serveregionInfoName)
          })
        });
      },

      showThisPage: function(num) {
        let _this = this
        setTimeout(() => {
          if (_this.param != -1) {
            _this.param = -1
            return
          } else {
            _this.showPage = num
          }
        }, 50)
      },

      // 服务楼盘
      houseData(list) {

        let canvas = document.getElementById('pietable4')
        var myChart = echarts.init(canvas);

        let nameList = []
        let dataList = []
        list.forEach((item, index) => {
          let obj = {}
          obj.value = item.houseSL
          if (item.regionName == "测试") {
            item.regionName = "杭州市"
          } else if (item.regionName == "测试_徐州") {
            item.regionName = "徐州市"
          }
          obj.name = item.regionName
          obj.regionInfoID = item.regionInfoID
          obj.provinceName = item.provinceName
          obj.provinceID = item.provinceID
          nameList.push(item.regionName)
          dataList.push(obj)
        })

        let option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          legend: {
            type: "scroll",
            left: 'center',
            bottom: 25,
            textStyle: {
              color: "#fff",
              fontSize: 10,
            },
            pageTextStyle: {
              color: "#fff"
            },
             pageIconColor: "#fff",
            itemWidth: 10,
            itemHeight: 10,
            data: nameList
          },
          label: {
            formatter: "{d}%",
            color: "#fff"
          },
          series: [{
            type: 'pie',
            radius: ['40%', '60%'],
            avoidLabelOverlap: false,
            hoverOffset: 5,
            animation: false,
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bolder',
                formatter: "{d}%"
              }
            },
            label: {
              formatter: "{d}%"
            },
            labelLine: {
              show: true,
              length: 8,
              length2: 8,
              lineStyle: {
                color: "transparent"
              }
            },
            data: dataList
          }]
        };
        myChart.setOption(option);
        window.addEventListener('resize', function() {
          myChart.resize()
        })
        let _this = this
        myChart.on('legendselectchanged', function(param) {
            _this.param = 1
        })
        myChart.on('legendscroll', function(param) {
            _this.param = 1
        })
        myChart.on('click', function(param) {
          // 获取城市的 ID
          _this.showPage = -1
          setTimeout(()=>{
            _this.param = 1
            let regionInfoID = param.data.regionInfoID
            let houseregionInfoIDName = param.name
            _this.provinceHouseNameH = param.data.provinceName
            _this.provinceHouseName =  _this.pinyin.getFullChars(param.data.provinceName).toLowerCase()
            _this.provinceHouseID = param.data.provinceID
            if (regionInfoID == -1) {
              _this.alertTip("暂未开放");
              return
            };
            _this.changeregionHouseInfoID(regionInfoID, houseregionInfoIDName)
          })
        });
      },

      // 样板房
      modelHouseData(list) {
        let _this = this
        let canvas = document.getElementById('bartable1')
        var myChart = echarts.init(canvas);

        let colorArr = ["#25D555", "#0F69E7", "#33C1F6"]
        let nameList = []
        let dataList = []
        list.forEach((item, index) => {
          if (item.regionName == "测试") {
            item.regionName = "杭州市"
          } else if (item.regionName == "测试_徐州") {
            item.regionName = "徐州市"
          }
          nameList.push(item.regionName)
          let obj = {}
          obj.value = item.brandSL
          obj.name = item.regionName
          obj.regionInfoID = item.regionInfoID
          let colorIndex = index % 3
          obj.itemStyle = {}
          obj.itemStyle.color = colorArr[colorIndex]
          dataList.push(obj)
        })

        _this.housecityList = list

        let option = {
          xAxis: {
            type: 'category',
            data: nameList,
            axisLine: {
              show: false,
              lineStyle: {
                color: "#fff"
              }
            },
            axisTick: {
              show: false,
            }
          },
          yAxis: {
            type: 'value',
            show: false,
          },
          series: [{
            type: 'bar',
            animation: false,
            label: {
              show: true,
              position: 'top',
              color: "#fff"
            },
            barWidth: 18,
            data: dataList
          }]
        };
        myChart.setOption(option);
        window.addEventListener('resize', function() {
          myChart.resize()
        })
        myChart.on('click', function(param) {
          _this.param = 1
          if( _this.showPage == 2 && _this.houseregionInfoID == param.data.regionInfoID ){
            return
          }else{
            _this.houseregionInfoID = param.data.regionInfoID
            if (_this.showPage == 2) {
              _this.showPage = -1
              setTimeout(() => {
                _this.showPage = 2
              })
            } else {
              _this.showPage = 2
            }
          }
        });
      },
      theHousetemplate() {
        let _this = this
        if( _this.showPage == 2 && _this.houseregionInfoID == -1 ){
          return
        }else{
          setTimeout(() => {
            if( _this.param != -1 ){
              _this.param = -1
              return
            }else{
              // 清除样板房城市 ＩＤ
              _this.houseregionInfoID = -1
              if (_this.showPage == 2) {
                _this.showPage = -1
                setTimeout(() => {
                  _this.showPage = 2
                })
              } else {
                _this.showPage = 2
              }
            }
          },10)
        }
      },

      // 收益
      earningsData(list) {
        let canvas = document.getElementById('bartable2')
        var myChart = echarts.init(canvas);

        let nameList = []
        let dataList = []
        list.forEach((item, index) => {
          let obj = {}
          obj.value = item.earnings
          if (item.regionName == "测试") {
            item.regionName = "杭州市"
          } else if (item.regionName == "测试_徐州") {
            item.regionName = "徐州市"
          }
          nameList.push(item.regionName)
          obj.name = item.regionName
          obj.regionInfoID = item.regionInfoID
          obj.provinceName = item.provinceName
          obj.provinceID = item.provinceID
          dataList.push(obj)
        })

        let option = {
          animation: false,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          xAxis: [{
            type: 'category',
            data: nameList,
            axisPointer: {
              type: 'shadow'
            },
            axisLine: {
              lineStyle: {
                color: "rgba(191, 195, 223, 1)"
              }
            },
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "rgba(191, 195, 223, 1)"
              }
            },
            axisTick: {
              show: false
            }
          }],
          series: [{
            type: 'bar',
            itemStyle: {
              color: "#DCEEBD"
            },
            data: dataList,
            barWidth: 9,
          }]
        };
        myChart.setOption(option);
        window.addEventListener('resize', function() {
          myChart.resize()
        })
        let _this = this
        myChart.on('click', function(param) {
          console.log(param)
          _this.showPage = -1
          setTimeout(()=>{
            _this.param = 1
            let regionInfoID = param.data.regionInfoID
            if (regionInfoID == -1) {
              _this.alertTip("暂未开放");
              return
            };
            let erregionInfoName = param.name
            _this.provinceearningsNameH  = param.data.provinceName
            _this.provinceearningsName =  _this.pinyin.getFullChars(param.data.provinceName).toLowerCase()
            _this.provinceearningsID  = param.data.provinceID
            _this.changeregionearningsInfoID(regionInfoID, erregionInfoName)
          })
        });
      },

      // 点击服务商全国地图
      changeProvinceID(data) {
        this.provinceID = data.provinceID
        this.provinceName = data.provinceName
        this.provinceNameH = data.provinceNameH
        this.showPage = 5
      },
      // 返回服务商全国地图
      backserversMap() {
        this.showPage = 7
      },
      backserversCityMap() {
        this.showPage = 5
      },
      // 点击省份地图到 城市 地图
      changeregionInfoID(regionInfoID, serveregionInfoName) {
        this.regionInfoID = regionInfoID
        this.serveregionInfoName = serveregionInfoName
        this.showPage = 6
      },
      // 点击楼盘全国地图
      changeProvinceHouseID(data) {
        this.provinceHouseID = data.provinceID
        this.provinceHouseName = data.provinceName
        this.provinceHouseNameH = data.provinceNameH
        this.showPage = 11
      },
      // 返回楼盘全国地图
      backHouseMap() {
        this.showPage = 10
      },
      backHouseCityMap() {
        this.showPage = 11
      },
      // 点击楼盘地图到 城市 地图
      changeregionHouseInfoID(regionInfoID, houseregionInfoIDName) {
        this.regionHouseInfoID = regionInfoID
        this.houseregionInfoIDName = houseregionInfoIDName
        this.showPage = 12
      },
      // 点击收益全国地图
      changeProvinceearningsID(data) {
        this.provinceearningsID = data.provinceID
        this.provinceearningsName = data.provinceName
        this.provinceearningsNameH = data.provinceNameH
        this.showPage = 14
      },
      backerMap() {
        this.showPage = 13
      },
      backerCityMap() {
        this.showPage = 14
      },
      // 点击收益地图到 城市 地图
      changeregionearningsInfoID(regionInfoID, erregionInfoName) {
        this.regionearningsInfoID = regionInfoID
        this.erregionInfoName = erregionInfoName
        this.showPage = 15
      }
    },
  }
</script>
