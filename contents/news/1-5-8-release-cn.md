---
title: "1.5.8 版本发布"
date: "2026-03-07"
author: "BenderBlog"
tags: ["announcement"]
lang: "zh"
---

# 本版本变化

1. 修复自定义课程编辑页的空指针异常 @FlyingPig278
2. 平板考勤查询页面 @imoscarz
3. 优化体育查询界面的UI @imoscarz
4. 切换学期功能 @BenderBlog @hazuki-keatsu
5. 电费查询和电费绘图修复 @BenderBlog

本次版本处理的合并请求：

#107 和 #111 为仅对 README.MD 的 PR，不在此列出。

* fix: 修复自定义课程编辑页的空指针异常 by @FlyingPig278 in https://github.com/BenderBlog/traintime_pda/pull/110
* feat: 在平板或PC视图下考勤查询功能使用表格视图 by @imoscarz in https://github.com/BenderBlog/traintime_pda/pull/109
* feat: 优化了体育查询界面的UI与部分代码逻辑 by @imoscarz in https://github.com/BenderBlog/traintime_pda/pull/112

新贡献者：

* @FlyingPig278 made their first contribution in https://github.com/BenderBlog/traintime_pda/pull/110
* @imoscarz made their first contribution in https://github.com/BenderBlog/traintime_pda/pull/109

**完整修改日志:** https://github.com/BenderBlog/traintime_pda/compare/v1.5.6...v1.5.8

# 已知问题：iOS 锁屏负一屏

版本更新后，有 iOS 用户反馈在锁屏页面负一层看不到我程序的小部件，如下图所示。

![](img/blog/ios-locked.jpg)

用户还提供了与其相关的[官方文档](https://support.apple.com/zh-cn/guide/security/secbb0a1f9b4/web)，这里面提到：

> 如果用户选择隐藏其视为私密的内容，WidgetKit 会显示占位符或编校内容。若要配置编校内容，开发者必须：
> 
> 1.应用 redacted(reason:) 回调。
> 
> 2.宣告 privacy 属性。
> 
> 3.提供自定义占位符视图。
> 
> 开发者还可使用 unredacted() 视图修饰符让视图以未编校的形式呈现。

然而用`unredacted()`修复失败了，而最开始问 AI 的时候，AI 没有往负一层想，而是重新写了个锁屏页面的小部件，该部件将放在时钟下面那行。

根据 AI 修复结果，我往程序公共位置存储文件时候没有设置隐私权限。修复代码包括：
1. 写入时候包括正确的隐私权限，权限为开机第一次解锁后可任意访问。
2. 写入后为保证隐私设置正确，需要再次设置隐私权限。

```swift
// 写入时候包括正确的隐私权限
try Data(data.data.utf8).write(
    to: targetURL,
    options: [.atomic, .completeFileProtectionUntilFirstUserAuthentication]
)

// 再次设置权限，保证隐私权限设置正确。
try fileManager.setAttributes(
    [.protectionKey: FileProtectionType.completeUntilFirstUserAuthentication],
    ofItemAtPath: targetURL.path
)
```

![](img/blog/ios-locked-fix.jpg)


该修复将随下个版本发布，该修复已由一个用户通过 adhoc 构建渠道验证。上图中在锁定模式下，负一屏中我程序小部件正常显示。

# 电费查询失败原因

根据用户报告，在一月底时候，电费无法查询。我最开始认为只是学校缴费服务器日常抽风，过几天就好了。结果就在前几天，看见鸽子群里面有人说电费缴了但没有来电。我开始怀疑缴费系统哪里坑我了。之前物理实验系统GB2312的回复头多少给我一点小小的老旧服务器震撼了。

快开学的时候，我收到了大量画图错误的反馈。在一个用户的帮助下，我修复了该错误，顺手加了个显示具体错误信息的特性。我把修复后包传给这个用户的时候，我本想看到绘图正常，结果来了个这个：

![](img/blog/cookie-exception.jpg)

Cookie拦截器在处理一个响应头`Set-Cookie: Secure`的时候报错，服务器真给我塞了个这个？于是我打开浏览器抓包，发现真的是这样：

![](img/blog/abnormal-cookie.png)

鉴于这是库的问题，我去该库[提了个 issue](https://github.com/cfug/dio/issues/2492)。这类错误实际上很好修，过滤掉错误的 Cookie 就行了，不过我担心他们不认，就没搞。出乎我意料的是，他们直接一个 AI 修复就完了，允许在处理出错时候直接返回空值。好可惜啊，我错过了一个好的 PR 机会。

# F-Droid 构建失败与基准配置文件

简单来说，[基准配置文件](https://developer.android.google.cn/topic/performance/baselineprofiles/overview?hl=zh-cn)可通过预先 (AOT) 编译来优化指定的代码路径，提高启动速度，从而针对每位新用户以及每个应用更新提升性能。而 F-Droid 的可重复构建文档提到，该配置会对可重复构建过程造成影响，详情查阅[文档中的 Bug: baseline.prof 不是确定性的](https://f-droid.org/zh/docs/Reproducible_Builds)。

不过，该问题的解决方案我感觉很“无厘头”：

1. 重新运行构建直至文件匹配。
2. 使用和上游一样的 CPU 核心数。
3. 停用基线配置文件。

第一条自然不太现实，感觉他们的构建机不可能专门给你这个程序开例外吧。我去 F-Droid 群组询问了维护者，根据第二条告诉他 Github Action 的机器有 4 个 CPU。最后构建通过。

我下个版本预计移除基线配置文件，感觉对于我这类程序，意义不大的说。

# 切换学期功能

这是一个古老的功能，我寻思疫情后不会再出现提前上下学期课程的状况，就给移除了。结果，最近出现两个特殊情况，体现了这个功能新的价值。

1. 研究生期末考试还没完，学期变更到下学期了；
2. 本科生在寒假前选了下学期的课，想在寒假时候在我程序里面看下学期课表。

我添加了个是否用户修改的标志位，并在获取课表前会获取当前学期，以确保学期永远是最新的，避免用户设置完学期忘了改回来。

# 彩蛋描述

[《怪盗圣少女》](https://www.bilibili.com/video/BV1qs411B7KG?p=15)和[《哆啦A梦》](https://www.bilibili.com/video/BV15s411S74W)在2002年左右被上海电视台引进，这两个动画片的主角圣少女和哆啦A梦均由[李晔](https://mzh.moegirl.org.cn/%E6%9D%8E%E6%99%94)配音。她配音这俩角色时候声线都不带变的，不像2010年配音《马达加斯加的企鹅》里面水獭马琳那样，换了个声线。

本来彩蛋哆啦A梦那张图片，我想用 Flutter Canvas 绘画，但是 AI 无法一次性生成代码，估计得等下次版本发布时候我自己手画了。

《怪盗圣少女》英语名叫 Saint Tail，女主人公白天是一名六年级的学生，晚上是“义贼罗宾汉版本的美少女战士”。她去偷的东西，一般都是被人抢走、骗走的。她偷完之后，都会将物品送回原先的主人。男主人公是女主的同班同学，是警察局长的孩子。他很喜欢女主，一直猜测女主的真实身份，甚至有两三次差点彻底认出来。他经常会接到女主发的“偷窃预告”，然后在警察的授意下，去那个地方提防。虽然每次结果都是被她“得手”，但是他知道了物品背后的故事，并多少协助他爸爸办案。最后一集男主“抓到了她”，或者说是双向奔赴，等到成年后他们结婚了。这是少数几个彻底甜蜜结果的正经动画片了，《美少女战士》是全员毁灭后失去记忆复活、《EVA》最后看起来防止侵略但是世界也被折腾得够呛、《百变小樱》是男主要回国了才描述心意、《蜡笔小新》里面松阪老师的感情被写死了。

这个动画片我个人感觉不算很成功，剧情我感觉比较平淡。在商业方面应该也是比较温和的成功，朝日电视台播出了一年，世嘉搞了个音乐剧演出，据说世嘉还打算出游戏。不过在神仙打架的九十年代，这个动画片不算那么突出。当然，这个和作者立川惠个人无法全身心投入绘画漫画事业有一定关系。