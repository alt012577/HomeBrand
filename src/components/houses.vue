<template>
	<div>
		<div class="templatename">
			<!-- <span>首页</span>
			<span class="arrow">&gt;</span> -->
			<span>样板房</span>
			<span class="arrow">&gt;</span>
			<div>
				<ul>
					<li :class="choosedCityIndex==index?'choosedCityItem':''" v-for="(item,index) in houseCitylist" @click="choosedCityIndexEV(item,index)">{{item.regionName}}</li>
				</ul>
			</div>
		</div>
		<div id="houses">
			<ul>
				<li v-for="(item,index) in housesList">
					<div class="bgimgcover" :style='"background-image: url("+item.modelHousePic+")"' @click="showCodeImg(item,index)">
						<div class="user">
							<img :src="item.designerPhoto" alt="">
							<span class="name">{{item.designerName}}</span>
							<!-- <span class="lebal">设计师</span> -->
						</div>
					</div>
					<p>{{item.modelHouseName}}</p>
					<div class="address"  @click="operationList=JSON.parse(item.WDOperationCenterData);otherTipEL3=true">{{JSON.parse(item.WDOperationCenterData)[0].WDorganizationName}}<img src="../assets/icon_more@2x.png"
						 alt=""></div>
					<div class="houseprice"><span><span>￥</span>{{item.salesPrice}}</span><span>￥{{item.retailPrice}}</span></div>
				</li>
			</ul>
			<div class="datanothing" v-if="nodata"></div>
			<footer v-if="loadingComplete"></footer>
			<div class="otherTipEL" v-show="otherTipEL">
				<div class="bg" @click="otherTipEL=false"></div>
				<div class="pic">
					<img :src="QRCodeUrl" alt="">
					<p>用微信扫一扫~ </p>
					<p>进入好监理小程序，<span>查看样板房详情</span></p>
				</div>
				<img @click.stop="otherTipEL=false" src="../assets/icon_close@2x.png" alt="">
			</div>
      <div class="otherTipEL otherTipEL3"  v-show="otherTipEL3">
        <div  class="bg" @click="otherTipEL3=false"></div>
        <ul class="pic">
          <li v-for="(item,index) in operationList">{{item.WDorganizationName}}</li>
        </ul>
        <img @click.stop="otherTipEL3=false" src="../assets/icon_close@2x.png" alt="">
      </div>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery'
	export default {
		props: ["houseregionInfoID", "housecityList"],
		data() {
			return {
				housesList: [],
				QRCodeUrl: "",
				otherTipEL: false,
				nodata: false,
				loadingComplete: false,
				houseCitylist: [],
				houseregionInfoIDH: -1,
				choosedCityIndex: 0,
				requesting: true,
        operationList: [],
        otherTipEL3: false
			}
		},
		mounted() {
			this.inithousePage()
		},
		methods: {

			choosedCityIndexEV(item,index) {
				if( !this.requesting ){
					this.choosedCityIndex = index
					this.houseregionInfoIDH = item.regionInfoID
					this.nodata = false
					this.loadingComplete = false
					this.initHouses()
				}
			},
			inithousePage() {
				let _this = this
				let obj = {
					regionInfoID: -1,
					regionName: "全部城市"
				}
				let list = []
				list = list.concat(obj)
				list = list.concat(this.housecityList)
				this.houseCitylist = list
				this.houseregionInfoIDH = this.houseregionInfoID
				this.initHouses()
				this.houseCitylist.forEach((item,index) => {
					if( this.houseregionInfoIDH == item.regionInfoID ){
						_this.choosedCityIndex = index
					}
				})
			},
			initHouses() {
				this.requesting = true
				let _this = this
				_this.nodata = false
				$.ajax({
					url: baseURL + "WholeDecoration/GetModelHouseList_WDBoss",
					data: {
						WholeDecorationID: _this.WholeDecorationID,
						memberGUID: _this.memberGUID,
						regionInfoID: _this.houseregionInfoIDH,
					},
					success: res => {
						this.requesting = false
						if (res.code == 1) {
							if( res.data == null ){
								res.data = []
							}
							_this.housesList = res.data
							if (_this.housesList.length == 0) {
								_this.nodata = true
								_this.loadingComplete = false
							} else {
								_this.loadingComplete = true
							}
						} else {
							_this.alertTip(res.errmsg)
						}
					},
					err: err => {
						this.requesting = false
						let msg = JSON.stringify(err)
						_this.alertTip(res.msg)
					}
				})
			},
			showCodeImg(item, index) {
				this.QRCodeUrl = item.QRCodeUrl
				this.otherTipEL = true
			},
		}
	}
</script>
<style scoped="scoped">
	#houses {
		padding: 0 0.75rem;
		height: 96%;
		position: relative;
		overflow: scroll;
	}

	#houses::-webkit-scrollbar {
		display: none;
	}

	#houses ul {
		display: flex;
		flex-wrap: wrap;
		padding-bottom: 2rem;
	}

	#houses ul li {
		width: 10.9375rem;
		border-radius: 0.625rem;
		margin-left: 0.625rem;
		margin-top: 0.625rem;
		overflow: hidden;
		background-color: #fff;
		background-color: #212647;
	}

	#houses .bgimgcover {
		width: 100%;
		height: 10.9375rem;
		position: relative;
	}

	#houses li p {
		font-size: 0.9375rem;
		font-weight: bolder;
		color: #fff;
		margin: 0.5rem;
	}

	.houseprice {
		color: #FFB62A;
		font-size: 1rem;
		margin: 0.625rem;
		display: flex;
		flex-wrap: wrap
	}

	.houseprice span:nth-of-type(1) {
		margin-right: 0.5rem;
	}

	.houseprice span:nth-of-type(1) span {
		font-size: 0.75rem
	}

	.houseprice span:nth-of-type(2) {
		text-decoration: line-through;
		color: #A4A6BA;
		font-size: 0.75rem;
	}

	#houses .address {
		margin: 0 0.5rem;
		font-size: 0.625rem;
		color: #87B5F5;
	}

	#houses .address img {
		height: 1rem;
		width: 1rem;
		transform: translateY(0.18rem);
		margin-left: 0.25rem;
	}

	#houses .user {
		position: absolute;
		right: 0.625rem;
		bottom: 0.625rem;
		height: 1.625rem;
		border-radius: 0.8125rem;
		background-color: rgba(68, 75, 105, 0.5);
		display: flex;
		align-items: center;
		padding: 0 0.125rem;
		padding-right: 0.5rem;
	}

	#houses .user img {
		height: 0.875rem;
		width: 0.875rem;
		border: 0.125rem solid #fff;
		border-radius: 50%;
		margin-left: 0.25rem;
	}

	#houses .user .name {
		font-weight: bolder;
		color: #fff;
		font-size: 0.75rem;
		margin-left: 0.5rem;
	}

	#houses .user .lebal {
		font-size: 0.5rem;
		padding: 0.18rem 0.35rem;
		background-color: rgba(226, 238, 255, 1);
		border-radius: 0.1875rem;
		font-weight: bolder;
		transform: scale(0.7);
	}

	#houses .otherTipEL {
		position: absolute;
		height: 100%;
		width: 100%;
		background-color: rgba(28, 34, 66, 0.8);
		top: 0;
		left: 0;
	}

	#houses .otherTipEL .bg {
		position: absolute;
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
	}

	#houses .otherTipEL .pic {
		position: absolute;
		height: 23.75rem;
		width: 35rem;
		border-radius: 0.625rem;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
	}
  #houses .otherTipEL .pic {
    height: auto;
    display: block;
    width: auto;
    padding-bottom: 0.9375rem;
  }
  #houses .otherTipEL .pic li{
    background-color: #fff;
  }

	#houses .otherTipEL>img {
		position: absolute;
		height: 1.875rem;
		width: 1.875rem;
		left: 50%;
		top: 50%;
		transform: translate(-50%, 13rem);
	}

	#houses .otherTipEL .pic img {
		height: 11.25rem;
		width: 11.25rem;
		display: block;
		margin: 3.125rem auto 1.5rem;
	}

	#houses .otherTipEL .pic p {
		font-size: 1.125rem;
		color: rgba(42, 49, 90, 1);
		text-align: center;
	}

	#houses .otherTipEL .pic p span {
		color: rgba(52, 191, 130, 1);
	}
</style>
