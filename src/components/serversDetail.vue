<template>
  <div id="serversDetail">
	  <div class="templatename">
	  	<!-- <span>首页</span>
	  	<span class="arrow">&gt;</span> -->
		<span @click="backsalemanAll">业务员</span>
		<span class="arrow">&gt;</span>
	  	<span @click="backsaleman">{{serversDetailCity}}</span>
	  	<span class="arrow">&gt;</span>
		<span>{{serversDetailName}}</span>
	  </div>
	  <div class="scrollfixed"  @mousewheel="getmorelist" @touchmove="getmorelist">
		  
    <ul>
      <li v-for="(item,index) in salesmanWDOrderlist">
        <div>
          <!-- <div class="bgimgcover" :style='"background-image: url("+item.photoUrlM+")"'></div> -->
          <div class="msg">
            <p class="title">{{item.houseDetailName}}</p>
            <p class="lebal">{{item.organizationName}}</p>
            <div class="user">业主：
			<!-- <img :src="item.photoUrlM" alt=""> -->
			<span>{{item.memberName}}</span>
			</div>
          </div>
        </div>
        <ul>
          <li><p>{{item.orderMoney}}</p><div>订单金额(元)</div></li>
          <li><p>{{item.receivedOrderMoney}}</p><div>已收订单金额(元)</div></li>
          <li><p>{{item.duration}}</p><div>工期(天)</div></li>
        </ul>
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
    props: ["serversmemberGUID", "serversName", "serversCity", "serversregionInfoID"],
    data() {
      return{
        goPage: 1,
        salesmanWDOrderlist: [],
        requesting: true,
        nodata: false,
        loadingComplete: false,
		serversDetailCity: "",
		serversDetailName: ""
      }
    },
    mounted() {
		this.serversDetailCity = this.serversCity
		this.serversDetailName = this.serversName
        this.initSalesmanWDOrder()
    },
    methods: {
		backsaleman() {
			this.$emit("backtheServerstemplate")
		},
		backsalemanAll() {
			this.$emit("theServerstemplate")
		},
      initSalesmanWDOrder() {
        let _this = this
        this.requesting = true
        $.ajax({
          url: baseURL + "WholeDecoration/GetSalesmanWDOrderPageList_WDBoss",
          data: {
              WholeDecorationID: _this.WholeDecorationID,
              memberGUID: _this.memberGUID,
              regionInfoID: _this.serversregionInfoID,
              salesmanGUID: _this.serversmemberGUID,
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
                _this.salesmanWDOrderlist = _this.salesmanWDOrderlist.concat(res.data.retTable)
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
          if( !this.requesting ){
              if(!this.requesting && !this.loadingComplete && !this.nodata){
                  if( elf.scrollHeight - elf.scrollTop - 50 < elf.clientHeight ){
                      this.initSalesmanWDOrder()
                  }
              }
          }
      },
    }
  }
</script>

<style>
	#serversDetail .scrollfixed{
		overflow: scroll;
		height: 97%;
	}
  #serversDetail .scrollfixed>ul{
    display: flex;
    flex-wrap: wrap;
    width: 95%;
    margin: auto;
  }
  #serversDetail .scrollfixed>ul>li{
    width: 18.75rem;
    background-color: #fff;
    border-radius: 0.3125rem;
    margin-left: 0.375rem;
    padding: 0.625rem 0;
  }
  #serversDetail .scrollfixed>ul>li:nth-child(3n+1){
    margin-left: 0;
  }
  #serversDetail .scrollfixed>ul>li:nth-child(n+4){
    margin-top: 0.625rem;
  }
  #serversDetail .scrollfixed>ul>li>div{
    display: flex;
  }
  #serversDetail ul .bgimgcover{
    width: 5rem;
    height: 3.75rem;
    border-radius: 0.3125rem;
    margin: 0 0.625rem;
    background-color: #efefef;
  }
  #serversDetail ul .msg{
    width: calc(100% - 6.875rem);
	width: 100%;
	margin: 0 0.625rem;
    padding-bottom: 0.75rem;
  }
  #serversDetail ul .title{
    font-weight: bolder;
    word-wrap: normal;
    word-break: break-all;
    width: 100%;
  }
  #serversDetail ul .lebal{
    color: rgba(0, 130, 203, 1);
    font-size: 0.75rem;
    line-height: 1.125rem;
    border-radius: 0.1875rem;
    background-color: rgba(236, 245, 255, 1);
    display: inline-block;
    padding: 0.125rem 0.25rem 0.1rem;
  }
  #serversDetail ul .user{
    font-size: 0.75rem;
    color: rgba(144, 150, 156, 1);
  }
  #serversDetail ul .user img{
    height: 1.125rem;
    width: 1.125rem;
    border-radius: 50%;
    margin: 0 0.25rem;
    transform: translateY(0.25rem);
    background-color: #efefef
  }
  #serversDetail ul span{
    color: #333;
  }
  #serversDetail li ul{
    display: flex;
    margin: 0 0.625rem;
    border-top: 1px solid rgba(237, 241, 243, 1);
    padding-top: 0.5rem
  }
  #serversDetail li ul li{
    width: 33.3%;
    text-align: center;
  }
  #serversDetail li ul p{
     font-size: 0.875rem;
     color: rgba(255, 82, 42, 1);
     font-family: "price";
  }
  #serversDetail li ul div{
    font-size: 0.75rem;
    color: rgba(144, 150, 156, 1);
    transform: scale(0.8);
  }
</style>
