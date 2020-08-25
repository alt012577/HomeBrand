<template>
  <div>
	  <div class="templatename">
	  	<!-- <span>首页</span>
	  	<span class="arrow">&gt;</span> -->
	  	<span @click="backProduct">{{brandNameH}}</span>
	  	<span class="arrow">&gt;</span>
		<span>{{productNameH}}</span>
	  </div>
    <div id="productDetail">
      <div class="theProduct">
          <div class="bgimgcover" :style='"background-image: url("+productPic+")"'></div>
          <div class="msg">
            <p class="title">{{productNameaaa}}</p>
            <!-- <div class="lebals"><span>经典</span><span>高端品质</span><span>高端品质</span><span>高端品质</span><span>经典</span></div> -->
            <!-- <div class="lebal lebal1"><span>系列：</span><span>2020最新款</span></div> -->
            <!-- <div class="lebal lebal2"><span>颜色：</span><span>白色/黑色/红色/蓝色</span></div> -->
          </div>
          <!-- <div class="codeImg">
            <img src="../assets/465465.png" alt="">
            <p>扫一扫 查看产品详情</p>
          </div> -->
      </div>
      <div v-if="productPriceList.length != 0" class="priceTitle">该单品在各地供应报价：</div>
      <div class="prices">
         <div v-if="productPriceList.length != 0">
           <span>城市</span>
           <span>客户销售价</span>
           <span>零售价</span>
		   <span>软诚批发价</span>
           <span>工厂结算价</span>
           <span>家居品牌收益（差价）</span>
		   <span>属地公司收益（差价）</span>
         </div>
         <ul>
           <li v-for="(item,index) in productPriceList">
             <div><img src="../assets/icon_local_green@2x.png" alt=""><span>{{item.region_name}}</span></div>
             <div>
               <span>￥</span>
               <span>{{item.sale}}</span>
             </div>
             <div>
               <span>￥</span>
               <span>{{item.retail}}</span>
             </div>
             <div>
               <span>￥</span>
               <span>{{item.whole}}</span>
             </div>
             <div>
               <span>￥</span>
               <span>{{item.settle}}</span>
             </div>
             <div>
               <span>￥</span>
               <span>{{item.brand_earnings}}</span>
             </div>
			 <div>
			   <span>￥</span>
			   <span>{{item.operator_earnings}}</span>
			 </div>
           </li>
         </ul>
       </div>
    </div>
  </div>
</template>

<script>
	import $ from 'jquery'
  export default{
	  props: ["productID", "productName", "brandName"],
    data() {
      return{
		brandNameH: "",
		productNameH: "",
		productPriceList: [],
		productPic: '',
		productNameaaa: ""
      }
    },
    mounted() {
		this.brandNameH = this.brandName
		this.productNameH = this.productName
		this.initProductDetail()
    },
    methods: {
		backProduct() {
			this.$emit("backProductPage")
		},
		initProductDetail() {
			let _this = this
			$.ajax({
				url: baseURL + "WholeDecoration/GetProductSupplyChain_WDBoss",
				data: {
					WholeDecorationID: _this.WholeDecorationID,
					memberGUID: _this.memberGUID,
					productID: _this.productID,
				},
				success: res => {
					if (res.code == 1) {
						_this.productPriceList = JSON.parse(res.data.cityProductData)
						_this.productPic = res.data.productPic
						_this.productNameaaa = res.data.productName
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
    }
  }
</script>
<style scoped="scoped">
    #productDetail{
      color: #fff;
    }
    #productDetail::-webkit-scrollbar{
      display: none;
    }
    #productDetail .lebals{
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 0.625rem;
      margin-top: 0.75rem;
    }
    #productDetail .lebals span{
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
    .theProduct{
      display: flex;
      padding: 1.25rem 0;
      background-color: rgba(33, 38, 71, 1);
      border-radius: 0.625rem;
      margin: 0 0.9375rem;
    }
    .theProduct .bgimgcover{
      width: 10.9375rem;
      height: 10.9375rem;
      border-radius: 0.625rem;
      margin: 0 1.25rem;
	  background-color: #EFEFEF;
    }
    .theProduct .lebal2{
      margin-top: 0.5rem
    }
    .theProduct .lebal1{
      margin-top: 1rem
    }
    .theProduct .lebal span:nth-of-type(1){
      color: rgba(183, 186, 203, 1);
    }
    .theProduct .title{
      font-size: 1.375rem;
      font-weight: bolder;
    }
    .theProduct .msg{
      width: 50%;
    }
    .theProduct .codeImg{
      width: calc(100% - 50% - 14.6875rem);
      margin-left: 1.25rem;
      position: relative;
    }
    .theProduct .codeImg::before{
      content: '';
      display: block;
      height: 6.125rem;
      width: 2px;
      background-color: #fff;
      position: absolute;
      top: 50%;
      transform: translateY(-50%)
    }
    .theProduct .codeImg img{
      display: block;
      margin: 2.5rem auto 0.9375rem;
      width: 3.75rem;
      height: 3.75rem;
    }
    .theProduct .codeImg p{
      text-align: center;
      color: rgba(183, 186, 203, 1);
      font-size: 0.75rem;
    }
    .prices{
      margin: 0 0.9375rem;
      height: 57.5vh;
    }
    .prices>ul{
      height: calc(100% - 2.1875rem);
      overflow-y: scroll;
    }
    .prices>div{
      background-color: rgba(56, 127, 118, 1);
      height: 2.1875rem;
      border-radius: 0.625rem 0.625rem 0 0;
      line-height: 2.1875rem;
      display: flex;
      text-align: center;
    }
    .prices>div span{
      display: block;
	  white-space: nowrap;
    }
    .prices>div span{
      width: 12%;
    }
    .prices>div span:first-child{
      width: 18%;
    }
    .prices>div span:last-child{
      /* width: 30%; */
    }
	.prices>div span:nth-of-type(6),
	.prices>div span:nth-of-type(7){
		width: 17%;
	}
    .prices>ul>li{
      display: flex;
      height: 4.375rem;
      background-color: rgba(33, 38, 71, 1);
      line-height: 1.75rem;
    }
    .prices>ul>li img{
      height: 1.75rem;
      width: 1.75rem;
      margin-right: 0.25rem;
	  margin-left: 1rem;
    }
    .prices>ul>li:nth-child(2n){
      background-color: rgba(109, 118, 171, 1);
    }
    .prices>ul>li div{
      width: 12%;
      font-size: 1.25rem;
      font-family: 'price';
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
	.prices>ul>li div:first-child{
		justify-content: start
	}
	.prices>ul>li div:nth-of-type(6),
	.prices>ul>li div:nth-of-type(7){
		width: 17%;
	}
    .prices>ul>li div::after{
      content: '';
      display: block;
      position: absolute;
      height: 1.625rem;
      width: 0.0625rem;
      background-color: rgba(109, 118, 171, 1);
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
	.prices>ul>li:nth-child(2n) div::after{
		background-color: rgba(33, 38, 71, 1);
	}
    .prices>ul>li div span:nth-of-type(1){
      font-size: 0.9375rem;
      margin-right: 0.25rem;
    }
    .prices>ul>li div:first-child{
      width: 18%;
      font-size: 1.125rem;
      font-weight: bolder;
    }
    .prices>ul>li div:first-child::after{
      display: none;
    }
    .prices>ul>li div:last-child::after{
      display: none;
    }
    .prices>ul>li div:last-child{
      /* width: 30%; */
      /* color: rgba(255, 182, 42, 1); */
    }
	.prices>ul>li div:nth-of-type(3){
		position: relative;
	}
	.prices>ul>li div:nth-of-type(3)::before{
		content: '';
		height: 0.0625rem;
		width: 70%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		background-color: #FFFFFF;
	}
    .priceTitle{
      font-size: 1.125rem;
      color: rgba(52, 191, 130, 1);
      font-weight: bolder;
      height: 3rem;
      line-height: 3rem;
      text-align: center;
    }
</style>
