<template>
	<view class="container">
		<uni-section title="个人信息" type="line">
			<uni-list style="font-size: 100rpx;">
				<uni-list-item title="姓名" rightText="张三" />
				<uni-list-item title="工号" rightText="123456" />
				<uni-list-item title="手机号码" :rightText="phoneNum" clickable="true" @click="updatePhoneNum"/>
			</uni-list>
		</uni-section>
		<uni-section title="车辆信息" type="line">
			<uni-list>
				<uni-list-item title="车牌号" rightText="冀A·88888"/>
				<uni-list-item title="车辆类型" rightText="大型货车" />
				<uni-list-item title="载重量"  rightText="50吨" />
				<uni-list-item title="车高"  rightText="3.4米" />
				<uni-list-item title="车宽"  rightText="2.5米" />
			</uni-list>
		</uni-section>
		
		<uni-section title="订单信息" type="line">
			<uni-list>
				<uni-list-item title="已完成订单" rightText="87"/>
				<uni-list-item title="异常订单" rightText="2" />
			</uni-list>
		</uni-section>
	</view>
</template>

<script>
	// import uni-section from '@/components/uni-section/uni-section.vue';
	export default {
		components: {
			// uni-section
		},
		data() {
			return {
				phoneNum: '13342516789',
			}
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
			updatePhoneNum() {
				console.log("啥情况啊");
				let that = this;
				uni.showModal({
					title: '修改手机号码',
					editable: 'true',
					placeholderText: '请输入新的手机号码',
					success: function (res) {
						if (res.confirm) {
							that.phoneNum = res.content;
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
		}
	}
</script>
	
<style>
	.container{
		background-color: #F8F8F8;
	}
</style>
