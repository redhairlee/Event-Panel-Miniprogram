//index.js
//获取应用实例
var app = getApp();
Page({
	data: {
		imgUrls: [
			'https://timgsa.baidu.com/timg?image&quality=80&size=b10000_10000&sec=1512939607&di=6a4e5f33b292caa2498650058d4fd347&src=http://img.mshishang.com/pics/2015/0916/20150916100922709.jpg',
			'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1512949773497&di=795739d140b6969fdcd9eb923ef5feb2&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20150914%2Fmp31820683_1442236704583_7.jpeg'
		],
		indicatorDots: true,
		autoplay: true,
		interval: 5000,
		duration: 1000
	},
	//事件处理函数
	gotoPageList: function () {
		wx.navigateTo({
			url: '../list/list?category=signin'
		})
	},
	gotoPageUser: function () {
		wx.navigateTo({
			url: '../user/user'
		})
	},
	gotoDetails: function (event) {
		console.log(event.currentTarget.dataset);
		wx.navigateTo({
			url: '../details/details?eventId=' + event.currentTarget.dataset.eventId + '&sessionId=' + event.currentTarget.dataset.sessionId
		})
	},
	onLoad: function () {
		var that = this;
		wx.request({
			url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetMyEventSessions',
			data: {
				weChatOpenId: getApp().globalData.wechatOpenId
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				console.log(res.data.Data.EventSessionsNeedToJoin.length);

				getApp().globalData.arrayEventsResult = res.data.Data;
				that.setData({
					arrayEvents: res.data.Data.EventSessionsNeedToJoin
				});
			}
		});

	}
})
