<template>
	<div>
		<div class="templatename">
			<!-- <span>首页</span>
			<span class="arrow">&gt;</span> -->
			<span>{{brandName}}</span>
			<span class="arrow">&gt;</span>
			<div>
				<ul>
					<li :class="choosedCityIndex==index?'choosedCityItem':''" v-for="(item,index) in productSortlist" @click="choosedPSIndexEV(item,index)">{{item.groupName}}</li>
				</ul>
			</div>
		</div>
		<div id="products" class="scrollfixed" @mousewheel="getmorelist" @touchmove="getmorelist">
			<ul>
				<li v-for="(item,index) in productList" @click="productDetail(item,index)">
					<div class="bgimgcover" :style='"background-image: url("+item.productPic+")"'></div>
					<p>{{item.productName}}</p>
					<div class="lebals" v-if="item.series!=''"><span>{{item.series}}</span></div>
				</li>
			</ul>
			<div class="datagetting" v-if="requesting"></div>
			<div class="datanothing" v-if="nodata"></div>
			<footer v-if="loadingComplete"></footer>
			<div class="upswiper"  v-if="!requesting && !nodata && !loadingComplete"></div>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery'
	export default {
		props: ["brandName", "brandID"],
		data() {
			return {
				productList: [],
				brandNameH: "",
				productSortlist: [],
				choosedCityIndex: 0,
				goPage: 1,
				requesting: true,
				nodata: false,
				loadingComplete: false,
				goPage: 1,
				groupID: -1
			}
		},
		mounted() {
			this.initProductSorts()
			this.brandNameH = this.brandName
		},
		methods: {
			productDetail(item,index) {
				this.$emit("productDetailPage",item)
			},
			choosedPSIndexEV(item, index) {
				if (!this.requesting) {
					this.choosedCityIndex = index
					this.goPage = 1
					this.productList = []
					this.nodata = false
					this.loadingComplete = false
					this.groupID = item.groupID
					this.initProductList(this.groupID)
				}
			},
			initProductSorts() {
				let _this = this
				$.ajax({
					url: baseURL + "WholeDecoration/GetWDBrandGroupPageList_WDBoss",
					data: {
						WholeDecorationID: _this.WholeDecorationID,
						memberGUID: _this.memberGUID,
						brandID: _this.brandID,
						pageSize: 1000,
						goPage: 1
					},
					success: res => {
						if (res.code == 1) {
							let obj = {
								groupID: "",
								groupName: "全部单品"
							}
							res.data.retTable.unshift(obj)
							_this.productSortlist = _this.productSortlist.concat(res.data.retTable)
							_this.groupID = _this.productSortlist[0].groupID
							_this.initProductList(_this.groupID)
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
			initProductList() {
				let _this = this
				this.requesting = true
				$.ajax({
					url: baseURL + "WholeDecoration/GetBrandDLProductPageList_WDBoss",
					data: {
						WholeDecorationID: _this.WholeDecorationID,
						memberGUID: _this.memberGUID,
						brandID: _this.brandID,
						groupID: _this.groupID,
						pageSize: 50,
						goPage: _this.goPage
					},
					success: res => {
						this.requesting = false
						if (res.code == 1) {
							if (_this.goPage == 1) {
								if (res.data.retTable.length == 0) {
									_this.nodata = true
									_this.loadingComplete = false
								}
							}
							_this.productList = _this.productList.concat(res.data.retTable)
							_this.goPage++
							if (_this.goPage > res.data.pageCount) {
								if (!_this.nodata) {
									_this.loadingComplete = true
								}
							}
						} else {
							_this.alertTip(res.errmsg)
						}
					},
					err: err => {
						this.requesting = true
						let msg = JSON.stringify(err)
						_this.alertTip(res.msg)
					}
				})
			},
			getmorelist() {
				var elf = document.getElementsByClassName("scrollfixed")[0]
				if (!this.requesting) {
					if (!this.requesting && !this.loadingComplete && !this.nodata) {
						if (elf.scrollHeight - elf.scrollTop - 50 < elf.clientHeight) {
							this.initProductList()
						}
					}
				}
			},
		}
	}
</script>
<style scoped="scoped">
	#products {
		padding: 0 0.75rem;
		height: 100%;
		overflow: scroll;
		position: relative;
	}

	#products::-webkit-scrollbar {
		display: none;
	}

	#products ul {
		display: flex;
		flex-wrap: wrap;
		padding-bottom: 2rem;
	}

	#products ul li {
		width: 10.9375rem;
		border-radius: 0.625rem;
		margin-left: 0.625rem;
		margin-top: 0.625rem;
		overflow: hidden;
		background-color: #fff;
		background-color: #212647;
	}

	#products .bgimgcover {
		width: 100%;
		height: 10.9375rem;
		position: relative;
	}

	#products li p {
		font-size: 0.9375rem;
		font-weight: bolder;
		color: #fff;
		margin: 0.5rem;
	}

	#products .lebals {
		display: flex;
		flex-wrap: wrap;
		padding-bottom: 0.625rem;
		margin-left: 0.625rem;
	}

	#products .lebals span {
		height: 0.9375rem;
		line-height: 0.9375rem;
		font-size: 0.75rem;
		color: rgba(99, 133, 183, 1);
		padding: 0.125rem 0.5rem;
		border-radius: 0.1875rem;
		background-color: rgba(226, 238, 255, 1);
		margin-right: 0.3125rem;
		margin-top: 0.3125rem;
	}
</style>
