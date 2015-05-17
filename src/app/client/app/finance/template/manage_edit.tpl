<!-- section start -->
<section class="case-status">
    <div class="tab horizontal">
        <div class="tab-wrap">
            <div class="tab-list" data-widget="com/mobile/widget/tab.js">
                <a class="tab-item active" data-role="tabTitle" data-for="#content_status01">资质不符</a>
                <a class="tab-item" data-role="tabTitle" data-for="#content_status02">无效电话</a>
                <a class="tab-item" data-role="tabTitle" data-for="#content_status03">客户放弃</a>
                <a class="tab-item" data-role="tabTitle" data-for="#content_status04">进件审批</a>
                <a class="tab-item" data-role="tabTitle" data-for="#content_status05">审批被拒</a>
                <a class="tab-item" data-role="tabTitle" data-for="#content_status06">审批通过</a>
                <a class="tab-item" data-role="tabTitle" data-for="#content_status07">放款失败</a>
                <a class="tab-item" data-role="tabTitle" data-for="#content_status08">放款通过</a>
            </div>
        </div>
        <div class="tab-wrap">
            <input type="hidden" id="userId" value="<%= user_id %>">
            <input type="hidden" id="caseId" value="<%= case_id %>">
            <div class="tab-content active" id="content_status01">
                <div class="form-widget" data-widget="app/client/app/finance/widget/loan.js#manageSaveLog" data-order-status="2">
                    <div class="form-group basic-group" data-role="contents">
                        <div class="form-field">
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck01" value="信用记录差">
                                <span>信用记录差</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck01" value="信用白户">
                                <span>信用白户</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck01" value="负债比例高">
                                <span>负债比例高</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck01" value="行业不符">
                                <span>行业不符</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck01" value="无工资流水">
                                <span>无工资流水</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck01" value="年龄不符">
                                <span>年龄不符</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck01" value="收入/流水过低">
                                <span>收入/流水过低</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck01" value="本地无房产">
                                <span>本地无房产</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck01" value="房屋按揭/抵押中">
                                <span>房屋按揭/抵押中</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck01" value="车辆按揭/抵押中">
                                <span>车辆按揭/抵押中</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck01" value="其他">
                                <span>其他</span>
                            </label>
                        </div>
                        <div class="form-field">
                            <label class="input-group">
                                <input data-role="input" type="text" class="input-text" placeholder="上面都没有，在这里说两句吧">
                            </label>
                        </div>
                    </div>
                    <div class="form-opt">
                        <button data-role="save" type="button" class="btn btn-primary btn-large js-touch-state">保存</button>
                    </div>
                </div>
            </div>
            <div class="tab-content" id="content_status02">
                <div class="form-widget" data-widget="app/client/app/finance/widget/loan.js#refund" data-order-status="3">
                    <div class="form-group basic-group">
                        <div class="form-field" data-role="contents">
                            <label class="radio-group">
                                <input type="radio" name="rd01" value="异地客户">
                                <span>异地客户</span>
                            </label>
                            <label class="radio-group">
                                <input type="radio" name="rd01" value="无法接通">
                                <span>无法接通</span>
                            </label>
                            <label class="radio-group">
                                <input type="radio" name="rd01" value="中介/同行试用">
                                <span>中介/同行试用</span>
                            </label>
                            <label class="radio-group">
                                <input type="radio" name="rd01" value="重复用户">
                                <span>重复用户</span>
                            </label>
                            <label class="radio-group">
                                <input type="radio" name="rd01" value="非本人恶意申请">
                                <span>非本人恶意申请</span>
                            </label>
                        </div>
                        <div class="form-field">
                            <label class="input-group">
                                <input data-role="input" type="text" class="input-text" placeholder="一句话没说明白，多说两句吧">
                            </label>
                        </div>
                    </div>
                    <div class="form-opt">
                        <button data-role="save" type="button" class="btn btn-primary btn-large js-touch-state">提交审核</button>
                    </div>
                    <p class="cotnent_extra">提示：如果您遇到以上5种情况，不要上火，稍安勿燥，货多多可以支持退款申请哦，绝不让您多花一分冤枉钱。</p>
                </div>
            </div>
            <div class="tab-content" id="content_status03">
                <div class="form-widget" data-widget="app/client/app/finance/widget/loan.js#manageSaveLog" data-order-status="4">
                    <div class="form-group basic-group">
                        <div class="form-field" data-role="contents">
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck02" value="利息高">
                                <span>利息高</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck02" value="额度少">
                                <span>额度少</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck02" value="嫌麻烦">
                                <span>嫌麻烦</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck02" value="已自筹">
                                <span>已自筹</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck02" value="不需要了">
                                <span>不需要了</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck02" value="其他平台">
                                <span>其他平台</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck02" value="其他">
                                <span>其他</span>
                            </label>
                        </div>
                        <div class="form-field">
                            <label class="input-group">
                                <input data-role="input" type="text" class="input-text" placeholder="上面都没有，在这里说两句吧">
                            </label>
                        </div>
                    </div>
                    <div class="form-opt">
                        <button data-role="save" type="button" class="btn btn-primary btn-large js-touch-state">保存</button>
                    </div>
                </div>
            </div>
            <div class="tab-content" id="content_status04">
                <div class="form-widget" data-widget="app/client/app/finance/widget/loan.js#manageSaveLog" data-order-status="5">
                    <div class="form-group basic-group">
                        <div class="form-field">
                            <label class="textarea-group">
                                <textarea data-role="input"  rows="" cols="" class="textarea" placeholder="在这里说两句吧"></textarea>
                            </label>
                        </div>
                    </div>
                    <div class="form-opt">
                        <button data-role="save" type="button" class="btn btn-primary btn-large js-touch-state">保存</button>
                    </div>
                </div>
            </div>
            <div class="tab-content" id="content_status05">
                <div class="form-widget" data-widget="app/client/app/finance/widget/loan.js#manageSaveLog" data-order-status="6">
                    <div class="form-group basic-group">
                        <div class="form-field" data-role="contents">
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck03" value="信用记录差">
                                <span>信用记录差</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck03" value="信用白户">
                                <span>信用白户</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck03" value="负债比例高">
                                <span>负债比例高</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck03" value="行业不符">
                                <span>行业不符</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck03" value="无工资流水">
                                <span>无工资流水</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck03" value="年龄不符">
                                <span>年龄不符</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck03" value="收入/流水过低">
                                <span>收入/流水过低</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck03" value="本地无房产">
                                <span>本地无房产</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck03" value="房屋按揭/抵押中">
                                <span>房屋按揭/抵押中</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck03" value="车辆按揭/抵押中">
                                <span>车辆按揭/抵押中</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" name="ck03" value="其他">
                                <span>其他</span>
                            </label>
                        </div>
                        <div class="form-field">
                            <label class="input-group">
                                <input data-role="input" type="text" class="input-text" placeholder="上面都没有，在这里说两句吧">
                            </label>
                        </div>
                    </div>
                    <div class="form-opt">
                        <button data-role="save" type="button" class="btn btn-primary btn-large js-touch-state">保存</button>
                    </div>
                </div>
            </div>
            <div class="tab-content" id="content_status06">
                <form class="form-widget" data-disabled-submit="1" data-order-status="7" data-config-id="validatorConfig1" data-widget="app/client/app/finance/widget/loan.js#submitManagerLog">
                    <div id="validatorConfig1"></div>
                    <div class="form-group">
                        <div class="form-field" data-widget="app/client/app/finance/widget/template.js#inputField" data-role="field" data-name="allow_loan_time">
                            <div class="form-item">
                                <label class="form-label">通过时间</label>
                                <div class="form-control">
                                    <div class="filter-group multi-group" data-role="childSelect" data-widget="app/client/app/finance/widget/loan.js#showSelect">
                                        <div data-widget="app/client/app/finance/widget/loan.js#datePicker">
                                            <div class="filter-tips" data-role="text">请选择</div>
                                            <input type="hidden" data-role="input" name="allow_loan_time">
                                            <div class="filter-cont no-animation">
                                                <div class="filter-head">
                                                    <h2 class="filter-title">通过时间</h2>
                                                    <button class="filter-opt js-touch-state" data-role="cancel">取消</button>
                                                    <button class="filter-opt js-touch-state" data-role="confirm">确定</button>
                                                </div>
                                                <div class="filter-body flex">
                                                    <div class="filter-wrap" data-role="years">
                                                        <ul class="filter-menu">
                                                            <li class="js-touch-state" data-year="2014">2014年</li>
                                                            <li class="js-touch-state" data-year="2015">2015年</li>
                                                            <li class="js-touch-state" data-year="2016">2016年</li>
                                                        </ul>
                                                    </div>
                                                    <div class="filter-wrap" data-role="months">
                                                        <ul class="filter-menu">
                                                            <li class="js-touch-state" data-month="01">01月</li>
                                                            <li class="js-touch-state" data-month="02">02月</li>
                                                            <li class="js-touch-state" data-month="03">03月</li>
                                                            <li class="js-touch-state" data-month="04">04月</li>
                                                            <li class="js-touch-state" data-month="05">05月</li>
                                                            <li class="js-touch-state" data-month="06">06月</li>
                                                            <li class="js-touch-state" data-month="07">07月</li>
                                                            <li class="js-touch-state" data-month="08">08月</li>
                                                            <li class="js-touch-state" data-month="09">09月</li>
                                                            <li class="js-touch-state" data-month="10">10月</li>
                                                            <li class="js-touch-state" data-month="11">11月</li>
                                                            <li class="js-touch-state" data-month="12">12月</li>
                                                        </ul>
                                                    </div>
                                                    <div class="filter-wrap" data-role="days">
                                                    <ul class="filter-menu"></ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mask" data-role="cancel"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-field" data-widget="app/client/app/finance/widget/template.js#inputField" data-role="field" data-name="allow_loan_money">
                        <div class="form-item">
                            <label class="form-label">通过金额</label>
                            <div class="form-control">
                                <div class="multi-group">
                                    <label class="input-group">
                                        <input class="input-text" data-role="input" name="allow_loan_money" type="number" pattern="\\d*" placeholder="">
                                    </label>
                                    <div class="form-text"><b>万元</b></div>
                                </div>
                            </div>
                            <div class="form-warning" data-role="tipSpan"></div>
                        </div>
                    </div>
                    <div class="form-field" data-widget="app/client/app/finance/widget/template.js#inputField" data-role="field" data-name="allow_loan_count">
                        <div class="form-item">
                            <label class="form-label">通过期数</label>
                            <div class="form-control">
                                <div class="multi-group">
                                    <label class="input-group">
                                        <input class="input-text" data-role="input" name="allow_loan_count"  type="number" pattern="\\d*" placeholder="">
                                    </label>
                                    <div class="form-text"><b>期</b></div>
                                </div>
                            </div>
                            <div class="form-warning" data-role="tipSpan"></div>
                        </div>
                    </div>
                </div>
                <div class="form-group basic-group">
                    <div class="form-field">
                        <label class="input-group">
                            <input type="text" data-role="input" name="other" class="input-text" placeholder="其它">
                        </label>
                    </div>
                </div>
                <div class="form-opt">
                    <button type="submit" data-role="save2" class="btn btn-primary btn-large js-touch-state">保存</button>
                </div>
            </form>
        </div>
        <div class="tab-content" id="content_status07">
            <div class="form-widget" data-widget="app/client/app/finance/widget/loan.js#manageSaveLog" data-order-status="8">
                <div class="form-group basic-group">
                    <div class="form-field">
                        <label class="textarea-group">
                            <textarea data-role="input" rows="" cols="" class="textarea" placeholder="在这里说两句吧"></textarea>
                        </label>
                    </div>
                </div>
                <div class="form-opt">
                    <button data-role="save" type="button" class="btn btn-primary btn-large js-touch-state">保存</button>
                </div>
            </div>
        </div>
        <div class="tab-content" id="content_status08">
            <form class="form-widget" data-disabled-submit="1" data-order-status="9" data-config-id="validatorConfig2" data-widget="app/client/app/finance/widget/loan.js#submitManagerLog">
                <div id="validatorConfig2"></div>
                <div class="form-group">
                    <div class="form-field" data-widget="app/client/app/finance/widget/template.js#inputField" data-role="field" data-name="send_loan_time">
                        <div class="form-item">
                            <label class="form-label">放款时间</label>
                            <div class="form-control">
                                <div class="filter-group multi-group" data-role="childSelect" data-widget="app/client/app/finance/widget/loan.js#showSelect">
                                    <div data-widget="app/client/app/finance/widget/loan.js#datePicker">
                                        <div class="filter-tips" data-role="text">请选择</div>
                                        <input type="hidden" data-role="input" name="send_loan_time">
                                        <div class="filter-cont no-animation">
                                            <div class="filter-head">
                                                <h2 class="filter-title">通过时间</h2>
                                                <button class="filter-opt js-touch-state" data-role="cancel">取消</button>
                                                <button class="filter-opt js-touch-state" data-role="confirm">确定</button>
                                            </div>
                                            <div class="filter-body flex">
                                                <div class="filter-wrap" data-role="years">
                                                    <ul class="filter-menu">
                                                        <li class="js-touch-state" data-year="2014">2014年</li>
                                                        <li class="js-touch-state" data-year="2015">2015年</li>
                                                        <li class="js-touch-state" data-year="2016">2016年</li>
                                                    </ul>
                                                </div>
                                                <div class="filter-wrap" data-role="months">
                                                    <ul class="filter-menu">
                                                        <li class="js-touch-state" data-month="01">01月</li>
                                                        <li class="js-touch-state" data-month="02">02月</li>
                                                        <li class="js-touch-state" data-month="03">03月</li>
                                                        <li class="js-touch-state" data-month="04">04月</li>
                                                        <li class="js-touch-state" data-month="05">05月</li>
                                                        <li class="js-touch-state" data-month="06">06月</li>
                                                        <li class="js-touch-state" data-month="07">07月</li>
                                                        <li class="js-touch-state" data-month="08">08月</li>
                                                        <li class="js-touch-state" data-month="09">09月</li>
                                                        <li class="js-touch-state" data-month="10">10月</li>
                                                        <li class="js-touch-state" data-month="11">11月</li>
                                                        <li class="js-touch-state" data-month="12">12月</li>
                                                    </ul>
                                                </div>
                                                <div class="filter-wrap" data-role="days">
                                                <ul class="filter-menu"></ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mask" data-role="cancel"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-field" data-widget="app/client/app/finance/widget/template.js#inputField" data-role="field" data-name="send_loan_money">
                    <div class="form-item">
                        <label class="form-label">放款金额</label>
                        <div class="form-control">
                            <div class="multi-group">
                                <label class="input-group">
                                    <input class="input-text" data-role="input" name="send_loan_money" type="number" pattern="\\d*" placeholder="">
                                </label>
                                <div class="form-text"><b>万元</b></div>
                            </div>
                        </div>
                        <div class="form-warning" data-role="tipSpan"></div>
                    </div>
                </div>
                <div class="form-field" data-widget="app/client/app/finance/widget/template.js#inputField" data-role="field" data-name="send_loan_count">
                    <div class="form-item">
                        <label class="form-label">放款期数</label>
                        <div class="form-control">
                            <div class="multi-group">
                                <label class="input-group">
                                    <input class="input-text" data-role="input" name="send_loan_count"  type="number" pattern="\\d*" placeholder="">
                                </label>
                                <div class="form-text"><b>期</b></div>
                            </div>
                        </div>
                        <div class="form-warning" data-role="tipSpan"></div>
                    </div>
                </div>
            </div>
            <div class="form-group basic-group">
                <div class="form-field">
                    <label class="input-group">
                        <input type="text" data-role="input" name="other" class="input-text" placeholder="其它">
                    </label>
                </div>
            </div>
            <div class="form-opt">
                <button type="submit" data-role="save2" class="btn btn-primary btn-large js-touch-state">保存</button>
            </div>
        </form>
    </div>
</div>
</div>

<div id="confirm">
    <div class="popup popup-confirm popup-refund" style="margin-top: -77px;">
        <div class="popup-head">
            <h2>提示</h2>
        </div>
        <div class="popup-body">
            <p>提交申请后，将有客服跟进核实，24小时内反馈结果，请耐心等待。</p>
        </div>
        <div class="popup-bar">
            <a href="javascript:;" data-role="cancel">取消</a>
            <a href="javascript:;" data-role="confirm">确定提交</a>
        </div>
    </div>
    <div class="mask" data-role="mask"></div>
</div>
</section>