<template>
  <div>
    <div id="barnds" style="height: 98%;">
		<div class="templatename">
			<!-- <span>首页</span>
			<span class="arrow">&gt;</span> -->
			<span>全国收益</span>
		</div>
      <div id="specialMap" style="height: 56%;"></div>
      <div id="specialbar" style="height: 40%;width: 110%;margin: 4% auto 0;left: 50%;transform: translateX(-49%);"></div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/scatter')
  require('echarts/lib/chart/map')
  require('echarts/lib/chart/effectScatter')
  require('echarts/lib/component/geo')

  export default{
    data() {
      return{

      }
    },
    mounted() {
      this.initBrandList()
    },
    methods: {

      initBrandList() {
        let _this = this
        $.ajax({
          url: baseURL + "WholeDecoration/GetNationwideEarningsList_WDBoss",
          data: {
              WholeDecorationID: _this.WholeDecorationID,
              memberGUID: _this.memberGUID,
          },
          success: res => {
            if( res.code == 1 ){
              _this.map(res.data)
            }else{
              _this.alertTip(res.errmsg)
            }
          },
          err: err => {
            let msg = JSON.stringify(err)
            _this.alertTip(res.msg)
          }
        })
      },

      earningsAllMapbar(list) {
        let canvas = document.getElementById('specialbar')
        var myChart = echarts.init(canvas);

        let earningsAllMapbar = function(list) {
          let obj = {
            datax: [],
            data1: [],
            data2: []
          }
          function initdata(list) {
            list.forEach((item,index) => {
                obj.datax.push(item.name)
                let obj1 = {
                	value: item.value1,
                	provinceID: item.provinceID
                }
				obj.data1.push(obj1)
            })
            return obj
          }
          return initdata(list)
        }
        let earningsAllMapbars = earningsAllMapbar(list)

        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            xAxis: [
                {
                    type: 'category',
                    data: earningsAllMapbars.datax,
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
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '收益',
                    interval: 100,
                    axisLabel: {
                        formatter: '{value}'
                    },
                    axisLine: {
                      show: false,
                      lineStyle: {
                        color: "rgba(191, 195, 223, 1)"
                      }
                    }
                },
            ],
            series: [
                {
                    name: '收益',
                    type: 'bar',
                    itemStyle: {
                      color: "rgba(89, 138, 241, 1)"
                    },
                    data: earningsAllMapbars.data1
                }
            ]
        };
        myChart.setOption(option);
        window.addEventListener('resize',function(){ myChart.resize() })
		let _this = this
		myChart.on('click', function (param) {
		    // 获取省份的 ID
		    let provinceID = param.data.provinceID
		    // 获取省份的拼音
		    let provinceName =  _this.pinyin.getFullChars(param.name).toLowerCase()
		    let province = {}
		    province.provinceID = provinceID
		    province.provinceName = provinceName
		    province.provinceNameH = param.name
		    _this.$emit("changeProvinceearningsID",province);
		});
      },
      map(list) {
        let _this = this
        let canvas = document.getElementById('specialMap')
        var myChart = echarts.init(canvas);

        var uploadedDataURL = "./static/json/allProvinces.json";
        $.getJSON(uploadedDataURL, function(geoJson) {
            echarts.registerMap('china', geoJson);
            var geoCoordMap = {
                '台湾': [121.5135, 25.0308],
                '黑龙江': [127.9688, 45.368],
                '内蒙古': [110.3467, 41.4899],
                "吉林": [125.8154, 44.2584],
                '北京市': [116.4551, 40.2539],
                "辽宁": [123.1238, 42.1216],
                "河北": [114.4995, 38.1006],
                "天津": [117.4219, 39.4189],
                "山西": [112.3352, 37.9413],
                "陕西": [109.1162, 34.2004],
                "甘肃": [103.5901, 36.3043],
                "宁夏": [106.3586, 38.1775],
                "青海": [101.4038, 36.8207],
                "新疆": [87.9236, 43.5883],
                "西藏": [91.11, 29.97],
                "四川": [103.9526, 30.7617],
                "重庆": [108.384366, 30.439702],
                "山东": [117.1582, 36.8701],
                "河南": [113.4668, 34.6234],
                "江苏": [118.8062, 31.9208],
                "安徽": [117.29, 32.0581],
                "湖北": [114.3896, 30.6628],
                "浙江": [119.5313, 29.8773],
                "福建": [119.4543, 25.9222],
                "江西": [116.0046, 28.6633],
                "湖南": [113.0823, 28.2568],
                "贵州": [106.6992, 26.7682],
                "云南": [102.9199, 25.4663],
                "广东": [113.12244, 23.009505],
                "广西": [108.479, 23.1152],
                "海南": [110.3893, 19.8516],
                '上海': [121.4648, 31.2891],

            };
            let data = []
            list.forEach((item,index)=>{
              let obj = {}
              obj.name = item.provinceName
              obj.value1 = item.earnings
              obj.provinceID = item.provinceID
              data.push(obj)
            })

            _this.earningsAllMapbar(data)

            var max = 480,
                min = 9; // todo
            var maxSize4Pin = 100,
                minSize4Pin = 20;

            var convertData = function(data) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var geoCoord = geoCoordMap[data[i].name];
                    if (geoCoord) {
                        res.push({
                            name: data[i].name,
                            value: geoCoord.concat(data[i].value1).concat(data[i].value2),
                            provinceID: data[i].provinceID
                        });
                    }
                }
                return res;
            };



            let option = {
                backgroundColor: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 1,
                    colorStops: [{
                        offset: 0,
                        color: '#0f378f00' // 0% 处的颜色
                    }, {
                        offset: 1,
                        color: '#00091a00' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                },
                title: {
                    top: 20,
                    subtext: '',
                    x: 'center',
                    textStyle: {
                        color: '#ccc'
                    }
                },

                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        if (typeof(params.value)[2] == "undefined") {
                            return params.name + " 收益：" + params.data.value1
                            // return JSON.stringify(params)
                        } else {
                            // return params.name + ' : ' + params.value[2];
                            // return JSON.stringify(params)
                        }
                    },
                    // position: ['-50%',"90%"]
                },
                visualMap: {
                    show: false,
                    min: 0,
                    max: 500,
                    left: 'left',
                    top: 'bottom',
                    text: ['高', '低'], // 文本，默认为数值文本
                    calculable: true,
                    seriesIndex: [1],
                    inRange: {

                    }
                },
                geo: {
                    map: 'china',
                    show: true,
                    roam: true,
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false,
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: '#3a7fd5',
                            borderColor: '#0a53e9', //线
                            shadowColor: '#092f8f', //外发光
                            shadowBlur: 20
                        },
                        emphasis: {
                            areaColor: '#0a2dae', //悬浮区背景
                        }
                    }
                },
                series: [{

                        symbolSize: 5,
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: true
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#fff'
                            }
                        },
                        name: 'light',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        data: convertData(data),

                    },
                    {
                        type: 'map',
                        map: 'china',
                        geoIndex: 0,
                        aspectScale: 0.75, //长宽比
                        showLegendSymbol: false, // 存在legend时显示
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        },
                        roam: true,
                        itemStyle: {
                            normal: {
                                areaColor: '#031525',
                                borderColor: '#FFFFFF',
                            },
                            emphasis: {
                                areaColor: '#2B91B7'
                            }
                        },
                        animation: false,
                        data: data
                    },
                    {
                        name: '收益',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        symbol: 'pin',
                        symbolSize: [50, 50],
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 9,
                                },
                                formatter(value) {
                                    return value.data.value[2]
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#D8BC37', //标志颜色
                            }
                        },
                        data: convertData(data),
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true,
                        zlevel: 1
                    },
                ]
            };
            myChart.setOption(option);
            myChart.on('click', function (param) {
                // 获取省份的 ID
                let provinceID = param.data.provinceID
                // 获取省份的拼音
                let provinceName =  _this.pinyin.getFullChars(param.name).toLowerCase()
                let province = {}
                province.provinceID = provinceID
                province.provinceName = provinceName
                province.provinceNameH = param.name
                _this.$emit("changeProvinceearningsID",province);
            });
        });
      },

    }
  }
</script>
