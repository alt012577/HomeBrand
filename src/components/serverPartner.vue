<template>
	<div>
		<div id="barnds" style="height: 98%;">
			<div class="templatename">
				<!-- <span>首页</span>
				<span class="arrow">&gt;</span> -->
				<span @click="backserversMap">全国服务商</span>
				<span class="arrow">&gt;</span>
				<span>{{cityname}}</span>
			</div>
			<div id="specialMap" style="height: 60%;"></div>
			<div id="specialserverbar" style="height: 40%;width: 55%;margin: 0 auto;"></div>
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

	export default {
		props: ["provinceID", "provinceName", "provinceNameH"],
		data() {
			return {
				cityname: ""
			}
		},
		mounted() {
			this.initProvinceSercers(),
			this.cityname = this.provinceNameH
		},
		methods: {
			backserversMap() {
				this.$emit("backserversMap")
			},
			initProvinceSercers() {
				let _this = this
				$.ajax({
					url: baseURL + "WholeDecoration/GetProvinceSPList_WDBoss",
					data: {
						WholeDecorationID: _this.WholeDecorationID,
						memberGUID: _this.memberGUID,
						provinceID: _this.provinceID
					},
					success: res => {
						if (res.code == 1) {
							if (res.data == null) {
								res.data = []
							}
							_this.servermap(res.data)
						} else {
							_this.alertTip(res.errmsg)
						}
					},
					err: err => {
						let msg = JSON.stringify(err)
						_this.alertTip(res.msg)
					}
				})
			},
			servermapbar(list) {
				let canvas = document.getElementById('specialserverbar')
				var myChart = echarts.init(canvas);

				let servermapbardata = function(list) {
					let obj = {
						datax: [],
						data1: [],
						data2: []
					}
					function initdata(list) {
						list.forEach((item, index) => {
							obj.datax.push(item.name)
							let obj1  = {
								value: item.value1,
								regionInfoID: item.regionInfoID
							}
							obj.data1.push(obj1)
							let obj2  = {
								value: item.value2,
								regionInfoID: item.regionInfoID
							}
							obj.data2.push(obj2)
						})
						return obj
					}
					return initdata(list)
				}
				let servermapbardatas = servermapbardata(list)

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
					legend: {
						data: ['服务商数量', '下单数量'],
						textStyle: {
							color: "#fff",
							fontSize: "12",
							fontWeight: "bolder"
						},
					},
					xAxis: [{
						type: 'category',
						data: servermapbardatas.datax,
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
							name: '服务商数量',
							interval: 10,
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
						{
							type: 'value',
							name: '下单数量',
							interval: 10,
							axisLabel: {
								formatter: '{value}'
							},
							axisLine: {
								show: false,
								lineStyle: {
									color: "rgba(191, 195, 223, 1)"
								}
							}
						}
					],
					series: [{
							name: '服务商数量',
							type: 'bar',
							itemStyle: {
								color: "rgba(89, 138, 241, 1)"
							},
							data: servermapbardatas.data1
						},
						{
							name: '下单数量',
							type: 'bar',
							itemStyle: {
								color: "rgba(205, 82, 182, 1)"
							},
							data: servermapbardatas.data2
						},
					]
				};
				myChart.setOption(option);
				window.addEventListener('resize', function() {
					myChart.resize()
				})
				let _this = this
				myChart.on('click', function(param) {
					console.log(param)
					let regionInfoID = param.data.regionInfoID
					if (regionInfoID == -1) {
						_this.alertTip("暂未开放");
						return
					};
					let serveregionInfoName = param.name
					_this.$emit("changeregionInfoID", regionInfoID,serveregionInfoName);
				});
			},
			servermap(list) {
				let _this = this
				let canvas = document.getElementById('specialMap')
				var myChart = echarts.init(canvas);

				// 根据省份 英文名 加载对应的地图
				var uploadedDataURL = "./static/json/" + this.provinceName + ".json";
				$.getJSON(uploadedDataURL, function(geoJson) {
					echarts.registerMap(_this.provinceName, geoJson);
					let geoCoordMap = {}
					geoJson.features.forEach((item, index) => {
						geoCoordMap[item.properties.name] = item.properties.cp
					})
					var data = []
					for (let i in geoCoordMap) {
						let obj = {}
						obj.name = i
						obj.value1 = 0
						obj.value2 = 0
						obj.regionInfoID = -1
						data.push(obj)
					}
					data.forEach((itemx, index) => {
						list.forEach((item, index) => {
							if (item.regionName == "测试") {
								item.regionName = "杭州市"
							} else if (item.regionName == "测试_徐州") {
								item.regionName = "徐州市"
							}
							if (itemx.name == item.regionName) {
								itemx.value1 = item.providerSL
								itemx.value2 = item.orderSL
								itemx.regionInfoID = item.regionInfoID
							}
						})
					})
					_this.servermapbar(data)

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
                  regionInfoID: data[i].regionInfoID
								});
							}
						}
						return res;
					};


					var option = {
						title: {
							text: _this.provinceNameH,
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
									return params.name + " 服务商数量：" + params.data.value1 + " 下单数量：" + params.data.value2;
								} else {
									return params.name + ' : ' + params.value[2];
								}
							}
						},
						legend: {
							orient: 'vertical',
							y: 'bottom',
							x: 'right',
							selectedMode: "single",
							data: ['服务商数量', '下单数量'],
							textStyle: {
								color: '#fff'
							}
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
								color: ['#0083c5', '#008dd3', '#00aaff'] // 黑紫黑
							}
						},
						geo: {
							show: true,
							map: _this.provinceName,
							label: {
								normal: {
									show: false
								},
								emphasis: {
									show: false,
								}
							},
							roam: true,
							itemStyle: {
								normal: {
									areaColor: '#00a1f1',
									borderColor: '#3B5077',
								},
								emphasis: {
									areaColor: '#2B91B7',
								}
							}
						},
						series: [{
								name: 'credit_pm2.5',
								type: 'scatter',
								coordinateSystem: 'geo',
								data: convertData(data),
								symbolSize: function(val) {
									return val[2] / 10;
								},
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
										color: '#05C3F9'
									}
								}
							},
							{
								type: 'map',
								map: _this.provinceName,
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
										areaColor: '#141132',
										borderColor: '#3B5077',
									},
									emphasis: {
										areaColor: '#2B91B7'
									}
								},
								animation: false,
								data: data
							},
							{
								name: '服务商数量',
								type: 'scatter',
								coordinateSystem: 'geo',
								symbol: 'pin',
								symbolSize: function(val) {
									var a = (maxSize4Pin - minSize4Pin) / (max - min);
									var b = minSize4Pin - a * min;
									b = maxSize4Pin - a * max;
									return a * val[2] + b + 5;
								},
								label: {
									normal: {
										show: true,
										textStyle: {
											color: '#fff',
											fontSize: 9,
										},
										formatter: '{@[2]}'
									}
								},
								itemStyle: {
									normal: {
										color: '#D8BC37', //标志颜色
									}
								},
								zlevel: 6,
								data: convertData(data),
							},
							{
								name: '下单数量',
								type: 'scatter',
								coordinateSystem: 'geo',
								symbol: 'pin',
								symbolSize: function(val) {
									var a = (maxSize4Pin - minSize4Pin) / (max - min);
									var b = minSize4Pin - a * min;
									b = maxSize4Pin - a * max;
									return a * val[3] + b + 5;
								},
								label: {
									normal: {
										show: true,
										textStyle: {
											color: '#fff',
											fontSize: 9,
										},
										formatter(value) {
											return value.data.value[3]
										}
									},
								},
								itemStyle: {
									normal: {
										color: '#D83737', //标志颜色
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
							{
								name: 'Top 100',
								type: 'effectScatter',
								coordinateSystem: 'geo',
								data: convertData(data.sort(function(a, b) {
									return b.value - a.value;
								}).slice(0, 100)),
								symbolSize: function(val) {
									return val[2] / 10;
								},
								showEffectOn: 'render',
								rippleEffect: {
									brushType: 'stroke'
								},
								hoverAnimation: true,
								label: {
									normal: {
										formatter: '{b}',
										position: 'right',
										show: true
									}
								},
								itemStyle: {
									normal: {
										color: '#05C3F9',
										shadowBlur: 10,
										shadowColor: '#05C3F9'
									}
								},
								zlevel: 1
							},

						]
					};
					// console.log(option)
					myChart.setOption(option);
					myChart.on('click', function(param) {
						// 获取城市的 ID
						console.log(param)
						let regionInfoID = param.data.regionInfoID
						if (regionInfoID == -1) {
							_this.alertTip("暂未开放");
							return
						};
						let serveregionInfoName = param.name
						_this.$emit("changeregionInfoID", regionInfoID,serveregionInfoName);
					});
				});
			},
		}
	}
</script>
