<template>
  <div id="servers">
	  <div class="templatename">
	  	<!-- <span>首页</span>
	  	<span class="arrow">&gt;</span> -->
	  	<span>业务员</span>
	  	<span class="arrow">&gt;</span>
	  	<div>
	  		<ul>
	  			<li :class="choosedCityIndex==index?'choosedCityItem':''" v-for="(item,index) in serversCitylist" @click="choosedCityIndexEV(item,index)">{{item.regionName}}</li>
	  		</ul>
	  	</div>
	  </div>
	  <div class="scrollfixed" @mousewheel="getmorelist" @touchmove="getmorelist">
		  <ul>
		    <li v-for="(item,index) in serverslist" @click="getSalesmanWDOrderPageList(item,index)">
		      <div class="bgimgcover" :style='"background-image: url("+item.photoUrlM+")"'></div>
		      <div class="name">{{item.memberName}}</div>
		      <div class="titleEL"><p class="title">{{item.WDorganizationName}}</p></div>
		      <div class="num"><span>下单数量</span><span>{{item.orderSL}}</span></div>
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
  export default{
    props: ["serversregionInfoID", "serverscityList"],
    data() {
      return{
        goPage: 1,
        serverslist: [],
        requesting: true,
        nodata: false,
        loadingComplete: false,
		serversCitylist: [],
		serversregionInfoIDH: -1,
		choosedCityIndex: 0
      }
    },
    mounted() {
		this.initserversPage()
    },
    methods: {
		
		
		getSalesmanWDOrderPageList(item,index) {
			let serversCity = ""
			let id = -1
			this.serversCitylist.forEach((itemx,index) => {
				if( itemx.regionInfoID == item.regionInfoID ){
					serversCity = itemx.regionName
					id = itemx.regionInfoID
				}
			})
			this.$emit("serversDetailPage",item,serversCity,id)
		},
		
		
		choosedCityIndexEV(item,index) {
			if( !this.requesting ){
				this.choosedCityIndex = index
				this.serversregionInfoIDH = item.regionInfoID
				this.serverslist = []
				this.goPage = 1
				this.nodata = false
				this.loadingComplete = false
				this.initServers()
			}
		},
		
		initserversPage() {
			let _this = this
			let obj = {
				regionInfoID: -1,
				regionName: "全部城市"
			}
			let list = []
			list = list.concat(obj)
			list = list.concat(this.serverscityList)
			this.serversCitylist = list
			this.serversregionInfoIDH = this.serversregionInfoID
			this.initServers()
			this.serversCitylist.forEach((item,index) => {
				if( this.serversregionInfoIDH == item.regionInfoID ){
					_this.choosedCityIndex = index
				}
			})
		},
		
		
      initServers() {
        let _this = this
        this.requesting = true
        $.ajax({
          url: baseURL + "WholeDecoration/GetSalesmanPageList_WDBoss",
          data: {
              WholeDecorationID: _this.WholeDecorationID,
              memberGUID: _this.memberGUID,
              regionInfoID: _this.serversregionInfoIDH,
              pageSize: 50,
              goPage: _this.goPage
          },
          success: res => {
            this.requesting = false
            if( res.code == 1 ){
                if( _this.goPage == 1 ){
                    if( res.data.retTable.length == 0 ){
                        _this.nodata = true
                        _this.loadingComplete = false
                    }
                }
                _this.serverslist = _this.serverslist.concat(res.data.retTable)
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
            this.requesting = true
            let msg = JSON.stringify(err)
            _this.alertTip(res.msg)
          }
        })
      },
      getmorelist() {
          var elf = document.getElementsByClassName("scrollfixed")[0]
          console.log()
          if( !this.requesting ){
              if(!this.requesting && !this.loadingComplete && !this.nodata){
                  if( elf.scrollHeight - elf.scrollTop - 50 < elf.clientHeight ){
                      this.initServers()
                  }
              }
          }
      },
    }
  }
</script>

<style>
	 #servers .scrollfixed{
		overflow: scroll;
		height: 97%;
	}
  #servers .scrollfixed>ul{
    display: flex;
    flex-wrap: wrap;
    width: 97%;
    margin: auto;
  }
  #servers .scrollfixed>ul>li{
    width: 7.9375rem;
    background-color: rgba(29, 33, 63, 1);
    border-radius: 0.3125rem;
    margin-left: 0.375rem;
    padding: 0.625rem 0;
  }
  #servers .scrollfixed>ul>li:nth-child(7n+1){
    margin-left: 0;
  }
  #servers .scrollfixed>ul>li:nth-child(n+8){
    margin-top: 0.625rem;
  }
  #servers .bgimgcover{
    width: 2.875rem;
    height: 2.875rem;
    border-radius: 50%;
    border: 0.125rem solid #fff;
    margin: auto;
  }
  #servers .name{
    font-weight: bolder;
    color: #fff;
    font-size: 0.9375rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0.3125rem 0.625rem 0;
  }
  #servers .name span{
    background-color: #FFFFFF;
    border-radius: 0.1875rem;
    font-size: 0.75rem;
    color: rgba(76, 114, 171, 1);
    padding: 0.1rem 0.25rem 0.125rem;
    transform: scale(0.8);
    display: inline-block;
  }
  #servers .titleEL{
    display: flex;
    justify-content: center;
  }
  #servers .title{
    font-size: 0.75rem;
    transform: scale(0.85);
    color: rgba(164, 195, 237, 1);
    margin: 0 auto 0;
    display: inline-block;
  }
  #servers .num{
    color: rgba(255, 182, 42, 1);
    font-size: 0.5625rem;
    margin: 0 auto 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }
  #servers .num span:nth-of-type(1){
     transform: scale(0.8);
  }
  #servers .num span:nth-of-type(2){
    font-size: 0.9375rem;
    font-family: 'price';
    margin-left: 0.25rem;
  }
</style>
