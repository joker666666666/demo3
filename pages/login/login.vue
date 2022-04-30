<template>
	<view class="content">
		<view class="form">
			<view class="inputWrapper">
				<view class="title">智能物流调度系统</view>
			</view>
			<view class="inputWrapper">
				<input class="input" type="text" v-model="username" placeholder="请输入用户名"/>
			</view>
			<view class="inputWrapper">
				<input class="input" type="password" v-model="password" placeholder="请输入密码"/>
			</view>
			<view class="loginBtn" @click="clickLogin">
				<text class="btnValue">登录</text>
			</view>
			
			<view class="loginBtn" @click="clickExit">
				<text class="btnValue">退出登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				username: null,
				password: null,
			}
		},
		onLoad() {
			
		},
		methods: {
			//登录
			clickLogin() {
				uni.request({
				     url: 'http://10.128.194.56:8080/login/select?name=' + this.username,
				     success: (res) => {
						console.log(res)
						if(res.data.password === this.password) {
							uni.showToast({
								title: '登录成功',
								icon: 'success'
							});
							//本地缓存用户名和密码
							try {
								uni.setStorageSync('username', this.username);
								uni.setStorageSync('password', this.password);
								uni.setStorageSync('userId', res.data.id);
							} catch (e) {
								// error
								console.log(e);
							}
							//导航到主页
							uni.redirectTo({
								url: '/pages/home/home',
								complete (e) {
									console.log("什么情况：",e);
								}
							});
						} else { //登录失败
							uni.showToast({
								title: '用户名或密码错误',
								icon: 'none'
							});
							this.username = null;
							this.password = null;
						}
				    }
				});
			}, // end clickLogin
			clickExit() {
				uni.showModal({
					title: '提示',
					content: '是否退出应用？',
					success: function(res) {
						if (res.confirm) {
							// 退出当前应用，改方法只在App中生效
							plus.runtime.quit();
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			} // end clickExit
		}
	}
</script>

<style>
	.content {
		background: #ffffff;
		width: 100vw;
		height: 100vh;
	}
	.avatorWrapper{
		height: 30vh;
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}
	.avator{
		width: 200upx;
		height: 200upx;
		overflow: hidden;
	}
	.avator .img{
		width: 100%
	}
	.form{
		padding: 0 100upx;
		margin-top: 80px;
	}
	.inputWrapper{
		width: 100%;
		height: 80upx;
		background: white;
		border-radius: 20px;
		box-sizing: border-box;
		padding: 0 20px;
		margin-top: 25px;
	}
	.inputWrapper .input{
		width: 100%;
		height: 100%;
		text-align: center;
		font-size: 15px;
	}
	.inputWrapper .title{
		width: 100%;
		height: 100%;
		text-align: center;
		font-size: 30px;
	}
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
	.forgotBtn{
		text-align: center;
		color: #EAF6F9;
		font-size: 15px;
		margin-top: 20px;
	}
</style>
