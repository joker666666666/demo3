<template>
	<view>
		<uni-card >
			<uni-section :title="orderType.typeName" :subTitle="orderId"  type="line">
				<uni-list>
					<uni-list-item title="出发时间" :rightText="orderDetails.departureTime" />
					<uni-list-item title="送达时间" :rightText="orderDetails.arrivalTime" />
					<uni-list-item title="取货地址" :rightText="orderDetails.origin" />
					<uni-list-item title="取货地址" :rightText="orderDetails.destination" />
					<uni-list-item title="承运车辆" :rightText="orderDetails.transportVehicle" />
					<uni-list-item title="订单类型" :rightText="orderDetails.orderType" />
					<uni-list-item title="运输货物"></uni-list-item>
				</uni-list>
				<uni-table ref="table" border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th width="150" align="center">货物</uni-th>
						<uni-th width="150" align="center">数量</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in orderDetails.items" :key="index">
						<uni-td align="center">{{item.it}}</uni-td>
						<uni-td align="center">{{item.num}}</uni-td>
					</uni-tr>;
				</uni-table>
			</uni-section>
		</uni-card>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId: null,
				orderType: null,
				orderDetails: {
					departureTime: null,
					arrivalTime: null,
					origin: null,
					destination: null,
					transportVehicle: null,
					orderType: null,
					items: [{}]
				}
			}
		},
		onLoad(option) {
			this.orderId = option.orderId;
			if(option.orderType==1)
				this.orderType = {
					typeId: 1,
					typeName: "已完成订单",
				};
			else
				this.orderType = {
					typeId: 2,
					typeName: "异常订单",
				};
			console.log(option);
			
			let that = this;
			uni.request({
			     url: 'http://10.128.194.56:8080/api/orderDetails?orderId='+ that.orderId,
			     success: (res) => {
			        console.log("res=",res);
					if(res.statusCode == 404) {
						uni.showToast({
							title: '访问服务器失败',
						})
					} else {
						that.orderDetails = res.data;
						console.log(that.orderDetails);
					}
			    }
			});
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
		}
	}
</script>

<style>
</style>
