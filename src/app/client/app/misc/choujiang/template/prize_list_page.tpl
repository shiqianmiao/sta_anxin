<div class="addr-box prize-box">
    <p class="congra">
        我的奖品<br>
        <span><%= data.userInfo.name %></span>你好，你获得的每日抽奖奖品：
    </p>
    <div class="prize-table" id="list"
        data-widget="app/client/app/misc/choujiang/view/prize_list_page.js#list"
        data-user-id="<%= data.userInfo.user_id %>"
    >
        <table >
            <thead>
                <tr>
                    <th width="30%">奖品</th>
                    <th width="25%">兑换日期</th>
                    <th width="45%">兑换码</th>
                </tr>
            </thead>
            <tbody data-role="listWrap">
                <% if (data.list) { %>
                    <% data.list.forEach(function (item) { %>
                        <tr>
                            <td><%= item.name %></td>
                            <td><%= item.bought_date %></td>
                            <td><%= item.product_code || '无' %></td>
                        </tr>
                    <% }); %>
                <% } else { %>
                    <tr>
                        <td>无</td>
                        <td>无</td>
                        <td>无</td>
                    </tr>
                <% } %>
            </tbody>
        </table>
        <div class="page-box"
            data-widget="app/client/app/misc/choujiang/view/prize_list_page.js#page"
            data-page-number="<%= data.page || 1 %>"
            data-user-id="data.userInfo.user_id"
            data-page-count="<%=data.total_page%>"
        >
            <a class="prev" href="javascript:;" >上一页</a>
            <a class="active" href="javascript:;">1</a>
            <a class="next" href="javascript:;">下一页</a>
        </div>
    </div>
</div>

<div class="send-addr" data-widget="app/client/app/misc/choujiang/view/prize_list_page.js#modAddress">
    <span>邮寄地址：</span><em>未填写</em>
    <a href="javascript:;" data-role="modAddress" data-is-mod="1" class="green-link">去填写</a>
</div>
<div class="rule-list">
    <div class="rule-list">
        <div class="tit2">
            使用规则
        </div>
        <p>在赶集生活APP的首页中，点击左下方【积分】，进入积分商城。在积分商城中，可以用积分兑换各种豪华大礼！</p>
        <br>

        <h3 class="tit2">流量包使用说明：</h3>
        <p>
            1、抽中后根据绑定手机号所属运营商不同，将分别充值不同大小的流量包，具体为移动30兆、联通50兆、电信30兆；<br>
            2、流量将充值给参与活动赶集帐号所绑定的手机号，若由于未绑定无法充值，造成的损失由用户自己承担；<br>
            3、为保证获奖用户利益，流量包将在活动结束后的次月月初（5月8日前）统一充值，并在当月月底失效，请获奖用户在当月使用完毕；<br>
            4、获奖用户请保证手机号状态正常可用，若由于紧急停机（挂失）、欠费停机、停机保号等非正常状态导致充值失败，造成损失请自行承担。<br>
        </p>
    </div>
</div>
<footer>
    赶集网—最全的生活分类信息网
</footer>