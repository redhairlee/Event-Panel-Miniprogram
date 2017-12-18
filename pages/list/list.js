// pages/list-signin/list-signin.js
Page({
	data: {

	},
	eventNavTap: function (e) {
		//console.log(e);
		this.setData({
			category: e.target.dataset.category,
			arrayEvents: getApp().globalData.arrayEventsResult
		});
		if (e.target.dataset.category == 'signin') {
			this.setData({
				arrayEvents: getApp().globalData.arrayEventsResult.EventSessionsNeedToJoin
			});
		} else if (e.target.dataset.category == 'rate') {
			this.setData({
				arrayEvents: getApp().globalData.arrayEventsResult.EventSessionsNeedToFeedBack
			});
		} else if (e.target.dataset.category == 'signed') {
			this.setData({
				arrayEvents: getApp().globalData.arrayEventsResult.EventSessionsHaveJoined
			});
		}
		//console.log(getApp().globalData.arrayEventsResult);
	},
	gotoDetails: function (event) {
		//console.log(event.currentTarget.dataset);
		wx.navigateTo({
			url: '../details/details?eventId=' + event.currentTarget.dataset.eventId + '&sessionId=' + event.currentTarget.dataset.sessionId
		})
	},
	onLoad: function (options) {
		var that = this;
		// 页面初始化 options为页面跳转所带来的参数
		wx.request({
			url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetMyEventSessions', //仅为示例，并非真实的接口地址
			data: {
				weChatOpenId: getApp().globalData.wechatOpenId
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				getApp().globalData.arrayEventsResult = res.data.Data;
				that.setData({
					arrayEvents: res.data.Data.EventSessionsNeedToJoin
				});
			}
		});
		that.setData({
			category: options.category
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