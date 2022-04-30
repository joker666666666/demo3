<template>
	<view class="container">
		<uni-section title="已完成订单" type="line">
			<uni-list>
				<uni-list-item  v-for="item in orderList" :key="item.id" :title="item.title" :note="item.note" 
					ellipsis="1" showArrow rightText="详情" clickable @click="orderClick(item.id,1)"/>
			</uni-list>
		</uni-section>
		
		<uni-section title="异常订单" type="line">
			<uni-list>
				<uni-list-item title="订单号:20001" ellipsis="1" note="行程: 鞍钢到一汽 出发时间:2022-04-27 预计到达时间:2022-04-28" 
				showArrow rightText="详情" clickable @click="orderClick(20001,2)" />
			</uni-list>
		</uni-section>
	</view>
</template>

<script>
	export default {
		components:{},
		
		data() {
			return {
				orderList: [
					{
						"id": 10001,
						"title": "订单号：10001",
						"note": "行程：北京到上海 出发时间: 2022/04/13 预计到达时间: 2022/04/14",
					},
					{
						"id": 10002,
						"title": "订单号：10002",
						"note": "行程：长沙到武汉 出发时间: 2022/04/13 预计到达时间: 2022/04/14",
					}
				]
			};
		},
		
		onBackPress(options) {
			//console.log("currentPages:",getCurrentPages());
			if (options.from == 'navigateBack') {
				return false;
			}
			uni.navigateBack({
				delta: 1
			})
			return true;
		},
		
		methods: {
			orderClick(orderId, orderType) {
				//console.log("orderId:",orderId);
				uni.navigateTo({
					url: './details?orderId='+orderId+'&orderType='+orderType,
					complete(e) {
						console.log(e);
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.container{
		background-color: #F8F8F8;
	}
</style>
