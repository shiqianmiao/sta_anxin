<!--container-->
<div class="container" data-widget="app/client/app/fang/misc/100_house/view/index_page.js#boxContainer">

  <div class="house-banner">
    <img src="http://sta.ganji.com/ng/app/client/app/fang/misc/100_house/image/house_banner.jpg" width="100%">
    <div class="house-num">
      <p class="now-had">
        <span>北京现有</span>
        <%_.each(totalNum, function(item){%>
          <span class="num-wraper num-<%= item %>"><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i><i>0</i></span>
        <%});%>
        <span>套个人房源</span>
      </p>
      <p class="saving">共为大家节约<em><%= totalAmount %></em>元中介费</p>
    </div>
  </div>

  <!--host-box-->
  <div class="host-box" data-role="detailLink" data-puid="<%= hostBox.puid %>">
    <p class="host-say">房东有话说</p>
    <div class="say-con">
        <p class="host-name"><%= hostBox.person %>：</p>
      <p class="say-word"><%= hostBox.user_word %></p>
    </div>
    <div class="house-con">
        <p><span><%= hostBox.street_name %></span><span><%= hostBox.huxing %></span><span><%= hostBox.price %></span></p>
      <img src="<%= hostBox.thumb_img %>" width="100%">
    </div>
  </div>
  <!--/host-box-->

  <ul class="dicuss-box">
    <%_.each(list, function(item){%>
        <li data-role="detailLink" data-puid="<%= item.puid %>">
          <a href="javascript:;">
            <p><span><%= item.person %>：</span><%= item.user_word %></p>
            <div class="about-house">
              <div class="fl"><p><%= item.street_name %></p><p><%= item.huxing %></p><p class="fc-red"><%= item.price %></p></div>
              <div class="fr"><img src="<%= item.thumb_img %>"></div>
            </div>
          </a>
        </li>
    <%});%>
  </ul>
  <!--more-house-->


    <a href="javascript:;" class="house-list-more" data-role="listLink" href="#">查看更多100%个人房源<i></i></a>

  </div>
  <!--/more-house-->
  <div class="calcu-list" data-widget="app/client/app/fang/misc/100_house/view/index_page.js#linkList">
    <p class="house-tit">贷款相关知识</p>
    <ul>
      <li><a href="javascript:;" data-role="link" data-href="http://3g.ganji.com/bj_news/client/theme1/?type=detail&id=10">租房砍价“七大招”</a></li>
      <li><a href="javascript:;" data-role="link" data-href="http://3g.ganji.com/bj_news/client/theme1/?type=detail&id=25">如何用公积金租房</a></li>
      <li><a href="javascript:;" data-role="link" data-href="http://3g.ganji.com/bj_news/client/theme1/?type=detail&id=34">租房最常见五大骗局</a></li>
      <li><a href="javascript:;" data-role="link" data-href="http://3g.ganji.com/bj_news/client/theme1/?type=detail&id=7">四成在京青年遇黑中介</a></li>
    </ul>
  </div>

</div>