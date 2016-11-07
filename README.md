# webAppComponent
html5移动端数据可视化报告
效果展示：                                                                                                                                  
![Alt text](https://github.com/liiiku/webAppComponent/blob/master/imgs/11.png)
![Alt text](https://github.com/liiiku/webAppComponent/blob/master/imgs/22.png)
![Alt text](https://github.com/liiiku/webAppComponent/blob/master/imgs/33.png)
![Alt text](https://github.com/liiiku/webAppComponent/blob/master/imgs/44.png)
![Alt text](https://github.com/liiiku/webAppComponent/blob/master/imgs/55.png)
![Alt text](https://github.com/liiiku/webAppComponent/blob/master/imgs/66.png)
![Alt text](https://github.com/liiiku/webAppComponent/blob/master/imgs/77.png)
![Alt text](https://github.com/liiiku/webAppComponent/blob/master/imgs/88.png)
![Alt text](https://github.com/liiiku/webAppComponent/blob/master/imgs/99.png)
![Alt text](https://github.com/liiiku/webAppComponent/blob/master/imgs/1010.png)
二维码：                                                                                                                                    
![Alt text](https://github.com/liiiku/webAppComponent/blob/master/imgs/result.png)
项目描述：
尝试用组件方式组织编写代码，效果可扫描二维码在手机上查看（由于是专门做的移动端，pc端查看最好用开发者工具查看）
1、整个项目的DOM操作用采用jQuery库，项目的整页滚动操作采用fullpage.js插件实现
2、为了体现组件方式开发，将其分为内容组织类（可不断的添加新的一页和这一页上面的组件，提高了代码后续的维护和扩展）、图文组件类（整体页面公共的图文组织以及动画的处理）、图标组件类（这个是所有图标组件的基础，例如：柱图、散点图、折线图、雷达图等等）
3、图标组件通过canvas实现绘制
4、用json对后台数据进行模拟，通过ajax将其请求过来渲染到页面上

