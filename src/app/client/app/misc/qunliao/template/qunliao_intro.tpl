<section class="section">
  <div class="banner"><img src="http://stacdn201.ganjistatic1.com/att/project/app/group_intro/images/banner.png" alt=""></div>
  <div class="interaction">
    <div class="data">已有<span id="count" class="count"><%= data.counter%></span>人点赞</div>
    <div class="ds">2015年1月正式发布！</div>
    <div class="opt">
    <% if (data.hasLike) { %>
      <button type="button" class="btn js-touch-state" disabled=""><i class="icon-heart"></i>已成功点赞
        </button>
    <% } else { %>
      <button type="button" class="btn js-touch-state"
          data-widget="app/client/app/misc/qunliao/view/qunliao_intro.js#like"><i class="icon-heart"></i>为群组点赞
      </button>
    <% } %>
    </div>
  </div>
  <div class="intro">
    <div class="tips">
      <p>赶集群组是赶集网即将推出的社交产品。</p>
      <p>在这里你可以随时找到感兴趣的人和群。</p>
    </div>
    <ul class="list">
      <li class="list-item item-01">
        <h3 class="list-title">寻找老乡不寂寞</h3>
        <div class="list-cont"></div>
      </li>
      <li class="list-item item-02">
        <h3 class="list-title">同行交流更直接</h3>
        <div class="list-cont"></div>
      </li>
      <li class="list-item item-03">
        <h3 class="list-title">兴趣让你我在一起</h3>
        <div class="list-cont"></div>
      </li>
      <li class="list-item item-04">
        <h3 class="list-title">附近地点随时聊</h3>
        <div class="list-cont"></div>
      </li>
    </ul>
  </div>
  <div class="focus" data-widget="com/mobile/widget/responsiveBanner.js" data-interval="3000">
    <div class="focus-tab">
      <i class="item" data-slide-to="0">聊天页</i>
      <i class="item" data-slide-to="1">群资料</i>
      <i class="item active" data-slide-to="2">身边页</i>
    </div>
    <div class="focus-page-wrap">
      <div class="focus-page" data-role="list" style="width: 500%; -webkit-transform: translate3d(-432px, 0px, 0px);">
        <div class="item" data-role="item" style="width: 20%;">
          <img src="http://stacdn201.ganjistatic1.com/att/project/app/group_intro/images/scene01.jpg" alt=""></div>
        <div class="item" data-role="item" style="width: 20%;">
          <img src="http://stacdn201.ganjistatic1.com/att/project/app/group_intro/images/scene02.jpg" alt=""></div>
        <div class="item" data-role="item" style="width: 20%;">
          <img src="http://stacdn201.ganjistatic1.com/att/project/app/group_intro/images/scene03.jpg" alt=""></div>
      </div>
    </div>
    <div class="focus-index">
      <i class="item" data-slide-to="0"></i>
      <i class="item" data-slide-to="1"></i>
      <i class="item active" data-slide-to="2"></i>
    </div>
  </div>
  <div class="column topic">
    <div class="column-head">
      <h2 class="column-title">更多活动</h2>
    </div>
    <div class="column-body">玩赶集群组，瓜分百万豪礼！更多福利活动即将开启！</div>
  </div>
  <div class="column test">
    <div class="column-head">
      <h2 class="column-title">内测开启</h2>
    </div>
    <div class="column-body">收到内测邀请的用户，可抢先体验，并有机会得好礼！</div>
  </div>
</section>
<footer class="footer">赶集网—最全的生活分类信息网</footer>
<div class="tip" style="display: none;"></div>