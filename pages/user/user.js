//index.js
//获取应用实例
var app = getApp()
Page({
	data: {
		userInfo: {}
	},
	//事件处理函数
	gotoListSignin: function () {
		wx.navigateTo({
			url: '../list/list?category=signin'
		})
	},
	gotoListRate: function () {
		wx.navigateTo({
			url: '../list/list?category=rate'
		})
	},
	onLoad: function () {
		var that = this;
		wx.getStorage({
			key: 'loginData',
			success: function (res) { }
		});
		wx.request({
			url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetUserProfileByWeChatOpenId',
			data: {
				weChatOpenId: app.globalData.wechatOpenId
			},
			success: function (result) {
				console.log(result.data);
				that.setData({
					userNickname: result.data.Data.Profile.ChineseName,
					userPhone: result.data.Data.Profile.CellPhone,
					userCompany: result.data.Data.Profile.Company,
					userTitle: result.data.Data.Profile.Title
				})
			}
		})
	}
})
