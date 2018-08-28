//index.js
//获取应用实例
var app = getApp();
var Promisify = require('../../utils/util.js');
var request = Promisify.wxPromisify(wx.request);//ajax请求
Page({
    data: {
        imgUrls: [
            'https://timgsa.baidu.com/timg?image&quality=80&size=b10000_10000&sec=1512939607&di=6a4e5f33b292caa2498650058d4fd347&src=http://img.mshishang.com/pics/2015/0916/20150916100922709.jpg',
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1512949773497&di=795739d140b6969fdcd9eb923ef5feb2&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20150914%2Fmp31820683_1442236704583_7.jpeg'
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        arrNull: false,
        showSignin: false,
        isIPX: app.globalData.isIPX ? true : false,
        language: app.globalData.language
    },
    //事件处理函数
    gotoPageList: function () {
        // console.log(app.globalData.arrSessions)
        wx.navigateTo({
            url: '../list/list?category=signin'
        })
    },
    gotoScanCode: function () {

        var that = this;
        wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
                // console.log(res)
                wx.navigateTo({
                    url: '../signin/signin?actionId=' + res.result
                })
            }
        })
    },
    gotoPageSignin: function () {
        wx.navigateTo({
            url: '../signin/signin'
        })

    },
    gotoPageUser: function () {
        wx.navigateTo({
            url: '../user/user'
        })
    },

    gotoDetails: function (event) {
        // console.log(event.currentTarget.dataset);
        wx.navigateTo({
            url: '../details/details?eventId=' + event.currentTarget.dataset.eventId + '&sessionId=' + event.currentTarget.dataset.sessionId
        })
    },

    onLoad: function () {
        // console.log(app);
        // console.log(app.globalData);
        var that = this;
        wx.getStorage({
            key: 'epStaffInfo',
            success: function (res) {
                // console.log(res.data);
                that.setData({
                    showSignin: true
                });
            }
        });

        wx.showLoading({
            title: '加载中',
        })
        // console.log("index+"+app.globalData.wechatOpenId);
        var t = setInterval(function () {
            if (app.globalData.wechatOpenId) {
                clearInterval(t)
                request({
                    url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetMyEventSessions',
                    data: {
                        weChatOpenId: app.globalData.wechatOpenId
                    },
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                }).then(res => {
                    // console.log(res);
                    wx.hideLoading();
                    // console.log(res.data.Data.EventSessionsNeedToJoin);
                    // console.log(res.data)
                    if (!res.data.IsError && res.data.Data) {

                        app.globalData.arrSessions = res.data.Data;
                        //排序 重组
                        var arr = res.data.Data.EventSessionsNeedToJoin;
                        arr.sort(app.compare("StartTime"))
                        // console.log(arr)
                        app.reCom(arr)
                        // console.log(arr)
                        //场次状态判断
                        var arrayEvents = [];
                        app.screenTime(arr, arrayEvents)
                        // console.log(arrayEvents)
                        if (arrayEvents.length == 0) {
                            that.setData({
                                arrNull: true
                            })
                        }
                        that.setData({
                            arrayEvents: arrayEvents,
                            // arrayEvents: arr,
                        });
                    } else {
                        that.setData({
                            arrNull: true
                        })
                    }
                })
            }
        }, 50)
        
    }
})
