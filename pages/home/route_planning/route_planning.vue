<template>
	<view class="content">
		<map name="mapInRoutePlanning"
		style="width: 750rpx;height: 750rpx;" 
		:longitude="longitude" 
		:latitude="latitude" 
		:scale="scale"
		:markers="markers" 
		:include-points="includePoints"
		:show-compass="true" 
		:show-location="true"
		:polyline="polyline">
		</map>

		<view class="item" @click="chooseAddress(1)">
			<text class="title">请选择出发地</text>
		</view>
		<view class="item">
			<text class="color">{{address1.name}}</text>
		</view>
		<view class="item" @click="chooseAddress(2)">
			<text class="title">请选择目的地</text>
			<text>longitude:{{lng}}</text>
			<text>latitude:{{lat}}</text>
		</view>
		<view class="item">
			<text class="color">{{address2.name}}</text>
		</view>
		<view class="item" @click="getList()">
			<text class="title">路径规划</text>
		</view>
		<view class="item">
			<text class="color">{{book.name}}</text>
		</view>
		<view class="item">
			<button @click="startNavigation">开始导航</button>
		</view>
	</view>
</template>

<script>
	const globalEvent = uni.requireNativePlugin('globalEvent');
	const modal = uni.requireNativePlugin('modal');
	const aMapNavi = uni.requireNativePlugin('FUN-AMapNavi-mini'); //注意完整版和精简版ID名称
	
	export default {
		data() {
			return {
				longitude: '', //经度
				latitude: '', //纬度
				scale: 16, //缩放级别
				markers: [],//标记点
				includePoints: [],
				address1: {}, //出发地
				address2: {}, //目的地
				polyline: [],
				book: {} ,// 测试后端接口
				lng:null,
				lat:null,
			}
		},
		onLoad(option) {
			if(option.curOrder) {
				const curOrder = JSON.parse(decodeURIComponent(option.curOrder));
				console.log("curOrder:",curOrder);
				this.initMap(curOrder);
			} else {
				this.initMap(null);
			}
			
		},
		methods: {
			// 设置标记
			setMarker(name, longitude, latitude) {
				let marker = {
					id: 1,
					latitude: latitude,
					longitude: longitude,
					iconPath: '/static/logo.png',
					title: name,
					callout: {
						content: name,
						color: '#ffffff',
						fontSize: '14',
						display: 'ALWAYS',
						bgColor: '#FF6F1E',
						padding: '10',
						textAlign: 'center',
						borderRadius: '15'
					}
				}
				return marker;
			},
			
			// 设置地址
			setAddress(name, longitude, latitude) {
				return {
					name: name,
					latitude: latitude,
					longitude: longitude
				}
			},
			
			// 初始化地图，
			initMap(curOrder) {
				if(curOrder) {
					this.markers[0] = this.setMarker(curOrder.origin.name, curOrder.origin.longitude, curOrder.origin.latitude);
					this.markers[1] = this.setMarker(curOrder.destination.name, curOrder.destination.longitude, curOrder.destination.latitude);
					this.address1 = this.setAddress(curOrder.origin.name, curOrder.origin.longitude, curOrder.origin.latitude);
					this.address2 = this.setAddress(curOrder.destination.name, curOrder.destination.longitude, curOrder.destination.latitude);
					
					this.getDriverLine();
				} else { 
				// 从导航助手进导航界面
					let that = this;
					uni.getLocation({
						type: 'gcj02',
						geocode:true,
						success: function (res) {
							console.log(JSON.stringify(res))
							that.latitude = res.latitude;
							that.longitude = res.longitude;
							
							let marker = that.setMarker(res.address.poiName, res.longitude, res.latitude);
							
							that.markers[0] = marker;
							that.address1 = marker;
						},
						fail:function(err) {
							console.log(err)
						},
					});
				} // end if
			},
			
			// 选择起点或终点
			chooseAddress(type) {
				uni.chooseLocation({
					success: res => {
						console.log(res);
						if (type == 1) {
							this.longitude = res.longitude;
							this.latitude = res.latitude;
							this.lat = res.latitude;
							this.lng = res.longitude;
							this.markers[0] = this.setMarker(res.name, res.longitude, res.latitude);
							this.markers[0].id = 1;
							this.address1 = this.setAddress(res.name, res.longitude, res.latitude);
							
							if(this.markers.length == 2)
								this.getDriverLine();
						} else {
							this.longitude = res.longitude;
							this.latitude = res.latitude;
							this.markers[1] = this.setMarker(res.name, res.longitude, res.latitude);
							this.markers[1].id = 2;
							this.address2 = this.setAddress(res.name, res.longitude, res.latitude);
							
							this.getDriverLine()
						}
					}
				});
			},
			
			// 路线规划
			getDriverLine() {
				console.log("getDriverLine");
				const that = this
				const key = '3e0c915dbcafb5f4e6c7b8834241ea14'
				const origin = `${that.address1.longitude},${that.address1.latitude}`
				const destination = `${that.address2.longitude},${that.address2.latitude}`
				uni.request({
					url: `https://restapi.amap.com/v3/direction/driving?origin=${origin}&destination=${destination}&key=${key}`,
					success: (res) => {
						console.log(res);
					    const data = res.data.route
					    var points = []
					    points.push({
						    longitude: that.address1.longitude,
						    latitude: that.address1.latitude
					    })
						if (data.paths && data.paths[0] && data.paths[0].steps) {
							var steps = data.paths[0].steps;
							for (var i = 0; i < steps.length; i++) {
							  //将每一步的数据放到points数组中
							    var poLen = steps[i].polyline.split(";")
							    for (var j = 0; j < poLen.length; j++) {
									points.push({
										longitude: parseFloat(poLen[j].split(",")[0]),
										latitude: parseFloat(poLen[j].split(",")[1]),
									})
								}
							}
						}
						points.push({
							longitude: that.address2.longitude,
							latitude: that.address2.latitude
						})
						console.log("points:",points);
						that.polyline = [{
							points: points,
							color: "#0091ff",
							width: 6,
						}]
						  
						that.mapZoom();
					}
				}) // end request
			}, // end getDriverLine
			
			// 测试 发送request请求
			getList() {
				let that = this;
				console.log("getList:");
			    uni.request({
			         url: 'http://10.128.194.56:8080/book',
			         success: (res) => {
			            console.log("res=",res);
						that.book = res.data;
			        }
			    });
				
			}, //end getList
			
			// 地图缩放
			mapZoom() {
				let that = this;
				let centralPoint = [];
				
				centralPoint[0] = (that.address1.latitude + that.address2.latitude) / 2;
				centralPoint[1] = (that.address1.longitude + that.address2.longitude) / 2;
				that.latitude = centralPoint[0];
				that.longitude = centralPoint[1];
				var EARTH_RADIUS = 6378137.0;
				var PI = Math.PI;
				
				function getRad(d) {
					return d * PI / 180.0;
				}
				
				let distance = {
					getGreatCircle: function (coordinate1, coordinate2) {
						var lat1 = coordinate1[0] //纬度
						var lat2 = coordinate2[0]
						var lng1 = coordinate1[1]
						var lng2 = coordinate2[1]
						
						var radLat1 = getRad(lat1);
						var radLat2 = getRad(lat2);
										
						var a = radLat1 - radLat2;
						var b = getRad(lng1) - getRad(lng2);
						
						var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b/2), 2)));
						s = s* EARTH_RADIUS;
						s = Math.round(s*10000) / 10000.0;
						
						return s;
					}
				}
				
				let newLocation = []
				newLocation[0] = that.address1.latitude
				newLocation[1] = that.address1.longitude
				
				let dis = distance.getGreatCircle(centralPoint, newLocation)
				dis = dis /1000
				console.log("dis:",dis);
				
				let surface = [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.1, 0.05, 0.02]
				
				for(let i in surface) {
					if(dis > surface[i]) {
						that.scale = 5 + Number(i);
						break;
					}
				}
			},
		
			// 开始导航
			startNavigation() {
				// uni.navigateTo({
				// 	url: 'navigation?markers='+encodeURIComponent(JSON.stringify(this.markers)),
				// 	complete(e) {
				// 		console.log(e);
				// 	}
				// })
				this.showRoute(this.address1, this.address2);
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
						navi: true, //导航或路线 boolean 取值true/false, 对应：直接导航/路线
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
		}, // end methods
		
	}
</script>

<style>
	.item {
		font-size: 28rpx;
		padding: 20rpx;
		height: 40rpx;
	}
	.title {
		margin-right: 40rpx;
	}
	.color {
		color: red;
	}
</style>
