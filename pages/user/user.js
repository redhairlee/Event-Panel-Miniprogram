//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        userInfo: {},
        NeedToJoin: 0,
        NeedToFeedBack: 0,
        HaveJoined: 0,
        isShow: false
    },
    //事件处理函数
    gotoListSignin: function () {
        wx.navigateTo({
            url: '../list/list?category=signin'
        })
    },
    gotoListRate: function () {
        wx.navigateTo({
            url: '../list/list?category=rate'
        })
    },
    gotoListAll: function () {
        wx.navigateTo({
            url: '../list/list?category=signed'
        })
    },
    onLoad: function () {
        var that = this;
        if (app.globalData.arrSessions) {
            console.log(app.globalData.arrSessions);
            var res = app.globalData.arrSessions;
            var arrNeedToJoin = res.EventSessionsNeedToJoin;
            var NeedToJoin = []
            app.screenTime(arrNeedToJoin, NeedToJoin)
            that.setData({
                NeedToJoin: NeedToJoin.length,
                NeedToFeedBack: res.EventSessionsNeedToFeedBack.length,
                HaveJoined: res.EventSessionsHaveJoined.length
            })
        }
        wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
                console.log(res);
                that.setData({
                    userNickname: res.userInfo.nickName,
                    userAvatar: res.userInfo.avatarUrl
                })
            }
        })
        // wx.getStorage({
        //     key: 'weChatUserInfo',
        //     success: function (res) {
        //         console.log(res)
        //         that.setData({
        //             userNickname: res.data.nickName,
        //             userAvatar: res.data.avatarUrl
        //         })
        //     }
        // });
        wx.getStorage({
            key: 'epUserInfo',
            success: function (result) {
                console.log(result)
                if (result.data.userInfo){
                    that.setData({
                        userNickname: result.data.userInfo.ChineseName,
                        userPhone: result.data.userInfo.CellPhone,
                    });
                    if (result.data.userInfo.Company){
                        userCompany: result.data.userInfo.Company
                        isShow: true
                    }
                    if (result.data.userInfo.Title) {
                        userTitle: result.data.userInfo.Title
                        isShow: true
                    }
                }
            }
        });
        // console.log(this.data.userAvatar)
    },
    onShow:function(){
        wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
                console.log(res);
                wx.setStorage({
                    key: 'weChatUserInfo',
                    data: {
                        nickName: res.userInfo.nickName,
                        avatarUrl: res.userInfo.avatarUrl
                    },
                })
            }
        })
        // console.log(this.data.avatarUrl)
    }
})
