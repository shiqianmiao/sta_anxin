<section class="yxc-payment-bg pad-bot-comm">
    <div class="yxc-pay-main" data-widget="app/client/app/xiche/pub_page/view/red_packet_list.js#redPacketList">
        <header class="yxc-brand">
            <a class="arrow-wrapper"
                data-widget="app/client/app/xiche/pub_page/widget/widget#link"
                data-url="app/client/app/xiche/pub_page/view/profile.js"
            >
                <i class="bt-brand-back"></i>
            </a>
            <span>红包</span>
        </header>
        <% if (typeof list !== 'undefined' && list.length) { %>
        <div class="red-num">
            <div class="red-intro">
                <a href="javascript:;"
                    data-widget="app/client/app/xiche/pub_page/widget/widget#link"
                    data-url="app/client/app/xiche/pub_page/view/red_packet_instructions.js"
                >使用说明</a>
            </div>
            <em>¥</em><%= total_balance %>
            <p>您可在下单过程选择要使用的红包</p>
        </div>
        <% } else { %>
        <div class="red-intro">
            <a href="javascript:;"
                data-widget="app/client/app/xiche/pub_page/widget/widget#link"
                data-url="app/client/app/xiche/pub_page/view/red_packet_instructions.js"
            >使用说明</a></div>
        <% } %>

        <% if (typeof list === 'undefined' || !list.length) { %>
        <div class="icon-big-red"></div>
        <a href="javascript:;"
            data-widget="app/client/app/xiche/pub_page/widget/widget#link"
            <% if(isXmhy) { %>
            data-url="http://3g.ganji.com/bj_clife/activity/red_package/?ca_s=xmhy"
            <% } else { %>
            data-url="http://3g.ganji.com/bj_clife/activity/red_package/"
            <% } %>
            class="bt-sub-eveal bt-join-in"
        >参加活动领取红包</a>
        <div class="tips-my-red">
          <em>还没抢到红包</em><br>
          1.洗车完成可以获得红包<br>
          2.参与抢红包活动
        </div>
        <% } else { %>
            <div data-role="list">
            <% list.forEach(function (item) { %>
                <div class="red-common">
                  <div class="red-comm-left">
                      <h3><%= item.title %></h3>
                      <span><%= item.expires_time_text %></span>
                      <em><%= item.record_time_text %></em>
                  </div>
                  <% if (parseInt(item.price) >= 0) { %>
                      <span class="red-comm-right">+<%= item.price %></span>
                  <% } else { %>
                      <span class="red-comm-right red-minus"><%= item.price %></span>
                  <% } %>
                </div>
            <% }) %>
            </div>
        <% } %>
    </div>
    <div class="car-info-fixed">
      <em>©赶集易洗车2015</em>
      <span>客服电话：<a href="tel:4007335500" class="bt-telphone">4007-335-500</a></span>
    </div>
</section>