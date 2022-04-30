<template>
	<view>
		<!-- <button @click="exitNavigation">退出导航</button>
		<button>异常上报</button> -->
		<button @tap="showRoute(0,false)">开启导航（路线）</button>
	</view>
</template>

<script>
	const globalEvent = uni.requireNativePlugin('globalEvent');
	const modal = uni.requireNativePlugin('modal');
	const aMapNavi = uni.requireNativePlugin('FUN-AMapNavi-mini'); //注意完整版和精简版ID名称
	
	export default {
		data() {
			return {
				
			}
		},
		onLoad(option) {
			if(option.markers){
				const markers = JSON.parse(decodeURIComponent(option.markers));
				console.log(markers);
			}
			
			globalEvent.addEventListener('FunNaviInfoCallback', function(result) {
				console.log('FunNaviInfoCallback:' + JSON.stringify(result));
				try {
					modal.toast({
						message: "FunNaviInfoCallback:: " + JSON.stringify(result),
						duration: 2
					});
				} catch (e) {
					// error
					console.log(e);
				}
			});
		},
		
		onBackPress(option) {
			if (option.from == 'navigateBack') {
				return false;
			}
			//console.log("currentPages:",getCurrentPages());
			uni.showModal({
				title: '提示',
				content: '是否退出导航？',
				success: function(res) {
					if (res.confirm) {
						// 退出当前应用，改方法只在App中生效
						uni.navigateBack({
							delta: 1
						})
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
			return true;
		},
		
		methods: {
			showRoute(naviType, navi) {
				// 导航/路线规划
				console.log("eeee");
				aMapNavi.showRoute({
						theme: 0, ////主题，默认0蓝，取之范围0-2分别表示蓝，浅，暗 
						// carInfo: {//设置车辆信息，进行尾号限行与货车导航。没有在高德申请货车路径规划(收费接口)的请不要使用此参数
						// 	carNumber: "京C123456", // 设置车辆的车牌号码 String  如:京DFZ239,京ABZ239
						// 	restriction: true, //设置是否躲避车辆限行
						// 	carType: "1", //设置车辆类型 String  0-燃油客车，1-燃油货车，2-纯电动客车，3-纯电动货车，4-插电式混动汽车，5-插电式混动货车，11-摩托车
						// 	vehicleHeight: "3.56", //设置货车的高度  String   单位：米，mCarType = 1时候生效，取值[0-25.5] 如:1.8，1.5等等。默认为1.6米
						// 	vehicleLoad: "25.99", //设置货车的总重，即车重+核定载重  String   单位：吨，mCarType = 1时候生效，取值[0-6553.5]
						// 	vehicleLoadSwitch: true, //设置货车重量是否参与算路  boolean   true-重量会参与算路；false-重量不会参与算路。默认为false
						// 	vehicleWidth: "2.5", //设置货车的最大宽度  String   单位：米，mCarType = 1时候生效，取值[0-25.5] 如:1.8，1.5等等。默认2.5米
						// 	vehicleLength: "7.3", //设置货车的最大长度  String   单位：米，mCarType = 1时候生效，取值[0-25] 如:1.8，1.5等等，默认6米
						// 	vehicleSize: "4", //设置货车的大小，默认为2  String   1-微型货车 2-轻型/小型货车 3-中型货车 4-重型货车
						// 	vehicleAxis: "6", ////设置货车的轴数，mCarType = 1时候生效，取值[0-255]，默认为2
						// 	vehicleWeight: "20", //设置货车的核定载重  String   单位：吨，mCarType = 1时候生效，取值[0-6553.5]
						// },
						start: navi ? {} : { //起点 
							name: "黄河口生态旅游区", // 地名 String
							coordinate: { //经纬度信息
								lat: 37.79749,
								lng: 119.064246
							},
							poiId: "" //POI信息 String 可通过官方接口获取[推荐]或文档
						},
						end: { //终点
							/**Poi支持传入经纬度和PoiID，PoiiD优先级更高，使用Poiid算路，导航终点会更合理 （建议根据）**/
							poiId: "",
							name: "乌兰察布市政府",
							coordinate: {
								lat: 40.994469,
								lng: 113.132142
							}
						},
						waysPoiIds: [{ //途经点，最多3个
							coordinate: {
								lat: 39.941823,
								lng: 116.426319
							},
							name: "北京大学",
							poiId: "B000A816R6"
						}],
						navi: navi, //导航或路线 boolean 取值true/false, 对应：直接导航/路线
						trafficEnabled: true, //交通路况 boolean 取值true/false
						naviType: naviType, //导航类型 int 0 驾车/货车 1 步行 2 骑行 3 摩托车
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
			exitRoute() {
				modal.toast({
					message: "10秒后自动退出导航",
					duration: 2
				});
				setTimeout(function() {
					modal.toast({
						message: "定时自动退出导航",
						duration: 2
					});
					aMapNavi.exitRoute((ret) => {
						console.log(JSON.stringify(ret));
					});
				}, 10 * 1000)
			},
		}
	}
</script>

<style>
</style>
