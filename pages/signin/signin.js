// pages/signin/signin.js
var app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isActionId: '',
		isCellNull: 0,
		isConfirm: 0,
        isIPX: app.globalData.isIPX ? true : false,
        isUserInfo:false,
        isSessionInfo: false
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
			var t = setInterval(function () {
				if (app.globalData.wechatOpenId) {
					wx.request({
						url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetUserSessionByQRCode',
						method: 'POST',
						data: {
							StaffWeChatOpenId: app.globalData.wechatOpenId,
							ActionIds: options.actionId
						},
						success: function (res) {
							console.log(res.data)
                            if(!res.data.IsError){
                                if(res.data.Data){
                                    var res = res.data.Data
                                    that.setData({
                                        UserId: res.UserProfile.UserId,
                                        userInfo: res.UserProfile.Profile
                                    });
                                    if (res.Sessions) {
                                        var arr = res.Sessions;
                                        app.timeFormat(arr);
                                        that.setData({
                                            sessionInfo: arr,
                                        });
                                    }else{
                                        that.setData({
                                            isSessionInfo: true
                                        })
                                    }
                                }else{
                                    that.setData({
                                        isUserInfo:true,
                                        isSessionInfo: true
                                    })
                                }
                                
                            }
						}
					});
					clearInterval(t);
				}
			}, 500);

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
        if (that.data.isCellNull == 1){
            wx.request({
                url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetUserSessionByManual',
                method: 'POST',
                data: {
                    StaffWeChatOpenId: app.globalData.wechatOpenId,
                    UserCellPhone: this.data.cellPhone
                },
                success: function (res) {
                    that.setData({
                        isActionId: true
                    })
                    console.log(res.data.Data)
                    var res = res.data.Data
                    var arr = res.Sessions;
                    app.timeFormat(arr);
                    console.log(arr)
                    that.setData({
                        sessionInfo: arr,
                        UserId: res.UserProfile.UserId,
                        userInfo: res.UserProfile.Profile
                    });
                    // console.log(that.options)
                }
            })
        }
		
	},
	//确认签到
	signInConfirm: function () {
		var that = this;
        if (that.data.isConfirm == 1){
            console.log(that.data)
            wx.request({
                url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/SignIn',
                method: 'POST',
                data: {
                    UserId: that.data.UserId,
                    EventId: that.data.sessionInfo[0].EventId,
                    SessionId: that.data.sessionIds,
                    JsonData: "string"
                },
                success: function (res) {
                    if (!res.IsError) {
                        wx.showModal({
                            title: '签到成功',
                            content: '点击确定返回首页',
                            showCancel: false,
                            success: function (res) {
                                if (res.confirm) {
                                    // console.log(res);
                                    wx.redirectTo({
                                        url: '../index/index',
                                    })
                                } else if (res.cancel) {

                                }
                            }
                        });
                    }
                }
            })
        }else{
            wx.showModal({
                title: '请选择签到的场次',
                content: '',
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