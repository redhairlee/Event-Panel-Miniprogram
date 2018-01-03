//index.js
//获取应用实例
var app = getApp();
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
        showSignin: false
    },
    //事件处理函数
    gotoPageList: function () {
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
        console.log(app);
        var that = this;

        wx.getStorage({
            key: 'epStaffInfo',
            success: function (res) {
                console.log(res.data);
                that.setData({
                    showSignin: true
                });
            }
        });

        wx.showLoading({
            title: '加载中',
        })


        var t = setInterval(function () {
            if (app.globalData.wechatOpenId) {
                wx.request({
                    url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetMyEventSessions',
                    data: {
                        weChatOpenId: app.globalData.wechatOpenId
                    },
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    success: function (res) {
                        wx.hideLoading();
                        // console.log(res.data.Data.EventSessionsNeedToJoin);
                        console.log(res.data.Data)
                        if (res.data.Data) {
                            app.globalData.arrSessions = res.data.Data;
                            if (app.globalData.arrSessions) {
                                console.log(app.globalData.arrSessions);
                                
                                var arr = app.globalData.arrSessions.EventSessionsNeedToJoin;
                                arr.sort(app.compare("StartTime"))
                                // console.log(arr)

                                app.reCom(arr)
                                //时间判断
                                var arrayEvents = [];
                                app.screenTime(arr, arrayEvents)
                                if (arrayEvents.length == 0) {
                                    that.setData({
                                        arrNull: true
                                    })
                                }
                                // console.log(arr[0].sessions[0].EventWhen.length)
                                app.globalData.arrayEventsResult = app.globalData.arrSessions;
                                that.setData({
                                    arrayEvents: arrayEvents,
                                    // arrayEvents: arr,
                                });
                                
                            }
                        }else{
                            that.setData({
                                arrNull: true
                            })
                        }
                        
                    }
                });
                clearInterval(t);
            }

        }, 500);
    }
})
