// pages/setup/setup.js
var app = getApp();
var Promisify = require('../../utils/util.js');
var request = Promisify.wxPromisify(wx.request);//ajax请求
Page({

    /**
     * 页面的初始数据
     */
    data: {
        array: ["女", "男"],
        isIPX: app.globalData.isIPX ? true : false,
        language: app.globalData.language
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        wx.getStorage({
            key: 'epUserInfo',
            success: function (res) {
                console.log(res)
                that.setData({
                    userId: res.data.userId,
                    userInfo: res.data.userInfo
                })
            },
            fail: function () {

            }
        });
        // console.log(getApp().globalData.wechatOpenId)
    },
    bindPickerChange: function (e) {
        this.setData({
            Sex: this.data.array[e.detail.value]
        })
        // this.data.userInfo.Sex = this.data.Sex
    },
    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        })
        // this.data.userInfo.Birthday = this.data.date
    },
    inputTelPhone: function (e) {
        this.data.userInfo.CellPhone = e.detail.value
    },
    inputName: function (e) {
        this.data.userInfo.ChineseName = e.detail.value
    },
    inputEnglishName: function (e) {
        this.data.userInfo.EnglishName = e.detail.value
    },
    inputEmail: function (e) {
        this.data.userInfo.Email = e.detail.value
    },
    inputCompany: function (e) {
        this.data.userInfo.Company = e.detail.value
    },
    inputTitle: function (e) {
        this.data.userInfo.Title = e.detail.value
    },
    setUp: function () {
        var that = this;
        console.log(that.data)
        request({
            url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/UpdateUserProfile',
            method: "POST",
            data: {

                UserId: that.data.userId,
                Profile: {
                    Birthday: that.data.date ? that.data.date : that.data.userInfo.Birthday,
                    CellPhone: that.data.userInfo.CellPhone,
                    ChineseName: that.data.userInfo.ChineseName,
                    Company: that.data.userInfo.Company,
                    Email: that.data.userInfo.Email,
                    EnglishName: that.data.userInfo.EnglishName,
                    Sex: that.data.Sex ? that.data.Sex : that.data.userInfo.Sex,
                    Title: that.data.userInfo.Title,
                    WeChatOpenId: app.globalData.wechatOpenId
                }

            },
        }).then(res=>{
            // console.log(res)
            if (!res.data.IsError) {
                request({
                    url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetUserProfileByWeChatOpenId',
                    data: {
                        weChatOpenId: app.globalData.wechatOpenId
                    },
                }).then(res=>{
                    var userInfo = res.data.Data.Profile;
                    var userId = res.data.Data.UserId;
                    wx.setStorage({
                        key: 'epUserInfo',
                        data: {
                            userInfo: userInfo,
                            userId: userId
                        },
                    })
                    wx.showModal({
                        title: that.data.language.modal_setup_1,
                        content: '',
                        confirmText: that.data.language.modal_confirmText,
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                wx.redirectTo({
                                    url: '../user/user'
                                })

                            } else if (res.cancel) {

                            }
                        }
                    });
                })
            }
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