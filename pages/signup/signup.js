// pages/signup/signup.js
var app = getApp();
var Promisify = require('../../utils/util.js');
var request = Promisify.wxPromisify(wx.request);//ajax请求
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIPX: app.globalData.isIPX ? true : false,
        language: app.globalData.language
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(options.eventId)
        var that = this;
        // wx.getStorage({
        //     key: 'epUserInfo',
        //     success: function (result) {
        //         console.log(result.data.userInfo)
        //         var res = result.data.userInfo;
        //         that.setData({
        //             CellPhone: res.CellPhone,
        //             ChineseName: res.ChineseName,
        //             Email: res.Email

        //         })
        //         console.log(that.data.Email)

        //     }
        // });
        wx.showLoading({
            title: '加载中',
        })
        var t = setInterval(function(){
            if (that.data.CellPhone) {
                wx.hideLoading();
                clearInterval(t);
            }
            wx.getStorage({
                key: 'epUserInfo',
                success: function (result) {
                    console.log(result.data.userInfo)
                    var res = result.data.userInfo;
                    that.setData({
                        CellPhone: res.CellPhone,
                        ChineseName: res.ChineseName,
                        Email: res.Email

                    })
                    console.log(that.data.Email)
                },
                fail: function () {
                    wx.hideLoading();
                    clearInterval(t);
                }
            });
        },100)
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
        
        request({
            url: 'https://epadmin.rfistudios.com.cn/api/Event/GetSessions',
            data: {
                eventId:options.eventId
            },
        }).then(res=>{
            console.log(res.data.Data);
            // console.log(res.data.Data[0].SignUpCount)
            var arr = res.data.Data;
            app.timeFormat(arr);
            for (var i = arr.length - 1; i >= 0; i--) {
                // console.log(i)
                var index = i;
                // console.log(arr[i])
                request({
                    url: 'https://epadmin.rfistudios.com.cn/api/Controller/GetController',
                    data: {
                        eventId: that.data.eventId,
                        sessionId: arr[i].SessionId
                    },
                }).then(res=>{
                    // console.log(res.data.Data)
                    if (res.data.Data.Parameter.signUpLimition == "") {
                        arr.splice(index + 1, 1)
                    }
                    // console.log(arr)
                    that.setData({
                        sessionInfo: arr,
                    })
                })
            }
        })
    

        
        


    },
    inputTelPhone: function (e) {
        var that = this
        that.setData({
            CellPhone: e.detail.value
        })
    },
    inputName: function (e) {
        var that = this
        that.setData({
            ChineseName: e.detail.value
        })
    },
    inputEmail: function (e) {
        var that = this
        that.setData({
            Email: e.detail.value
        })
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
            isConfirmSid: 1,
        })
    },
    checkedIndex:function(e){
        var that = this
        // console.log(e.currentTarget.dataset.index)
        that.setData({
            checkedIndex: e.currentTarget.dataset.index,
            signUpCount: that.data.sessionInfo[e.currentTarget.dataset.index].SignUpCount
        })
    },
    signUp:function(){
        var that = this;
        if (that.data.CellPhone && that.data.ChineseName && that.data.Email){
            // console.log(that.data)
            if (that.data.isConfirmSid == 1){
                console.log(that.data.sessionIds)
                request({
                    url: 'https://epadmin.rfistudios.com.cn/api/Controller/GetController',
                    data: {
                        eventId: that.data.eventId,
                        sessionId: that.data.sessionIds[0]
                    },
                }).then(res=>{
                    console.log(res);
                    var signUpLimition = res.data.Data.Parameter.signUpLimition;
                    console.log(signUpLimition)
                    console.log(that.data.signUpCount)
                    console.log(that.data)
                    if (that.data.signUpCount < signUpLimition) {
                        request({
                            url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/SignUpRegister',
                            method: "POST",
                            data: {

                                Confirm: "1",
                                WeChatOpenId: that.data.openId,
                                ChineseName: that.data.ChineseName,
                                CellPhone: that.data.CellPhone,
                                Email: that.data.Email,
                                Memo: "string",
                                EventId: that.data.eventId,
                                SessionIds: that.data.sessionIds

                            },
                        }).then(res=>{
                            console.log(res)

                            if (!res.data.IsError) {
                                wx.setStorage({
                                    key: 'epUserConfirmedSessions',
                                    data: that.data.sessionIds,
                                })
                                wx.showModal({
                                    title: that.data.language.modal_signup_1,
                                    content: '',
                                    confirmText: that.data.language.modal_confirmText,
                                    showCancel: false,
                                    success: function (res) {
                                        if (res.confirm) {
                                            wx.redirectTo({
                                                url: '../details/details?eventId=' + that.data.eventId + '&sessionId=' + that.data.sessionIds + '&showQRCode=true'
                                            });
                                        } else if (res.cancel) {

                                        }
                                    }
                                });
                            }
                        })
                    } else {
                        wx.showModal({
                            title: that.data.language.modal_signup_2,
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
                })
                
            }else{
                wx.showModal({
                    title: that.data.language.modal_signup_3,
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
            
        }else{
            wx.showModal({
                title: that.data.language.modal_signup_4,
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