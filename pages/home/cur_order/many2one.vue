<template>
	<view>
		多车一单
	</view>
</template>

<script>
	export default {
		onBackPress() {
			uni.switchTab({
				url: '/pages/home/home',
				complete(e) {
					console.log(e);
				}
			})
			uni.setTabBarItem({
			  index: 0,
			  visible: true,
			});
			uni.setTabBarItem({
			  index: 1,
			  visible: true,
			});
			uni.setTabBarItem({
			  index: 2,
			  visible: false,
			});
			uni.setTabBarItem({
			  index: 3,
			  visible: false,
			});uni.setTabBarItem({
			  index: 4,
			  visible: false,
			});
			return true;
		}
	}
</script>

<style>
</style>
