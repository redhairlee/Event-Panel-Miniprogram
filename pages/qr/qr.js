// pages/qr/qr.js
Page({
	data: {

	},
	onLoad: function (options) {
		var that = this;
		var eventId = options.eventId, sessionId = options.sessionId, userId;
		userId = wx.getStorageSync('epUserId')
		wx.request({
			url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetEventAction',
			method: 'POST',
			data: {
				EventId: eventId,
				SessionId: sessionId,
				UserId: userId,
				ActionType: 0
			},
			success: function (res) {
				console.log(JSON.parse(res.data.Data.JsonData));
				var jsonQRCodeURL = JSON.parse(res.data.Data.JsonData);
				that.setData({
					qrCodeURL: jsonQRCodeURL.QRCodeUrl
				});
			}
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
			}
		})
	},
	gotoPageDetails: function () {
		wx.navigateBack({});
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