<template>
	<view class="container">
		<!-- <view class="custom-cover">
			<map name="map-in-one2one"
			style="width: 100%;"
			scale="12"
			:longitude="longitude"
			:latitude="latitude"
			:markers="markers"
			><cover-view style='width:100%;height:100%'></cover-view></map>
		</view> -->
		<!-- <uni-section title="订单编号" subTitle="10001" type="line"> -->
		
		<uni-section title="订单进度" type="line">
			<uni-steps :options="list1" :active="active" />
		</uni-section>
		<uni-section title="行程信息" type="line">
			<uni-card>
			<uni-row class="item">
				<uni-col :span="12"><text class="uni-col">取货地址</text></uni-col>
				<uni-col :span="12"><text class="uni-col">{{curOrder.origin.name}}</text></uni-col>
			</uni-row>
			<uni-row class="item">
				<uni-col :span="12"><text class="uni-col">配送地址</text></uni-col>
				<uni-col :span="12"><text class="uni-col">{{curOrder.destination.name}}</text></uni-col>
			</uni-row>
			<!-- <uni-row class="item">
				<uni-col :span="12"><text class="uni-col">出发时间</text></uni-col>
				<uni-col :span="12"><text class="uni-col">{{curOrder.departureTime}}</text></uni-col>
			</uni-row> -->
			<!-- <uni-row class="item">
				<uni-col :span="12"><text class="uni-col">预计到达时间</text></uni-col>
				<uni-col :span="12"><text class="uni-col">{{curOrder.ETA}}</text></uni-col>
			</uni-row> -->
			</uni-card>
		</uni-section>
		<uni-section title="货物信息" type="line">
			<uni-table ref="table" border stripe emptyText="暂无更多数据">
				<uni-tr>
					<uni-th width="150" align="center">货物</uni-th>
					<uni-th width="150" align="center">数量</uni-th>
				</uni-tr>
				<uni-tr>
					<uni-td align="center">A类钢棒</uni-td>
					<uni-td align="center">3吨</uni-td>
				</uni-tr>
				<uni-tr>
					<uni-td align="center">B类钢棒</uni-td>
					<uni-td align="center">4吨</uni-td>
				</uni-tr>
			</uni-table>
		</uni-section>
		<button>厂内导航</button>
		<button @click="navigation">出发</button>
			
		</uni-section>
	</view>
</template>

<script>
	const globalEvent = uni.requireNativePlugin('globalEvent');
	const modal = uni.requireNativePlugin('modal');
	const aMapNavi = uni.requireNativePlugin('FUN-AMapNavi-mini'); //注意完整版和精简版ID名称
	
	export default {
		
		data() {
			return {
				active: 2,
				list1: [{
					title: '已接单'
				}, {
					title: '装车'
				}, {
					title: '运送中'
				}, {
					title: '已完成'
				}],
				curOrder: {
					trackingNum: null,
					origin: {},
					destination: {},
					departureTime: null,
					arrivalTime: null,
					orderProgress: null
				},
				longitude:119,
				latitude:40,
				markers: [],
			}
		},
		onLoad() {
			let that = this;
			console.log(uni.getStorageSync('userId'));
			uni.request({
			     url: 'http://10.128.194.56:8080/api/curOrder?userId=' + 100,
			     success: (res) => {
			        console.log("res=",res);
					if(res.statusCode == 404) {
						uni.showToast({
							title: '访问服务器失败',
						})
					} else {
						that.curOrder = res.data;
						//that.curOrder.ETA = res.data.arrivalTime;//后端送来的这个数据有点问题，是小写的eta
						that.longitude = res.data.origin.longitude;
						that.latitude = res.data.origin.latitude;
						that.markers[0] = {
							id: 1,
							latitude: that.latitude,
							longitude: that.longitude,
							iconPath: '/static/steel_base.png',
							title: res.data.origin.name,
							callout: {
								content: res.data.origin.name,
								color: '#ffffff',
								fontSize: '14',
								display: 'ALWAYS',
								bgColor: '#FF6F1E',
								padding: '10',
								textAlign: 'center',
								borderRadius: '15'
							}
						}
					}
			    }
			});
		},
		onShow() {
			
		},
		onBackPress(options) {
			if (options.from == 'navigateBack') {
				return false;
			}
			uni.navigateBack({
				delta: 1
			})
			return true;
		},
		
		methods: {
			navigation() {
				// uni.redirectTo({
				// 	url: '../route_planning/route_planning?curOrder='+ encodeURIComponent(JSON.stringify(this.curOrder)),
				// 	complete(e) {
				// 		console.log(e);
				// 	}
				// })
				
				this.showRoute(this.curOrder.origin, this.curOrder.destination);
			},
			
			showRoute(start, end) {
				// 导航
				aMapNavi.showRoute({
						theme: 0, ////主题，默认0蓝，取之范围0-2分别表示蓝，浅，暗 
						start: { //起点 
							name: start.name, // 地名 String
							coordinate: { //经纬度信息
								lat: start.latitude,
								lng: start.longitude
							},
							poiId: "" //POI信息 String 可通过官方接口获取[推荐]或文档
						},
						end: { //终点
							/**Poi支持传入经纬度和PoiID，PoiiD优先级更高，使用Poiid算路，导航终点会更合理 （建议根据）**/
							poiId: "",
							name: end.name,
							coordinate: {
								lat: end.latitude,
								lng: end.longitude
							}
						},
						waysPoiIds: [],
						navi: false, //导航或路线 boolean 取值true/false, 对应：直接导航/路线
						trafficEnabled: true, //交通路况 boolean 取值true/false
						naviType: 0, //导航类型 int 0 驾车/货车 1 步行 2 骑行 3 摩托车
						naviMode: 1, //设置直接导航模式（仅在使用组件直接导航（不调起算路页面）时生效） int 1-实时导航 2-模拟导航
						multipleRouteNaviMode: false, //设置多路线导航模式(导航中拥有若干条备选路线供用户选择), 或单路线导航模式(默认模式). boolean 取值true/false
						routeStrategy: 10, //设置组件规划路线的策略 int 取值 0-20  参考https://lbs.amap.com/api/android-navi-sdk/guide/route-plan/drive-route-plan 默认：速度优先+躲避拥堵+距离较短
						showCrossImage: false, // 设置驾车导航时是否显示路口放大图 boolean
						broadcastMode: 1, // 设置播报模式 int 1-简洁播报 2-详细播报 3-静音模式
						dayAndNightMode: 0 // 设置导航页面昼夜模式 int 0-自动切换 1-白天 2-夜间
					},
					(ret) => {
						console.log("啥情况");
						console.log(JSON.stringify(ret));
					}
				);
			},
		} // end methods
	}
</script>
	
<style>
	.item {
		font-size: 28rpx;
		padding: 20rpx;
		height: 50rpx;
		margin-bottom: 40rpx;
	}
	
	.title {
		margin-right: 40rpx;
		font-size: 18px;
	}
	
	.uni-col {
		font-size: 16px;
	}
	
	.container {
		overflow: hidden;
		background-color: #e3e3e3; 
	}
	
	.custom-cover {
		flex: 1;
		flex-direction: row;
		position: relative;
	}

	.card-actions {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		height: 45px;
		border-top: 1px #eee solid;
	}
	
	.card-actions-item {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	
	.card-actions-item-text {
		font-size: 14px;
		color: #666;
		margin-left: 5px;
	}
	
	.no-border {
		border-width: 0;
	}
</style>
