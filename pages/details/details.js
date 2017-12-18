// pages/details/details.js
var QQMapWX = require('../../assets/plugins/qqmap-wx-jssdk.min.js');
var qqmapsdk;

Page({
	data: {
		markers: {},
		latitude: '',
		longitude: ''
	},
	gotoPageQR: function (event) {
		//console.log(event.currentTarget);
		wx.navigateTo({
			url: '../qr/qr?eventId=' + event.currentTarget.dataset.eventId + '&sessionId=' + event.currentTarget.dataset.sessionId
		})
	},
	onLoad: function (options) {
		var that = this;
		qqmapsdk = new QQMapWX({
			key: '6OQBZ-6OORX-HVT4X-76LIY-QGA73-3DF5R'
		});
		wx.request({
			url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetEvent',
			data: {
				eventId: options.eventId
			},
			header: {
				'content-type': 'application/json'
			},
			success: function (result) {
				//console.log(result);
				that.setData({
					eventName: result.data.Data.Name,
					eventDatetime: result.data.Data.EventWhen,
					eventVenue: result.data.Data.EventWhere,
					eventIntro: result.data.Data.Brief,
					eventBackground: result.data.Data.BackgroundUrl,
					eventId: options.eventId,
					sessionId: options.sessionId
				});

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