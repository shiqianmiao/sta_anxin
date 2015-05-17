<!-- section start -->
<section class="level">
    <div class="mod-column data">
        <div class="column-body">
            <div class="mod-list">
                <div class="list-item">
                    <div class="mod-level"><i class="icon icon-octagonal"><%= data.level %></i></div>
                    <h3 class="list-title">当前等级:Lv<%= data.level %></h3>
                </div>
                <div class="list-item">
                    <div class="mod-progress">
                        <ul class="progress-degree">
                            <li>
                                <span class="lv">1级</span>
                                <span class="value">0</span>
                            </li>
                            <li>
                                <span class="lv">2级</span>
                                <span class="value">7</span>
                            </li>
                            <li>
                                <span class="lv">3级</span>
                                <span class="value">60</span>
                            </li>
                            <li>
                                <span class="lv">4级</span>
                                <span class="value">90</span>
                            </li>
                            <li>
                                <span class="lv">5级</span>
                                <span class="value">180</span>
                            </li>
                        </ul>
                        <div class="progress-rate" style="width: <%= width %>%"></div>
                    </div>
                    <h3 class="list-title">当前活跃值:<%= data.activeDegree %></h3>
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
                        <th>群人数上限</th>
                        <th>协管人数上线</th>
                    </tr>
                    <tr>
                        <td>Lv1</td>
                        <td>0</td>
                        <td>20</td>
                        <td>1</td>
                    </tr>
                    <tr>
                        <td>Lv2</td>
                        <td>7</td>
                        <td>30</td>
                        <td>2</td>
                    </tr>
                    <tr>
                        <td>Lv3</td>
                        <td>60</td>
                        <td>50</td>
                        <td>4</td>
                    </tr>
                    <tr>
                        <td>Lv4</td>
                        <td>90</td>
                        <td>100</td>
                        <td>6</td>
                    </tr>
                    <tr>
                        <td>Lv5</td>
                        <td>180</td>
                        <td>200</td>
                        <td>10</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <div class="mod-column rule">
        <div class="column-head">
            <h2 class="column-title">如何增加经验值：</h2>
        </div>
        <div class="column-body">
            <ol class="mod-list">
                <li class="list-item">1. 本群1/4及其以上的用户在今天有活跃则本群获得1群经验值</li>
                <li class="list-item">2. 5人以下群，获得群经验值为0</li>
                <li class="list-item">3. 群被降级之后该群已加入的人不受影响，已被设置为管理员的人不受影响，重新加入或者重新任命管理员时要与当前等级匹配</li>
            </ol>
        </div>
    </div>
</section>