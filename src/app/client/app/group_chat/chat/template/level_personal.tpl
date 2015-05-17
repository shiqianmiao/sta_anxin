<!-- section start -->
<section class="level">
    <div class="mod-column data">
        <div class="column-body">
            <div class="mod-list">
                <div class="list-item">
                    <% if (showTips) {%>
                        <div class="tips">您需要提升等级才可以创建群组</div>                    
                    <% } else {%>
                        <div class="mod-level"><i class="icon icon-star"><%= data.activeLevel %></i></div>
                        <h3 class="list-title">当前等级:Lv<%= data.activeLevel %></h3>
                    <%}%>
                </div>
                <div class="list-item">
                    <div class="mod-progress">
                        <ul class="progress-degree">
                            <li>
                                <span class="lv">1级</span>
                                <span class="value">1</span>
                            </li>
                            <li>
                                <span class="lv">2级</span>
                                <span class="value">28</span>
                            </li>
                            <li>
                                <span class="lv">3级</span>
                                <span class="value">240</span>
                            </li>
                            <li>
                                <span class="lv">4级</span>
                                <span class="value">360</span>
                            </li>
                            <li>
                                <span class="lv">5级</span>
                                <span class="value">720</span>
                            </li>
                        </ul>
                        <div class="progress-rate" style="width: <%= width %>%"></div>
                    </div>
                    <h3 class="list-title">当前活跃值:<%= data.activeValue %></h3>
                </div>
            </div>
        </div>
    </div>
    <div class="mod-column catalog">
        <div class="column-head">
            <h2 class="column-title">等级权限说明：</h2>
        </div>
        <div class="column-body">
            <div class="mod-table">
                <table>
                    <tr>
                        <th>等级</th>
                        <th>经验值</th>
                        <th>加群申请上限</th>
                        <th>建群上限</th>
                        <th>打招呼次数</th>
                    </tr>
                    <tr>
                        <td>Lv1</td>
                        <td>1</td>
                        <td>10</td>
                        <td>1</td>
                        <td>10</td>
                    </tr>
                    <tr>
                        <td>Lv2</td>
                        <td>28</td>
                        <td>15</td>
                        <td>2</td>
                        <td>15</td>
                    </tr>
                    <tr>
                        <td>Lv3</td>
                        <td>240</td>
                        <td>20</td>
                        <td>4</td>
                        <td>20</td>
                    </tr>
                    <tr>
                        <td>Lv4</td>
                        <td>360</td>
                        <td>25</td>
                        <td>6</td>
                        <td>25</td>
                    </tr>
                    <tr>
                        <td>Lv5</td>
                        <td>720</td>
                        <td>30</td>
                        <td>10</td>
                        <td>30</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <div class="mod-column rule">
        <div class="column-head">
            <h2 class="column-title">群组特权说明：</h2>
        </div>
        <div class="column-body">
            <ol class="mod-list">
                <li class="list-item">1. 00:00-23:59打开赶集生活APP增加1活跃值，每天上限是1活跃值；</li>
                <li class="list-item">2. 在群中发送一次文本消息增加1活跃值，每天上限是3活跃值。</li>
            </ol>
        </div>
    </div>
</section>
<!-- section end -->