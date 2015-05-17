    <header>
        <img src="http://stacdn201.ganjistatic1.com/att/project/touch/group_car_sharing/img/head.jpg" alt="">
    </header>

    <!-- 结伴回家 -->
    <section class="go-where" data-widget="app/client/app/misc/car_share/view/index.js#selectWhere" >
        <span class="all-people">已有<em><%= list.pv %></em>人聚集</span>
        <div class="part-bg">
            <div class="addr">
                <span>我在这里</span>
                <a class="site-text" href="javascript:;" data-role="fromWhere"></a>
            </div>
            <div class="addr">
                <span>春节要回</span>
                <a class="site-text" href="javascript:;" data-role="toWhere"></a>
            </div>
            <a href="javascript:;" class="btn" data-role="getHome">结伴回家</a>
        </div>
    </section>
    <!-- /结伴回家 -->

    <!-- 拼车送礼 -->
    <section class="sharing-car">
        <div class="tit">拼车送礼</div>
        <p><span>春节期间</span>（2.6-3.5）使用赶集群组拼车成功的用户，在微博发布带有<em>#找到老乡，拼车回家#</em>的内容，讲述拼车经过、附上群组截图，并<em>@赶集网</em>，即有机会获得以下羊年大礼：</p>

        <div class="scroll-wrap">
            <div class="scroll-box">
                <ul>
                    <li>
                        <div><img src="http://stacdn201.ganjistatic1.com/att/project/touch/group_car_sharing/img/p2.jpg" alt=""></div>
                        <p>群组活动基金</p>
                    </li>
                    <li>
                        <div><img src="http://stacdn201.ganjistatic1.com/att/project/touch/group_car_sharing/img/p1.jpg" alt=""></div>
                        <p>往返油费报销</p>
                    </li>
                    <li>
                        <div><img src="http://stacdn201.ganjistatic1.com/att/project/touch/group_car_sharing/img/p3.jpg" alt=""></div>
                        <p>羊年红包</p>
                    </li>
                </ul>
            </div>
        </div>

    </section>
    <!-- /拼车送礼 -->

    <!-- 拼车实拍 -->
    <section class="car-camera" data-widget="app/client/app/misc/car_share/view/index.js#pop">
        <div class="part-bg">
            <!-- 图片滚动 -->
            <div class="tit">拼车实拍</div>
            <ul class="pic-ul">
                <li><img src="http://stacdn201.ganjistatic1.com/att/project/touch/group_car_sharing/img/pic1.jpg" alt="" data-role="carPic"></li>
                <li><img src="http://stacdn201.ganjistatic1.com/att/project/touch/group_car_sharing/img/pic2.jpg" alt="" data-role="carPic"></li>
                <li><img src="http://stacdn201.ganjistatic1.com/att/project/touch/group_car_sharing/img/pic3.jpg" alt="" data-role="carPic"></li>
            </ul>
            <div class="float-bg" data-role="bigImg">
                <div class="pop-img popup">
                    <a href="javascript:;" class="close-btn"></a>
                    <img src="" width="100%" alt="" data-role="imgSrc">
                    <p data-role="picTip"></p>
                </div>
            </div>
            <!-- /图片滚动 -->
            <div class="people-box">
                <div class="tit">热门拼车群组</div>
                <p>
                    <a href="http://sta.ganji.com/ng/app/client/common/index.html#app/client/app/misc/car_share/view/group_join.js?group_id=30046250" data-native-a="1" target="_blank">河北人在北京<em>&gt;</em></a>
                    <a href="http://sta.ganji.com/ng/app/client/common/index.html#app/client/app/misc/car_share/view/group_join.js?group_id=30079687" data-native-a="1" target="_blank"> 安徽人在上海<em>&gt;</em></a>
                    <a href="http://sta.ganji.com/ng/app/client/common/index.html#app/client/app/misc/car_share/view/group_join.js?group_id=30079698" data-native-a="1" target="_blank">河南人在上海<em>&gt;</em></a>
                    <a href="http://sta.ganji.com/ng/app/client/common/index.html#app/client/app/misc/car_share/view/group_join.js?group_id=30079706" data-native-a="1" target="_blank">湖南人在深圳<em>&gt;</em></a>
                    <a href="http://sta.ganji.com/ng/app/client/common/index.html#app/client/app/misc/car_share/view/group_join.js?group_id=30015130" data-native-a="1" target="_blank">渭南人在西安<em>&gt;</em></a>
                    <a href="http://sta.ganji.com/ng/app/client/common/index.html#app/client/app/misc/car_share/view/group_join.js?group_id=30013701" data-native-a="1" target="_blank">南充人在成都<em>&gt;</em></a>
                </p>
            </div>
        </div>
    </section>
    <!-- /拼车实拍 -->

    <!-- 更多拼车方式 -->
    <section class="part-bg more-car-share">
        <div class="tit">更多拼车方式</div>
        <p>每天，有7838名用户在这里拼车成功，去年春节，我们共帮助超过20万人顺利拼车回家。</p>
        <a href="http://3g.ganji.com/misc/pinche/" data-native-a="1" class="btn" target="_blank">去拼车</a>
    </section>
    <!-- /更多拼车方式 -->

    <footer>
        赶集网—最全的生活分类信息网
    </footer>