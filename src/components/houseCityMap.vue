<template>
	<div>
		<div id="barnds" style="height: 98%;">
			<div class="templatename">
				<!-- <span>首页</span>
				<span class="arrow">&gt;</span> -->
				<span @click="backHouseMap" v-if="cityname!=''">全国楼盘</span>
				<span class="arrow" v-if="cityname!=''">&gt;</span>
				<span @click="backHouseCityMap" v-if="cityname!=''">{{cityname}}</span>
        <span @click="backHouseMap" v-if="cityname==''">全国楼盘</span>
        <span class="arrow">&gt;</span>
				<span>{{areaname}}</span>
			</div>
			<div id="map" style="height: 96%;width: 94%;margin: auto;border-radius: 0.5rem;overflow: hidden;"></div>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery'

	export default {
		props: ["regionHouseInfoID", "houseregionInfoIDName", "provinceHouseNameH"],
		data() {
			return {
				marker: [],
				map: null,
				cityname: "",
				areaname: ""
			}
		},
		mounted() {
			this.areaname = this.houseregionInfoIDName
			this.cityname = this.provinceHouseNameH
			this.initCityMap()
		},
		methods: {
			backHouseMap() {
				this.$emit("backHouseMap")
			},
			backHouseCityMap() {
				this.$emit("backHouseCityMap")
			},
			initCityMap() {
				let _this = this
				$.ajax({
					url: baseURL + "WholeDecoration/GetHousePageList_WDBoss",
					data: {
						WholeDecorationID: _this.WholeDecorationID,
						memberGUID: _this.memberGUID,
						regionInfoID: _this.regionHouseInfoID
					},
					success: res => {
						if (res.code == 1) {
							if (res.data == null) {
								res.data = []
							}
							_this.areaHouseMap(res.data)
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
			areaHouseMap(list) {
				var _this = this;
				if (_this.map == null) {
					let point = []
					if (list.length == 0) {
						list[0] = {}
						list[0].longitude = ''
						list[0].orderSL = -1
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
					if (item.orderSL >= 0) {
						_this.marker[index].setLabel({
							content: "<div><p>" + item.houseName + "</p><div><span>下单数量</span><span>" + item.orderSL +
								"</span></div></div>", //设置文本标注内容
							direction: 'bottom' //设置文本标注方位
						})
					}
				})
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
</style>
