//app.js
var app = getApp();
App({
	onLaunch: function () {
		//调用API从本地缓存中获取数据
		var logs = wx.getStorageSync('logs') || []
		logs.unshift(Date.now())
		wx.setStorageSync('logs', logs)

		/*wx.checkSession({
			success: function () {
			
			},
			fail: function () {*/
		wx.login({
			success: function (res) {
				if (res.code) {
					wx.request({
						url: 'https://epadmin.rfistudios.com.cn/miniprogram/server.php',
						method: 'POST',
						data: {
							action: 'login',
							code: res.code
						},
						success: function (res) {
							console.log(res.data);
							wx.setStorage({
								key: "loginData",
								data: res.data
							});
							wx.getSetting({
								success(res) {
									if (!res.authSetting['scope.userInfo']) {
										wx.authorize({
											scope: 'scope.userInfo',
											success() {
												wx.getUserInfo({
													withCredentials: true,
													success: function (res) {
														console.log(res);
														var loginData = wx.getStorageSync('loginData');
														console.log(loginData);
														wx.request({
															url: 'https://epadmin.rfistudios.com.cn/miniprogram/server.php',
															method: 'POST',
															data: {
																action: 'userinfo',
																sessionKey: loginData.session_key,
																encryptedData: res.encryptedData,
																iv: res.iv 
															},
															success: function (res) {
																console.log(res);
																wx.setStorage({
																	key: "userInfo",
																	data: res
																});
															}
														});
													}
												})
											}
										})
									}
								}
							});
							wx.request({
								url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetUserProfileByWeChatOpenId',
								data: {
									weChatOpenId: 'oj-L2vy5aocCOwtfWY_EXOlONuxM'
								},
								success: function (res) {
									wx.setStorage({
										key: "epUserId",
										data: res.data.Data.UserId
									});
								}
							})
						}
					})
				} else {
					console.log('获取用户登录态失败！' + res.errMsg)
				}
			}
		});

		/*}
	})*/
	},
	globalData: {
		wechatOpenId: 'oj-L2vy5aocCOwtfWY_EXOlONuxM',
		arrayEventsResult: []
	}
})