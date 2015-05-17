<div data-widget="app/client/app/myad/view/extension-buy.js#form">
  <div id="buy">
    <div data-role="selectBox" class="js-box">
      <div class="pos-fixed">
        <%if(!hideTitle){%>
        <div class="green_t1 clear"><a data-role="back" href="javascript:void(0)" class="iconLeft"><i></i></a>智能推广购买</div>
        <%}%>
        <div class="zdBox">
          <div class="zding">
            <div class="sl">推广信息</div>
            <div class="sr3"><a class="titleName" href="javascript:void(0);"><%= data.post_title %></a></div>
          </div>
          <% if (data.is_modify === 0) {%>
          <div class="zding">
            <div class="sl">推广类型</div>
            <div class="sr4 exten-type">
             <p class="extend-puton" data-role="major" data-major="<%=data.all_major.major_id%>"><span class="js-round round_on" data-major="<%=data.all_major.major_id%>"></span><%= data.all_major.major_name %></p>
             <p class="extend-puton" data-role="major" data-major="<%=data.self_major.major_id%>"><span class="js-round round_default" data-major="<%=data.self_major.major_id%>"></span><%= data.self_major.major_name %></p>
             </div>
          </div>
          <div class="zding">
            <div class="sl">推广城市</div>
            <div class="sr4 exten-type">
             <p class="extend-puton" data-role="city" data-city="<%=data.all_city.city_id%>"><span class="js-round round_on" data-city="<%=data.all_city.city_id%>"></span><%= data.all_city.city_name %></p>

             <p class="extend-puton" data-role="city" data-city="<%=data.self_city.city_id%>"><span class="js-round round_default" data-city="<%=data.self_city.city_id%>"></span><%= data.self_city.city_name %></p>
            </div>
          </div>
          <% } else { %>
          <div class="zding">
            <div class="sl">推广类型</div>
            <div class="sr4 exten-type"><%= data.majors[0].major_name %><%if(data.majors.length > 1){%>...<%}%></div>
          </div>
          <div class="zding">
            <div class="sl">推广城市</div>
            <div class="sr4 exten-type"><%= data.cities[0].city_name %><%if(data.cities.length > 1){%>...<%}%></div>
          </div>
          <%}%>
          <div class="zding">
            <div class="sl">出价</div>
            <div class="sr4">
              <input type="number" data-role="unitPrice" class="extend-bid" value="<%= data.unit_price || data.suggest_price %>"><span class="extend-sug-price">建议出价 : <%= data.suggest_price %>元/点击</span>
              <p class="extend-txt-tip">推广出价越高,展现机会越大,位置越好。</p>
            </div>
          </div>
          <div class="zding">
            <div class="sl">预算</div>
            <div class="sr4">
              <p class="budget-wrap">
               <span class="bt-budget bt-budget<%if (data.budget == 50){%>-on<%}%>" data-amount="50" data-role="budget">50元</span>
               <span class="bt-budget bt-budget<%if (data.budget == 100 || data.budget == 0){%>-on<%}%>" data-amount="100" data-role="budget">100元</span>
               <span class="bt-budget bt-budget<%if (data.budget == 150){%>-on<%}%>" data-amount="150" data-role="budget">150元</span>
              </p>
              <p>其他金额 <input type="number" data-role="budgetInput" class="extend-bid" value="<%= data.budget || 100 %>"> 元</p>
              <p class="extend-checkbox" data-role="autoRenew">
               <label><i class="check-default check <%if(data.auto_renew){%>check-on<%}%>"></i><span>自动续费（每次预算消耗完时，自动增加预算 <i data-role="renewBudget"><%= data.budget || 100 %></i> 元）</span></label>
              </p>
            </div>
          </div>

        </div>
        <!--zdBox e-->
        <div class="grayBox2"></div>

        <div class="zdBox">
          <div class="zding">
            <div class="sl">优惠折扣</div>
            <div class="sr3">
                <span class="vouchar1"><!--<i class="fc_org">-32.8</i>元-->
                  <i class="voucher" data-role="voucher" <% if (!data.coupon.code){%>style="display:none;"<%}%>>
                  <%if (data.coupon.code) {%>
                  <%= (parseFloat(data.coupon.amount) * 10).toFixed(1) %>折<% if (data.coupon.use_range_limit == 1) {%>账户型<%}else{%>订单型<%}%>折扣券
                  <%}%>
                  </i>
                </span>
                <a href="javascript:;" data-role="coupon" class="more-voucher use-voucher fr">使用优惠券</a>
            </div>
          </div>
          <div class="zding">
            <div class="sl">可用余额</div>
            <div class="sr3">
              <a href="javascript:void(0)"><%= data.user_balance %>元</a>
              <div class="fr"><span class="round_on"></span></div>
            </div>
          </div>
        </div>
        <div class="use-banance">
            <!--<p class="extend-checkbox">
             <label><i class="check-default check-on"></i><span>使用账户余额</span></label>
            </p>-->
        </div>

      </div>

      <div class="cp_text11 clear">
        <div class="fl" data-role="payAmountBox"><span class="s1">需支付金额：<span class="fc_org" data-role="payAmount"><%= amount %></span>元</span></div>
        <div class="fr"><input type="button" class="btn_zhifu" value="确认并支付" data-role="stickySubmit" data-code="<%= code %>"></div>
      </div>
    </div>
  </div>
  <div id="coupon" style="display:none;">

    <div data-role="youhuiBox" class="js-box">
      <%if(!hideTitle){%>
      <div class="green_t1 clear"><span class="iconLeft js-back" data-role="couponBack"><i></i></span>使用优惠券</div>
      <%}%>
      <% if (data.coupon_list.length){%>
      <div class="gray_t1">可用优惠券</div>
      <div class="cpBox">
          <% var found = _.find(data.coupon_list, function (item) { return item.code === code }); %>
          <% _.each(data.coupon_list, function(item, index){%>
              <div class="cplist  clear" data-role="cplist">
                  <div class="cpl"><span class="cp_text1"><%= (parseFloat(item.amount) * 10).toFixed(1) %>折<% if (item.use_range_limit == 1) {%>账户型<%}else{%>订单型<%}%>折扣券</span></div>
                  <div class="cpr">
                      <span
                        <% if ((!found && !index) || (found && found.code === item.code)) { %>
                        class="js-round round_default round_on"
                        <% } else { %>
                        class="js-round round_default"
                        <% } %>
                        data-role="couponCheck"
                        data-amount="<%= item.amount %>"
                        data-start="<%= item.start_day %>"
                        data-end="<%= item.end_time %>"
                        data-coupon="<%= JSON.stringify(item) %>"
                        data-code="<%= item.code %>"
                      ></span></div>
              </div>
          <%});%>
      </div>
      <%}%>
      <!-- cpBox e-->
        <div class="gray_t1 border-top">请使用优惠劵码</div>
        <div class="cplist last clear" data-role="cplist">
          <div class="cpBox">
          <div class="cpl"><input data-role="couponInput" type="text" class="add-node" placeholder="请输入您收到的优惠券编码" data-role="youhuiCodeIpt"></div>
          <div class="cpr"><span class="js-round round_default input_coupon <%if(!data.coupon_list.length){%>round_on<%}%>" data-role="couponCheck"></span></div>
          </div>
        </div>
        <div class="coupon-txt" data-role="couponText">
          <%= couponText %></div>
    </div>
    <div class="btnBox"><a class="a_use" href="javascript:void(0);" data-role="useCoupon">确 定</a></div>
  </div>
</div>