//app.js
var app = getApp();
var QR = require("./utils/qrcode.js");
App({
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        // console.log(this)
        var that = this;
        wx.getStorage({
            key: 'UserInfo',
            success: function (res) {
                console.log(res)
            },
        })
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        // wx.getUserInfo({
        // 	success: function (res) {
        //         console.log(res)
        // 		wx.setStorage({
        // 			key: 'weChatUserInfo',
        // 			data: {
        // 				nickName: res.userInfo.nickName,
        // 				avatarUrl: res.userInfo.avatarUrl
        // 			},
        // 		})
        // 	}
        // })
		/*wx.checkSession({
			success: function () {
			
			},
			fail: function () {*/
        wx.login({
            success: function (res) {
                console.log(res)
                if (res.code) {
                    wx.request({
                        url: 'https://epadmin.rfistudios.com.cn/miniprogram/server.php',
                        method: 'POST',
                        data: {
                            action: 'login',
                            code: res.code
                        },
                        success: function (res) {
                            console.log(res);
                            that.globalData.wechatOpenId = res.data.openid;
                            // console.log(that.globalData);
                            wx.setStorage({
                                key: "loginData",
                                data: res.data
                            });
                            wx.getSetting({
                                success(res) {
                                    if (!res.authSetting['scope.userInfo']) {
                                        wx.authorize({
                                            scope: 'scope.userInfo',
                                            success() {
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
                                                        // var loginData = wx.getStorageSync('loginData');
                                                        // console.log(loginData);
                                                        // wx.request({
                                                        //     url: 'https://epadmin.rfistudios.com.cn/miniprogram/server.php',
                                                        //     method: 'POST',
                                                        //     data: {
                                                        //         action: 'userinfo',
                                                        //         sessionKey: loginData.session_key,
                                                        //         encryptedData: res.encryptedData,
                                                        //         iv: res.iv
                                                        //     },
                                                        //     success: function (res) {
                                                        //         console.log(res);
                                                        //         wx.setStorage({
                                                        //             key: 'weChatUserInfo',
                                                        //             data: {
                                                        //                 nickName: res.data.nickName,
                                                        //                 avatarUrl: res.data.avatarUrl
                                                        //             },
                                                        //         })
                                                        //     }
                                                        // });
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }
                            });
                            //根据openId获取userInfo 添加至本地缓存
                            wx.request({
                                url: 'https://epadmin.rfistudios.com.cn/api/WeChatEvent/GetUserProfileByWeChatOpenId',
                                data: {
                                    weChatOpenId: that.globalData.wechatOpenId
                                    // weChatOpenId: '243565768'
                                },
                                success: function (res) {
                                    // console.log(res.data.Data)
                                    console.log(getApp().globalData.wechatOpenId)
                                    // getApp().globalData.arrayEventsResult = res.data.Data;
                                    if (res.data.Data) {
                                        var userInfo = res.data.Data.Profile;
                                        var userId = res.data.Data.UserId
                                    }
                                    wx.setStorage({
                                        key: 'epUserInfo',
                                        data: {
                                            userInfo: userInfo,
                                            userId: userId
                                        },
                                    })

                                }

                            });

                        }
                    })
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }
            }
        });

		/*}
	})*/
    },
    //排序
    compare: function (prop) {
        return function (obj1, obj2) {
            var val1 = obj1[prop];
            var val2 = obj2[prop];
            if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else {
                return 0;
            }
        }
    },
    //重组
    reCom: function (arr) {
        var _this = this;
        console.log(_this)
        for (var i = 0; i < arr.length; i++) {
            var id = arr[i].EventId;
            arr[i].sessions = [];
            // console.log(arr[i].StartTime.replace('T', '-'));
            arr[i].sessions.push({
                sessionId: arr[i].SessionId,
                sessionName: arr[i].SessionName,
                EventWhen: arr[i].StartTime.replace('T', ' ').slice(0, 16),
                EventWhere: arr[i].EventWhere,
            });
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[j].EventId == id) {
                    arr[i].sessions.push({
                        sessionId: arr[j].SessionId,
                        sessionName: arr[j].SessionName,
                        EventWhen: arr[j].StartTime.replace('T', ' ').slice(0, 16),
                        EventWhere: arr[j].EventWhere,
                    });
                    arr.splice(j, 1);
                }
            }
            arr[i].sessions.sort(_this.compare("EventWhen"));
        }
    },
    //时间格式
    timeFormat: function (arr) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].StartTime = arr[i].StartTime.replace('T', ' ').slice(0, 16);
        }
    },
    //时间判断
    screenTime: function (arr, newArr) {
        // var arrayEvents = [];
        // var Carr = arr;
        var date = new Date()
        var d = [];
        for (var i = 0; i < arr.length; i++) {
            var t = new Date(arr[i].StartTime)
            // console.log(t)
            // console.log(date)
            d.push(t)
            if (t > date) {
                newArr.push(arr[i])
            }
        }
        // console.log(newArr.length);
    },
    hideQRbox: function (event, that) {
        that.setData({
            isShow: false,
            isBlur: false
        })
    },
    //适配不同屏幕大小的canvas
    setCanvasSize: function () {
        var size = {};
        try {
            var res = wx.getSystemInfoSync();
            var scale = 750 / 686;//不同屏幕下canvas的适配比例；设计稿是750宽
            var width = res.windowWidth / scale;
            var height = width;//canvas画布为正方形
            size.w = width;
            size.h = height;
        } catch (e) {
            // Do something when catch error
            console.log("获取设备信息失败" + e);
        }
        return size;
    },
    createQrCode: function (url, canvasId, cavW, cavH, that) {
        //调用插件中的draw方法，绘制二维码图片
        QR.api.draw(url, canvasId, cavW, cavH);
        setTimeout(() => { that.canvasToTempImage(); }, 500);

    },
    //获取临时缓存照片路径，存入data中
    canvasToTempImage: function (that) {
        wx.canvasToTempFilePath({
            canvasId: 'mycanvas',
            success: function (res) {
                var tempFilePath = res.tempFilePath;
                that.setData({
                    imagePath: tempFilePath,
                    // canvasHidden:true
                });
            },
            fail: function (res) {
                console.log(res);
            }
        });
    },
    //点击图片进行预览，长按保存分享图片
    previewImg: function (e, that) {
        var img = that.data.imagePath;
        // console.log(img);
        wx.previewImage({
            current: img, // 当前显示图片的http链接
            urls: [img] // 需要预览的图片http链接列表
        })
    },
    //获取输入的手机号码
    inputValue: function (e, that) {
        that.setData({
            telNum: e.detail.value
        })
        wx.setStorage({
            key: 'cellPhone',
            data: {
                cellPhone: that.data.telNum
            }
        })
        var isTelNull = that.data.telNum !== "" ? 1 : 0
        that.setData({
            isTelNull: isTelNull
        })
        var isConfirm = that.data.isTelNull == 1 ? 0 : 1
        that.setData({
            // isChecked: isChecked
            isConfirm: isConfirm,
        })
        // console.log(this.data.isTelNull)
    },
    globalData: {
        // wechatOpenId: 'oj-L2vy5aocCOwtfWY_EXOlONuxM',
        arrayEventsResult: []
    }
})