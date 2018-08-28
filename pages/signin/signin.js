// pages/signin/signin.js
var app = getApp();
var Promisify = require('../../utils/util.js');
var request = Promisify.wxPromisify(wx.request);//ajax请求
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isActionId: '',
		isCellNull: 0,
		isConfirm: 0,
		isIPX: app.globalData.isIPX ? true : false,
		isUserInfo: false,
		isSessionInfo: false,
		language: app.globalData.language
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this;
		// wx.getStorage({
		// 	key: 'epUserInfo',
		// 	success: function (res) {
		// 		console.log(res)
		// 	},
		// })

		// console.log(options.actionId);
		if (options.actionId) {
			that.setData({
				ActionIds: options.actionId,
				isActionId: true
			});
			request({
				url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetUserSessionByQRCode',
				method: 'POST',
				data: {
					StaffWeChatOpenId: app.globalData.wechatOpenId,
					ActionIds: options.actionId
				},
			}).then(res => {
				console.log(res.data)
				if (!res.data.IsError) {
					if (res.data.Data) {
						var res = res.data.Data;

						that.setData({
							UserId: res.UserProfile.UserId,
							userInfo: res.UserProfile.Profile
						});
						if (!res.Sessions.length == 0) {
							var arr = res.Sessions;
							app.timeFormat(arr);
							for (var i = 0; i < arr.length; i++) {
								var index = i;

								request({
									url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetSignInUserProfile',
									method: 'POST',
									data: {
										EventId: arr[i].EventId,
										SessionId: arr[i].SessionId,
										UserId: res.UserProfile.UserId,
										JsonData: ''
									},
								}).then(res => {
									// console.log(res);
									if (res.data.Data.Profile) {
										var tempUserInfoComments = res.data.Data.Profile.Comments;
										var arrayComments = res.data.Data.Profile.Comments.split('|');
										arr[index].userInfoComments = '时间：' + arrayComments[5] + ' ' + arrayComments[4] + ' | 人数：' + arrayComments[6];
									};
									that.setData({
										sessionInfo: arr,
									});
								});

								request({
									url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetEventAction',
									method: 'POST',
									data: {
										EventId: arr[i].EventId,
										SessionId: arr[i].SessionId,
										UserId: res.UserProfile.UserId,
										ActionType: 1
									},
								}).then(res => {
									// console.log(res);
									if (res.data.Data) {
										arr[index].Signed = true;
									};
									that.setData({
										sessionInfo: arr,
									});
								});
								console.log(arr);
								// console.log(that.data.sessionInfo);                                
							}
						} else {
							that.setData({
								isSessionInfo: true
							})
						}
					} else {
						that.setData({
							isUserInfo: true,
							isSessionInfo: true
						})
					}

				}
			})

		}

		console.log(that.data)
		//   console.log(options)

	},
	//手机号码
	getCellPhone: function (e) {
		this.setData({
			cellPhone: e.detail.value
		})
		// var isCellNull = this.data.cellPhone ? 0 : 1
		this.setData({
			isCellNull: 1
		})
	},
	//身份验证
	userConfirm: function () {
		var that = this
		if (that.data.isCellNull == 1) {
			request({
				url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetUserSessionByManual',
				method: 'POST',
				data: {
					StaffWeChatOpenId: app.globalData.wechatOpenId,
					UserCellPhone: this.data.cellPhone
				},
			}).then(res => {
				that.setData({
					isActionId: true
				})
				console.log(res.data.Data)
				var res = res.data.Data
				var arr = res.Sessions;
				app.timeFormat(arr);
				console.log(arr);
				if (!res.Sessions.length == 0) {
					var arr = res.Sessions;
					app.timeFormat(arr);
					for (var i = 0; i < arr.length; i++) {
						var index = i;

						request({
							url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetSignInUserProfile',
							method: 'POST',
							data: {
								EventId: arr[i].EventId,
								SessionId: arr[i].SessionId,
								UserId: res.UserProfile.UserId,
								JsonData: ''
							},
						}).then(res => {
							// console.log(res);
							if (res.data.Data.Profile) {
								var tempUserInfoComments = res.data.Data.Profile.Comments;
								var arrayComments = res.data.Data.Profile.Comments.split('|');
								arr[index].userInfoComments = '时间：' + arrayComments[5] + ' ' + arrayComments[4] + ' | 人数：' + arrayComments[6];
							};
							that.setData({
								sessionInfo: arr,
							});
						});

						request({
							url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetEventAction',
							method: 'POST',
							data: {
								EventId: arr[i].EventId,
								SessionId: arr[i].SessionId,
								UserId: res.UserProfile.UserId,
								ActionType: 1
							},
						}).then(res => {
							// console.log(res);
							if (res.data.Data) {
								arr[index].Signed = true;
							};
							that.setData({
								sessionInfo: arr,
							});
						});
						console.log(arr);
						// console.log(that.data.sessionInfo);                                
					}
				} else {
					that.setData({
						isSessionInfo: true
					})
				}
				that.setData({
					sessionInfo: arr,
					UserId: res.UserProfile.UserId,
					userInfo: res.UserProfile.Profile
				});
			})
		}

	},
	//确认签到
	signInConfirm: function () {
		var that = this;
		if (that.data.isConfirm == 1) {
			console.log(that.data)
			request({
				url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/SignIn',
				method: 'POST',
				data: {
					UserId: that.data.UserId,
					EventId: that.data.sessionInfo[0].EventId,
					SessionId: that.data.sessionIds,
					JsonData: "string"
				},
			}).then(res => {
				if (!res.IsError) {
					wx.showModal({
						title: that.data.language.modal_signin_1,
						content: that.data.language.modal_signin_2,
						confirmText: that.data.language.modal_confirmText,
						showCancel: false,
						success: function (res) {
							if (res.confirm) {
								// console.log(res);
								// wx.redirectTo({
								//     url: '../index/index',
								// })
								wx.navigateBack({
									delta: 1
								})
							} else if (res.cancel) {

							}
						}
					});
				}
			})
		} else {
			wx.showModal({
				title: that.data.language.modal_signin_3,
				content: '',
				confirmText: that.data.language.modal_confirmText,
				showCancel: false,
				success: function (res) {
					if (res.confirm) {


					} else if (res.cancel) {

					}
				}
			});
		}

	},
	checkboxChange: function (e) {
		this.setData({
			sessionIds: e.detail.value,
		})
		// var isConfirm = this.data.sessionIds.length > 0 ? 0 : 1
		this.setData({
			isConfirm: 1,
		})
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})