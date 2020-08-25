<template>
	<div>
		<div id="er" style="height: 98%;">
			<div class="templatename">
				<!-- <span>首页</span>
				<span class="arrow">&gt;</span> -->
				<span @click="backerMap" v-if="cityname!=''">全国收益</span>
				<span class="arrow" v-if="cityname!=''">&gt;</span>
				<span @click="backerCityMap" v-if="cityname!=''">{{cityname}}</span>
        <span @click="backerMap" v-if="cityname==''">全国收益</span>
        <span class="arrow">&gt;</span>
				<span>{{areaname}}</span>
			</div>
			<div id="map" style="height: 96%;width: 94%;margin: auto;border-radius: 0.5rem;overflow: hidden;">
				<div class="lineinner" v-show="otherTipEL">
					<div class="bg" @click.stop="otherTipEL=false"></div>
					<div class="pic">
						<p class="wdtitle" v-text="wdtitle"></p>
						<div id="line"></div>
					</div>
					<img @click.stop="otherTipEL=false" src="../assets/icon_close@2x.png" alt="">
				</div>
			</div>
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
		props: ["regionearningsInfoID", "erregionInfoName", "provinceearningsNameH"],
		data() {
			return {
				marker: [],
				map: null,
				cityname: "",
				areaname: "",
				otherTipEL: false,
				wdtitle: ""
			}
		},
		mounted() {
			this.cityname = this.provinceearningsNameH
			this.areaname = this.erregionInfoName
			this.initEarningsCityMap()
		},
		methods: {
			backerMap() {
				this.$emit("backerMap")
			},
			backerCityMap() {
				this.$emit("backerCityMap")
			},
			initEarningsCityMap() {
				let _this = this
				$.ajax({
					url: baseURL + "WholeDecoration/GetEarningsPageList_WDBoss",
					data: {
						WholeDecorationID: _this.WholeDecorationID,
						memberGUID: _this.memberGUID,
						regionInfoID: _this.regionearningsInfoID
					},
					success: res => {
						if (res.code == 1) {
							if (res.data == null) {
								res.data = []
							}
							_this.areaEarningsMap(res.data)
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
			areaEarningsMap(list) {
				var _this = this;
				if (_this.map == null) {
					let point = []
					if (list.length == 0) {
						list[0] = {}
						list[0].longitude = ''
						list[0].earnings = -1
					}
					if (list[0].longitude != '') {
						point = [Number(list[0].longitude), Number(list[0].latitude)]
					} else {
						point = [120.200268, 30.24298]
					}
					_this.map = new AMap.Map('map', {
						resizeEnable: true,
						center: point,
						zoom: 14,
					});
				}
				if (_this.marker != null && _this.marker.length > 0) {
					_this.map.remove(_this.marker);
				}
				list.forEach(function(item, index) {
					if (item.longitude == '') {
						item.longitude = 120.200268 + index / 100
						item.latitude = 30.24298 + index / 100
					}
					_this.marker[index] = new AMap.Marker({
						position: [Number(item.longitude), Number(item.latitude)],
					});
					_this.marker[index].setMap(_this.map);
					if (item.earnings >= 0) {
						_this.marker[index].setLabel({
							content: "<div data-id=" + item.WDOperationCenterID + " data-name="+item.organizationName+" class='uiou'><p>" + item.organizationName +
								"</p><div><span>收益</span><span>" + item.earnings +
								"</span></div></div>", //设置文本标注内容
							direction: 'bottom' //设置文本标注方位
						})
					}
				})
				setTimeout(() => {
					let els = Array.from(document.getElementsByClassName("uiou"))
					els.forEach((item, index) => {
						item.addEventListener("click", function() {
							_this.wdtitle = item.dataset.name
							$.ajax({
								url: baseURL + "WholeDecoration/GetWDOCEarningsList_WDBoss",
								data: {
									WholeDecorationID: _this.WholeDecorationID,
									memberGUID: _this.memberGUID,
									regionInfoID: _this.regionearningsInfoID,
									WDOperationCenterID: item.dataset.id,
									months: 7,
								},
								success: res => {
									if (res.code == 1) {
										if (res.data == null) {
											res.data = []
										}
										_this.otherTipEL = true
										setTimeout(()=>{
											_this.initline(res.data)
										},500)
									} else {
										_this.alertTip(res.errmsg)
									}
								},
								err: err => {
									let msg = JSON.stringify(err)
									_this.alertTip(res.msg)
								}
							})
						})
					})
				}, 1500)
			},
			initline(list) {
				let canvas = document.getElementById('line')
				var myChart = echarts.init(canvas);
				let data1 = []
				let data2 = []
				list.forEach((item,index) => {
					let x = item.remark
					let y = x[0]+x[1]+x[2]+x[3]+"."+x[5]
					if( x[6] != "月" ){
						y = y + x[6]
					}
					data1.unshift(y)
					data2.unshift(item.earnings)
				})
				let option = {
					xAxis: {
						type: 'category',
						data: data1
					},
					yAxis: {
						type: 'value'
					},
					lineStyle: {
						color: "#5B8FF9"
					},
					itemStyle: {
						color: "#5B8FF9"
					},
					emphasis: {
						lineStyle: {
							color: "#5B8FF9"
						},
						itemStyle: {
							color: "#5B8FF9"
						},
						label: {
							show: true,
							color: "#EA4A1F",
							fontSize: 16,
						},
					},
					label: {
						show: true,
						color: "#000",
						fontSize: 16,
						fontFamily: "price"
					},
					series: [{
						data: data2,
						type: 'line'
					}]
				};
				myChart.setOption(option);
				window.addEventListener('resize',function(){ myChart.resize() })
			}
		}
	}
</script>
<style>
	.amap-marker .amap-icon img {
		display: none;
	}

	.amap-marker-label {
		background-color: #FFFFFF;
		box-shadow: 0 0 0.625rem #efefef;
		border: none;
		border-radius: 0.625rem;
		padding: 0.35rem 0.5rem;
		line-height: 1.4rem;
		width: 12.5rem;
		word-wrap: normal;
		white-space: normal
	}

	.amap-marker-label p {
		color: #181B37;
		font-size: 1rem;
		width: 100%;
		word-break: break-all;
		word-wrap: normal;
	}

	.amap-marker-label>div>div {
		font-size: 0.75rem;
		color: rgba(144, 150, 156, 1);
	}

	.amap-marker-label div span:nth-of-type(2) {
		font-family: 'price';
		color: rgba(255, 102, 53, 1);
		font-size: 1rem;
		margin-left: 0.5rem;
	}

	/* 隐藏地图图标 */
	.amap-logo img {
		display: none;
	}

	.amap-copyright {
		display: none;
		opacity: 0;
	}

	#er .lineinner {
		position: absolute;
		height: 100%;
		width: 100%;
		background-color: rgba(28, 34, 66, 0.8);
		top: 0;
		left: 0;
		z-index: 8;
	}

	#er .lineinner .bg {
		position: absolute;
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
	}
	#map{
		position: relative
	}
	#er .lineinner .pic {
		position: absolute;
		height: 60%;
		width: 90%;
		border-radius: 0.625rem;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
	}
	#er .lineinner .pic div{
		height: 85%;
	}
	#er .lineinner>img {
		position: absolute;
		height: 1.875rem;
		width: 1.875rem;
		left: 50%;
		top: 60%;
		transform: translate(-50%, 13rem);
	}
	.wdtitle{
		height: 2rem;
		padding: 0 0.75rem;
		border-radius: 1rem;
		background-color: #34BF82;
		color: #FFFFFF;
		font-weight: bolder;
		margin: 2rem 0 1rem 50%;
		line-height: 2rem;
		display: inline-block;
		left: 50%;
		transform: translateX(-50%);
	}
</style>
