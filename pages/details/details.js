// pages/details/details.js
var QQMapWX = require('../../assets/plugins/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var QR = require("../../utils/qrcode.js");
var app = getApp()

Page({
	data: {
		markers: {},
		latitude: '',
		longitude: '',
		canvasHidden: false,
		maskHidden: true,
		imagePath: '',
		isShow: false,
		isBlur: false
	},
	gotoPageQR: function (event) {
		var that = this;
		this.setData({
			isShow: true,
			isBlur: true
		})
		// console.log(this.data)
		// wx.getStorage({
		//     key: 'epUserInfo',
		//     success: function (res) {
		//         console.log(res);
		//         wx.request({
		//             url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetEventAction',
		//             method: 'POST',
		//             data: {
		//                 EventId: that.data.eventId,
		//                 SessionId: that.data.sessionId,
		//                 UserId: res.data.userId,
		//                 ActionType: 0
		//             },
		//             success: function (res) {
		//                 console.log(res)
		//                 var size = that.setCanvasSize();//动态设置画布大小

		//                 that.createQrCode(res.data.Data.ActionId.toString(), "mycanvas", size.w, size.h);
		//             }
		//         })
		//     },
		// })
	},
	onLoad: function (options) {
		var that = this;
		that.setData({
			eventId: options.eventId,
			sessionId: options.sessionId
		});
		qqmapsdk = new QQMapWX({
			key: '6OQBZ-6OORX-HVT4X-76LIY-QGA73-3DF5R'
		});
		wx.getStorage({
			key: 'epUserInfo',
			success: function (res) {
				console.log(res);
				wx.request({
					url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetSignInUserProfile',
					method: 'POST',
					data: {
						EventId: that.data.eventId,
						SessionId: that.data.sessionId,
						UserId: res.data.userId,
						JsonData: "string"
					},
					success: function (res) {
						console.log(res.data.Data)
						that.setData({
							SeatNumber: res.data.Data.Profile.SeatNumber,
                            Gift: res.data.Data.Profile.Gift
						})
					}
				});
				wx.request({
					url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetEventAction',
					method: 'POST',
					data: {
						EventId: that.data.eventId,
						SessionId: that.data.sessionId,
						UserId: res.data.userId,
						ActionType: 0
					},
					success: function (res) {
						console.log(res)
						var size = that.setCanvasSize();//动态设置画布大小

						that.createQrCode(res.data.Data.ActionId.toString(), "mycanvas", size.w, size.h);
					}
				});
			},
		})

		wx.request({
			url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetEvent',
			data: {
				eventId: options.eventId
			},
			header: {
				'content-type': 'application/json'
			},
			success: function (result) {
				console.log(result);
				that.setData({
					eventName: result.data.Data.Name,
					eventDatetime: result.data.Data.EventWhen,
					eventVenue: result.data.Data.EventWhere,
					eventIntro: result.data.Data.Brief,
					eventImage: result.data.Data.ListUrl,
					eventId: options.eventId,
					sessionId: options.sessionId
				});
				console.log(that.data)
				qqmapsdk.geocoder({
					address: result.data.Data.EventWhere,
					success: function (res) {
						//console.log(res.result.location);
						that.setData({
							longitude: res.result.location.lng,
							latitude: res.result.location.lat,
							markers: [{
								latitude: res.result.location.lat,
								longitude: res.result.location.lng,
								title: result.data.Data.EventWhere
							}]
						});
					},
					fail: function (res) {
						//console.log(res);
					},
					complete: function (res) {
						//console.log(res);
					}
				});

			}
		})
		console.log(that.data);
		if (options.showQRCode) {
			that.gotoPageQR();
		}

	},
	hideQRbox: function (event) {
		var that = this
		app.hideQRbox(event, that)
	},
	gotoDestination: function () {
		var that = this;
		wx.getLocation({
			type: 'gcj02', //返回可以用于wx.openLocation的经纬度
			success: function (res) {
				// var latitude = res.latitude
				// var longitude = res.longitude
				wx.openLocation({
					latitude: that.data.latitude,
					longitude: that.data.longitude,
					scale: 28,
					name: that.data.eventName,
					address: that.data.eventVenue
				})
			}
		})
	},
	//适配不同屏幕大小的canvas
	setCanvasSize: function () {
		return app.setCanvasSize()
	},
	createQrCode: function (url, canvasId, cavW, cavH) {
		var that = this
		//调用插件中的draw方法，绘制二维码图片
		app.createQrCode(url, canvasId, cavW, cavH, that)

	},
	//获取临时缓存照片路径，存入data中
	canvasToTempImage: function () {
		var that = this;
		app.canvasToTempImage(that)
	},
	//点击图片进行预览，长按保存分享图片
	previewImg: function (e) {
		var that = this
		app.previewImg(e, that)
	},
	onReady: function () {
		// 页面渲染完成
	},
	onShow: function () {
		// 页面显示
	},
	onHide: function () {
		// 页面隐藏
	},
	onUnload: function () {
		// 页面关闭
	}
})