// pages/confirm/confirm.js
var app = getApp();
var Promisify = require('../../utils/util.js');
var request = Promisify.wxPromisify(wx.request);//ajax请求
Page({

	/**
	 * 页面的初始数据
	 */
    data: {
        isConfirm: 0,
        canvasHidden: false,
        maskHidden: true,
        imagePath: '',
        isShow: false,
        isBlur: false,
        nullSessions: false,
        isIPX: app.globalData.isIPX ? true : false,
        language: app.globalData.language
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
        wx.showLoading({
            title: '加载中',
        })
        // console.log(that.data);
        
        //Event信息获取
        request({
            url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetEvent',
            data: {
                eventId: options.eventId
            },
        }).then(res=>{
            if (!res.data.IsError) {
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
                });
                request({
                    url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetSessionsByRSVP',
                    method: 'POST',
                    data: {
                        UserId: res.data.userId,
                        EventId: options.eventId
                    },
                }).then(res=>{
                    wx.hideLoading();
                    // console.log(res.data.Data.length)
                    if (!res.data.IsError) {
                        console.log(res)
                        if (res.data.Data.length > 0) {
                            var arr = res.data.Data;
                            console.log(arr)
                            app.timeFormat(arr);
                            wx.getStorage({
                                key: 'epUserConfirmedSessions',
                                success: function (res) {
                                    for (var i = 0; i < arr.length; i++) {
                                        var sessionId = arr[i].SessionId;
                                        for (var j = 0; j < res.data.length; j++) {
                                            if (sessionId == res.data[j]) {
                                                wx.redirectTo({
                                                    url: '../details/details?eventId=' + options.eventId + '&sessionId=' + sessionId + '&showQRCode=true'
                                                });
                                            }
                                        }
                                    }
                                },
                                fail: function () { }
                            })

                            that.setData({
                                sessionInfo: arr
                                // startTime: startTime
                            });
                        } else {
                            that.setData({
                                nullSessions: true
                            });
                        }

                    }
                })
            },
        })
    },
    //获取输入的手机号码
    inputValue: function (e) {
        var that = this;
        app.inputValue(e, that)
    },
    //复选框选中值
    checkboxChange: function (e) {
        console.log(e.detail.value)
        this.setData({
            sessionIds: [
                e.detail.value
            ],
        })
        this.setData({
            isConfirm: 1,
        })
    },
    //根据手机号码获取userInfo
    sighupTap: function () {
        // console.log(this);
        var that = this;
        request({
            url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetUserProfileByCellPhone',
            data: {
                cellPhone: that.data.telNum
            },
        }).then(res=>{
            if (!res.data.IsError) {
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
                request({
                    url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetSessionsByRSVP',
                    method: 'POST',
                    data: {
                        UserId: that.data.userId,
                        EventId: that.data.options.eventId
                    },
                }).then(res=>{
                    if (!res.data.IsError) {
                        if (res.data.Data.length > 0) {
                            var arr = res.data.Data;
                            app.timeFormat(arr);
                            that.setData({
                                sessionInfo: arr,
                                isConfirm: 0
                            });
                        } else {
                            that.setData({
                                nullSessions: true
                            });
                        }
                    }
                })
            }
        })

        request({
            url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetUserProfileByCellPhone',
            data: {
                cellPhone: that.data.telNum
            },
        }).then(res=>{
            if (!res.data.IsError) {
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
                request({
                    url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetSessionsByRSVP',
                    method: 'POST',
                    data: {
                        UserId: that.data.userId,
                        EventId: that.data.options.eventId
                    },
                    
                }).then(res=>{
                    if (!res.data.IsError) {
                        if (res.data.Data.length > 0) {
                            var arr = res.data.Data;
                            app.timeFormat(arr);
                            that.setData({
                                sessionInfo: arr,
                                isConfirm: 0
                            });
                        } else {
                            that.setData({
                                nullSessions: true
                            });
                        }
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
        
        // console.log(that.data.sessionInfo)
        if (that.data.isConfirm == 1) {
            request({
                url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/SignUp',
                method: 'POST',
                data: {
                    UserId: that.data.userId,
                    WeChatOpenId: that.data.openId,
                    EventId: that.data.eventId,
                    SessionIds: that.data.sessionIds
                },
            }).then(res=>{
                console.log(res.data.IsError)
                if (!res.data.IsError) {
                    wx.setStorage({
                        key: 'epUserConfirmedSessions',
                        data: that.data.sessionIds,
                    })
                    wx.redirectTo({
                        url: '../details/details?eventId=' + that.data.eventId + '&sessionId=' + that.data.sessionIds + '&showQRCode=true'
                    });
                }
            })
        }else{
            wx.showModal({
                title: that.data.language.modal_confirm_1,
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