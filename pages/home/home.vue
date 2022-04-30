<template>
	<view>
		<button @click="curOrderBtn">当前订单</button>
		<button @click="orderHistoryBtn">历史订单</button>
		<button @click="navigationBtn">导航助手</button>
		<button @click="personInfoBtn">个人信息</button>
		<button @click="sysSettingsBtn">系统设置</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
			
		},
		onBackPress() {
			return true;
		},
		methods:{
			curOrderBtn() {
				uni.navigateTo({
					url: '/pages/home/cur_order/one2one',
					complete(e) {
						console.log(e);
					},
				})
			},
			
			orderHistoryBtn() {
				uni.navigateTo({ //可能需要使用 uni.relaunch()
					url: "order_history/order_history",
					complete(e) {
						console.log(e);
					}
				})
			},
			//导航助手
			navigationBtn() {
				uni.navigateTo({
					url: '/pages/home/route_planning/route_planning',
					complete(e) {
						console.log(e);
					}
				})
			},
			//个人设置
			personInfoBtn() {
				uni.navigateTo({
					url: '/pages/home/person_info/person_info',
					complete(e) {
						console.log(e);
					}
				})
			},
			//系统设置
			sysSettingsBtn() {
				uni.navigateTo({
					url: '/pages/home/system_settings/system_settings',
					complete(e) {
						console.log(e);
					}
				})
			}
		} // end methods
	}
</script>

<style>
	.loginBtn{
		width: 100%;
		height: 80upx;
		background: #77B307;
		border-radius: 50upx;
		margin-top: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		
	}
	.loginBtn .btnValue{
		color: white;
	}
</style>
