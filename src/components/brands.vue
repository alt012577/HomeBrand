<template>
	<div id="ELinner">
		<div class="templatename">
			<span>品牌墙</span>
      <span class="arrow">&gt;</span>
      <div>
      	<ul>
      		<li :class="choosedSortIndex==index?'choosedCityItem':''" v-for="(item,index) in brandSortlist" @click="choosedSortIndexEV(item,index)">{{item.linkName}}</li>
      	</ul>
      </div>
		</div>
		<div id="barnds" class="scrollfixed"  @mousewheel="getmorelist" @touchmove="getmorelist">
			<ul id="picinner">
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
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
    props: ["brandSortList","linkIDH"],
		data() {
			return {
				brandLogoList: [],
				requesting: false,
				goPage: 1,
				nodata: false,
				loadingComplete: false,
        brandSortlist: [],
        linkID: "",
        choosedSortIndex: 0,
        intingPage: false
			}
		},
		mounted() {
      this.linkID = this.linkIDH
      if( !this.intingPage ){
        this.initbrandPage()
      }
		},
		methods: {
      initbrandPage() {
        this.intingPage = true
      	let _this = this
      	let obj = {
      		linkID: "",
      		linkName: "全部品牌"
      	}
      	let list = []
      	list = list.concat(obj)
      	list = list.concat(this.brandSortList)
      	this.brandSortlist = list
        this.initBrandList()
      	this.brandSortlist.forEach((item,index) => {
      		if( this.linkID == item.linkID ){
      			_this.choosedSortIndex = index
      		}
      	})
        console.log(12,this.linkID)
      },
      choosedSortIndexEV(item,index) {
        if( !this.requesting ){
					this.choosedSortIndex = index
					this.linkID = item.linkID
          this.goPage = 1
					this.nodata = false
					this.loadingComplete = false
          let el = document.getElementById("picinner")
          picinner.children[0].innerHTML = ""
          picinner.children[1].innerHTML = ""
          picinner.children[2].innerHTML = ""
          picinner.children[3].innerHTML = ""
          picinner.children[4].innerHTML = ""
					this.initBrandList()
				}
      },

			initBrandList() {
        console.log(999999)
				this.requesting = true
				let _this = this
				$.ajax({
					url: baseURL + "WholeDecoration/GetWholeDecorationBrandPageList_WDBoss",
					data: {
						WholeDecorationID: _this.WholeDecorationID,
						memberGUID: _this.memberGUID,
						decorationLinkID: _this.linkID,
						pageSize: 100,
						goPage: _this.goPage,
					},
					success: res => {
            _this.intingPage = false
						_this.requesting = false
						if( res.code == 1 ){
						    if( _this.goPage == 1 ){
						        if( res.data.retTable.length == 0 ){
						            _this.nodata = true
						            _this.loadingComplete = false
						        }
						    }
						    _this.initPics(res.data.retTable)
						    _this.goPage++
						    if( _this.goPage > res.data.pageCount ){
						        if( !_this.nodata ){
						            _this.loadingComplete = true
						        }
						    }
						}else{
						  _this.alertTip(res.errmsg)
						}
					},
					err: err => {
            this.intingPage = false
            this.requesting = false
						let msg = JSON.stringify(err)
						this.alertTip(res.msg)
					}
				})
			},

			getmorelist() {
				var elf = document.getElementsByClassName("scrollfixed")[0]
				if (!this.requesting) {
					if (!this.requesting && !this.loadingComplete && !this.nodata) {
						if (elf.scrollHeight - elf.scrollTop - 50 < elf.clientHeight) {
							this.initBrandList()
						}
					}
				}
			},


			initPics(list) {
				let num = 1
				this.brandLogoList = list
				let picinner = document.getElementById("picinner")
         picinner.children[0].innerHTML = ""
         picinner.children[1].innerHTML = ""
         picinner.children[2].innerHTML = ""
         picinner.children[3].innerHTML = ""
         picinner.children[4].innerHTML = ""
				for (let i = 0; i < this.brandLogoList.length; i++) {
					let img = document.createElement("img")
					img.style.width = "96%"
					// img.style.borderRadius = "0.3125rem"
					// img.style.padding = "0.3125rem 2%"
					img.style.marginTop = "0.625rem"
					// img.style.backgroundColor = "#fff"
					img.src = this.brandLogoList[i].brandLOGO
					let _this = this
					img.onload = res => {
						let innerlength = picinner.children[0].clientHeight
						let innerIndex = 0
						for (let u = 0; u < 5; u++) {
							let liHeight = picinner.children[u].clientHeight
							if (liHeight < innerlength) {
								innerlength = liHeight
								innerIndex = u
							}
						}
						picinner.children[innerIndex].appendChild(img)
						img.addEventListener("click",function(){
							_this.$emit("productPage",_this.brandLogoList[i])
						})
					}
				}
			},

		}
	}
</script>
<style scoped="scoped">
	#barnds {
		padding: 0 0.75rem;
		height: 100%;
		overflow: scroll;
	}

	#barnds::-webkit-scrollbar {
		display: none;
	}
	#barnds ul {
		font-size: 0;
		padding-bottom: 2rem;
	}
	#barnds ul::after{
		content: '';
		display: block;
		clear: both;
	}
	#barnds ul li {
		width: 10.9375rem;
		margin-left: 0.625rem;
		margin-top: 0.625rem;
		overflow: hidden;
		float: left;
	}

	#barnds ul li img {
		width: 100%;
		border-radius: 0.625rem;
	}
</style>
