<template>
	<view class="container">
		<uni-section title="基本用法" type="line">
			<view class="example">
				<uni-forms ref="baseForm" :modelValue="baseFormData">
					<uni-forms-item label="通知方式" >
						<uni-data-checkbox v-model="baseFormData.meanOfNoti" :localdata="meansOfNotification" />
					</uni-forms-item>
					
					<uni-forms-item>
						<button @click="clickExit">退出当前账号</button>
					</uni-forms-item>
				</uni-forms>
			</view>
		</uni-section>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 基础表单数据
				baseFormData: {
					name: '',
					age: '',
					introduction: '',
					meanOfNoti: 2,
					hobby: [5],
					datetimesingle: 1627529992399
				},
				// 单选数据源
				meansOfNotification: [{
					text: '正常通知',
					value: 0
				}, {
					text: '振动',
					value: 1
				}, {
					text: '静音',
					value: 2
				}],
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
			clickExit() {
				uni.showModal({
					title: '提示',
					content: '是否退出登录？',
					success: function(res) {
						if (res.confirm) {
							// 清理本地缓存
							try {
								uni.clearStorageSync();
							} catch (e) {
								// error
								console.log(e);
							}
							uni.reLaunch({
								url: '../../login/login',
								complete(e) {
									console.log(e);
								}
							})
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
	.example {
		padding: 15px;
		background-color: #fff;
	}
</style>
