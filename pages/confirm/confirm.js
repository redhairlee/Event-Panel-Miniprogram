// pages/confirm/confirm.js
var app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isConfirm: 1,
		canvasHidden: false,
		maskHidden: true,
		imagePath: '',
		isShow: false,
		isBlur: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */

	onLoad: function (options) {
		var that = this;
		// console.log(options)
		that.setData({
			options: options
		})
		// console.log(that.data);
		//Event信息获取
		wx.request({
			url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetEvent',
			data: {
				eventId: options.eventId
			},
			success: function (res) {
                console.log(res)
				that.setData({
					eventId: options.eventId,
					arrayEventsInfo: res.data.Data,
					openId: app.globalData.wechatOpenId,
				});
			}
		})
		wx.getStorage({
			key: 'epUserInfo',
			success: function (res) {
				console.log(res)
				that.setData({
					userInfo: res.data.userInfo,
					userId: res.data.userId
				})
			},
		})
		//个人sessions获取
		setTimeout(function () {
			// console.log(that.data.userId)
			wx.request({
				url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetSessionsByRSVP',
				method: 'POST',
				data: {
					UserId: that.data.userId,
					EventId: options.eventId
				},
				success: function (res) {
					console.log(res.data.Data)
					var arr = res.data.Data;
					// var startTime = []
                    app.timeFormat(arr);
					that.setData({
						sessionInfo: arr
						// startTime: startTime
					});
				}

			})
		}, 70);
		// console.log(that.data)
	},
	//获取输入的手机号码
	inputValue: function (e) {
		var that = this;
		app.inputValue(e, that)
		// console.log(this.data.isTelNull)
	},
	//复选框选中值
	checkboxChange: function (e) {
		// console.log(this.data.telNum)
		this.setData({
			sessionIds: [
                e.detail.value
            ],
		})
		var isConfirm = this.data.sessionIds.length > 0 ? 0 : 1
		this.setData({
			isConfirm: isConfirm,
		})
		// console.log(this.data.sessionIds)
	},
	//根据手机号码获取userInfo
	sighupTap: function () {
		// console.log(this);
		var that = this;
		wx.request({
			url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetUserProfileByCellPhone',
			data: {
				cellPhone: this.data.telNum
			},
			success: function (res) {
				console.log(res)
				that.setData({
					userInfo: res.data.Data.Profile,
					userId: res.data.Data.UserId
				});
				wx.setStorage({
					key: 'epUserInfo',
					data: {
						userInfo: that.data.userInfo,
						userId: that.data.userId
					},
				});
				wx.request({
					url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetSessionsByRSVP',
					method: 'POST',
					data: {
						UserId: that.data.userId,
						EventId: that.data.options.eventId
					},
					success: function (res) {
						console.log(res.data.Data)
						var arr = res.data.Data;
                        app.timeFormat(arr);
						that.setData({
							sessionInfo: arr,
							isConfirm: 1
						});
					}

				})
			}

		})

		// console.log(this.data)
	},
	//确认报名
	confirmInfo: function () {
		// console.log(this);
		var that = this;
        /*this.setData({
            isShow: true,
            isBlur: true
        })*/
		wx.request({
			url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/SignUp',
			method: 'POST',
			data: {
				UserId: that.data.userId,
				WeChatOpenId: that.data.openId,
				EventId: that.data.eventId,
				SessionIds: that.data.sessionIds
			},
			success: function (res) {
				console.log(res);
				wx.redirectTo({
					url: '../details/details?eventId=' + that.data.eventId + '&sessionId=' + that.data.sessionIds + '&showQRCode=true'
				})
			}
		});
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