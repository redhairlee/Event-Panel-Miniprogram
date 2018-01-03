// pages/list-signin/list-signin.js
var app = getApp();
Page({
    data: {
        arrNull: false,
    },
    eventNavTap: function (e) {
        //console.log(e);
        var app = getApp();

        if (getApp().globalData.arrayEventsResult) {
            var res = getApp().globalData.arrayEventsResult;
            var arrNeedToJoin = res.EventSessionsNeedToJoin;
            var arrNeedToFeedBack = res.EventSessionsNeedToFeedBack
            var arrHaveJoined = res.EventSessionsHaveJoined;
            this.setData({
                category: e.target.dataset.category,
                //arrayEvents: res
            });
            if (e.target.dataset.category == 'signin') {
                // console.log(arrNeedToJoin)
                arrNeedToJoin.sort(app.compare("StartTime"))
                app.reCom(arrNeedToJoin)
                var NeedToJoin = []
                app.screenTime(arrNeedToJoin, NeedToJoin)
                if (NeedToJoin.length == 0) {
                    this.setData({
                        arrNull: true
                    })
                }
                this.setData({
                    arrayEvents: NeedToJoin
                });
            } else if (e.target.dataset.category == 'rate') {
                // console.log(arrNeedToFeedBack)
                this.setData({
                    arrNull: false
                })
                arrNeedToFeedBack.sort(app.compare("StartTime"))
                app.reCom(arrNeedToFeedBack)
                this.setData({
                    arrayEvents: arrNeedToFeedBack
                });
            } else if (e.target.dataset.category == 'signed') {
                // console.log(arrHaveJoined)
                this.setData({
                    arrNull: false
                })
                arrHaveJoined.sort(app.compare("StartTime"))
                app.reCom(arrHaveJoined)
                this.setData({
                    arrayEvents: arrHaveJoined
                });
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
        var that = this;
        // 页面初始化 options为页面跳转所带来的参数

        if (getApp().globalData.arrayEventsResult) {
            var res = getApp().globalData.arrayEventsResult;
            console.log(res)
            var arrNeedToJoin = res.EventSessionsNeedToJoin;
            var arrNeedToFeedBack = res.EventSessionsNeedToFeedBack
            var arrHaveJoined = res.EventSessionsHaveJoined;
            console.log(options.category)
            that.setData({
                category: options.category
            })
            if (options.category == 'signin') {
                // console.log(arrNeedToJoin)
                arrNeedToJoin.sort(app.compare("StartTime"))
                app.reCom(arrNeedToJoin)
                var NeedToJoin = []
                app.screenTime(arrNeedToJoin, NeedToJoin)
                if (NeedToJoin.length == 0) {
                    this.setData({
                        arrNull: true
                    })
                }
                this.setData({
                    arrayEvents: NeedToJoin
                });
            } else if (options.category == 'rate') {
                // console.log(arrNeedToFeedBack)
                this.setData({
                    arrNull: false
                })

                arrNeedToFeedBack.sort(app.compare("StartTime"))
                app.reCom(arrNeedToFeedBack)
                this.setData({
                    arrayEvents: arrNeedToFeedBack
                });
            } else if (options.category == 'signed') {
                // console.log(arrHaveJoined)
                this.setData({
                    arrNull: false
                })

                arrHaveJoined.sort(app.compare("StartTime"))
                app.reCom(arrHaveJoined)
                this.setData({
                    arrayEvents: arrHaveJoined
                });
            }

        }

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