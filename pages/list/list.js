// pages/list-signin/list-signin.js
var app = getApp();
Page({
    data: {
        arrNull: false,
    },
    eventNavTap: function (e) {
        var that = this

        that.setData({
            category: e.target.dataset.category,
        });
        if (e.target.dataset.category == 'signin') {
            if (that.data.NeedToJoin.length == 0) {
                that.setData({
                    arrNull: true
                })
            }
            that.setData({
                arrayEvents: that.data.NeedToJoin,
                scrollTop: 0
            });
        } else if (e.target.dataset.category == 'rate') {
            if (that.data.arrNeedToFeedBack){
                that.setData({
                    arrayEvents: that.data.arrNeedToFeedBack,
                    scrollTop: 0,
                    arrNull: false
                });
            }else{
                that.setData({
                    arrNull: true
                })
            }
            
        } else if (e.target.dataset.category == 'signed') {
            if (that.data.arrHaveJoined){
                that.setData({
                    arrayEvents: that.data.arrHaveJoined,
                    scrollTop: 0,
                    arrNull: false
                });
            }else{
                that.setData({
                    arrNull: true
                })
            }
            
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
        // console.log(app.globalData.arrSessions)
        var that = this;
        wx.showLoading({
            title: '加载中',
        })
        wx.request({
            url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetMyEventSessions?timestamp=' + (new Date()).valueOf(),
            data: {
                weChatOpenId: app.globalData.wechatOpenId
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                // console.log(res.data.Data)
                wx.hideLoading();
                if (!res.data.IsError && res.data.Data) {
                    var arrayMySessions = res.data.Data;
                    // var arrayMySessions = app.globalData.arrSessions
                    // console.log(arrayMySessions)
                    var arrNeedToJoin = arrayMySessions.EventSessionsNeedToJoin;
                    var arrNeedToFeedBack = arrayMySessions.EventSessionsNeedToFeedBack;
                    var arrHaveJoined = arrayMySessions.EventSessionsHaveJoined;
                    // console.log(arrNeedToFeedBack)
                    // console.log(options.category)
                    that.setData({
                        category: options.category
                    })
                    arrNeedToJoin.sort(app.compare("StartTime"))
                    app.reCom(arrNeedToJoin)
                    var NeedToJoin = []
                    app.screenTime(arrNeedToJoin, NeedToJoin)

                    arrNeedToFeedBack.sort(app.compare("StartTime"))
                    app.reCom(arrNeedToFeedBack)

                    arrHaveJoined.sort(app.compare("StartTime"))
                    app.reCom(arrHaveJoined)

                    that.setData({
                        NeedToJoin: NeedToJoin,
                        arrNeedToFeedBack: arrNeedToFeedBack,
                        arrHaveJoined: arrHaveJoined
                    })
                    if (options.category == 'signin') {
                        if (NeedToJoin.length == 0) {
                            that.setData({
                                arrNull: true
                            })
                        }
                        that.setData({
                            arrayEvents: NeedToJoin
                        });
                    } else if (options.category == 'rate') {
                        if (arrNeedToFeedBack){
                            that.setData({
                                arrayEvents: arrNeedToFeedBack,
                                arrNull: false
                            });
                        }else{
                            that.setData({
                                arrNull: true
                            })
                        }
                    } else if (options.category == 'signed') {
                        if (arrHaveJoined){
                            that.setData({
                                arrayEvents: arrHaveJoined,
                                arrNull: false
                            });
                        }else{
                            that.setData({
                                arrNull: true
                            })
                        }
                    }
                }
            }
        })
        // console.log(app.globalData.arrSessions)


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