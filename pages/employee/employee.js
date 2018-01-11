// pages/employee/employee.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isConfirm: 1,
        isIPX: app.globalData.isIPX ? true : false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
            EventId: options.eventId,
            SessionId: options.sessionId,
        })
        wx.getStorage({
            key: 'weChatUserInfo',
            success: function (res) {
                console.log(res);
                that.setData({
                    WeChatNickName: res.data.nickName,
                    AvtarUrl: res.data.avatarUrl
                })
            },
        })
    },
    setStuff: function () {
        var that = this;
        wx.request({
            url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/SetStaff',
            method: "POST",
            data: {
                EventId: that.data.EventId,
                SessionId: that.data.SessionId,
                Staff: {
                    WeChatOpenId: app.globalData.wechatOpenId,
                    WeChatNickName: that.data.WeChatNickName,
                    AvtarUrl: that.data.AvtarUrl,
                    Name: that.data.staffName,
                    CellPhone: that.data.telNum
                }
            },
            success: function (res) {
                console.log(res);
                if (!res.data.IsError) {
                    console.log('Success');
                    wx.setStorage({
                        key: "epStaffInfo",
                        data: {
                            sessionId: that.data.SessionId
                        }
                    });
                    wx.redirectTo({
                        url: '../index/index'
                    });
                }
            }
        })
    },
    inputValue: function (e) {
        var that = this;
        app.inputValue(e, that)
        // console.log(that.data)
        // console.log(this.data.isTelNull)
    },
    inputName: function (e) {
        var that = this
        that.setData({
            staffName: e.detail.value
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