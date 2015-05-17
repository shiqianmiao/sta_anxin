<!-- section start -->
<section class="template">
    <form action="" id="form"
        data-widget="app/client/app/finance/widget/template.js#submitForm"
        data-disabled-submit="1"
        data-config-id="validatorConfig">
        <div class="form-widget">
            <div class="form-group">
                <div class="form-field" data-widget="app/client/app/finance/widget/template.js#inputField"  data-role="field" data-name="name">
                    <div class="form-item">
                        <label class="form-label">模版名称</label>
                        <div class="form-control" >
                            <label class="input-group">
                                <input name="name" data-role="input" value="<%= data.name || '' %>" type="text" class="input-text" placeholder="2-6个汉字或字母">
                            </label>
                        </div>
                        <div class="form-warning" data-role="tipSpan"></div>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">贷款类型</label>
                        <div class="form-control">
                            <div class="form-text">
                                <% if(data.type === "1") { %>个人贷款<% } else { %>企业贷款<% } %>
                            </div>
                            <input type="hidden" name="xd_type" value="<%= data.xd_type %>">
                        </div>
                    </div>
                </div>
                <div class="form-field" data-widget="app/client/app/finance/widget/template.js#mulitField">
                    <div class="form-item" >
                        <label class="form-label">贷款金额</label>
                        <div class="form-control">
                            <div class="multi-group">
                                <label class="input-group" data-widget="app/client/app/finance/widget/template.js#baseField"  data-role="field" data-name="loan_money_min">
                                    <input name="loan_money_min" pattern="\\d*" data-role="input" value="<%= data.loan_money_min || '' %>" class="input-text" type="number" placeholder="最少">
                                </label>
                                <div class="form-text">|</div>
                                <label class="input-group" data-widget="app/client/app/finance/widget/template.js#baseField"  data-role="field" data-name="loan_money_max">
                                    <input name="loan_money_max" pattern="\\d*" data-role="input" value="<%= data.loan_money_max || '' %>" class="input-text" type="number" placeholder="最多">
                                </label>
                                <div class="form-text"><b>万元</b></div>
                            </div>
                        </div>
                        <div class="form-warning" data-role="tipSpan"></div>
                    </div>
                </div>
                <div class="form-field" data-widget="app/client/app/finance/widget/template.js#mulitField">
                    <div class="form-item" >
                        <label class="form-label">贷款期限</label>
                        <div class="form-control">
                            <div class="multi-group">
                                <label class="input-group" data-widget="app/client/app/finance/widget/template.js#baseField"  data-role="field" data-name="loan_month_min">
                                    <input name="loan_month_min" pattern="\\d*" data-role="input" value="<%= data.loan_month_min || '' %>" class="input-text" type="number" placeholder="最少">
                                </label>
                                <div class="form-text">|</div>
                                <label class="input-group" data-widget="app/client/app/finance/widget/template.js#baseField"  data-role="field" data-name="loan_month_max">
                                    <input name="loan_month_max" pattern="\\d*" data-role="input" value="<%= data.loan_month_max || '' %>" class="input-text" type="number" placeholder="最多">
                                </label>
                                <div class="form-text"><b>月</b></div>
                            </div>
                        </div>
                    </div>
                    <div class="form-warning" data-role="tipSpan"></div>
                </div>
                <div class="form-field" data-widget="app/client/app/finance/widget/template.js#inputField"  data-role="field" data-name="loan_type">
                    <div class="form-item">
                        <label class="form-label">贷款方式</label>
                        <div class="form-control" >
                            <div class="filter-group" data-role="childSelect" data-widget="app/client/app/finance/widget/template.js#showSelect">
                                <div data-widget="app/client/app/finance/widget/template.js#checkSelect">
                                    <input data-role="input" name="loan_type" value="<%= data.loan_type || '-1' %>" type="hidden" />
                                    <div class="filter-tips" data-role="text">请选择</div>
                                    <div class="filter-cont">
                                        <div class="filter-head">
                                            <h2 class="filter-title">贷款方式</h2>
                                            <button class="filter-opt" data-role="cancel">取消</button>
                                            <button class="filter-opt" data-role="confirm">完成</button>
                                        </div>
                                        <div class="filter-wrap">
                                            <ul class="filter-menu">
                                                <li class="js-touch-state" data-value="-1">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>不限</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="1">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox">
                                                        <span>无抵押贷款</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="2">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox">
                                                        <span>车辆贷款</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="3">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox">
                                                        <span>房屋贷款</span>
                                                    </label>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="mask" data-role="cancel"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group" >
                <div class="form-field" data-widget="app/client/app/finance/widget/template.js#mulitField">
                    <div class="form-item" >
                        <label class="form-label">年  龄</label>
                        <div class="form-control">
                            <div class="multi-group">
                                <label class="input-group" data-widget="app/client/app/finance/widget/template.js#baseField"  data-role="field" data-name="age_min">
                                    <input name="age_min" pattern="\\d*" data-role="input" value="<%= data.age_min || '' %>" class="input-text" type="number" placeholder="最少">
                                </label>
                                <div class="form-text">|</div>
                                <label class="input-group" data-widget="app/client/app/finance/widget/template.js#baseField"  data-role="field" data-name="age_min">
                                    <input name="age_max" pattern="\\d*" data-role="input" value="<%= data.age_max || '' %>" class="input-text" type="number" placeholder="最多">
                                </label>
                                <div class="form-text"><b>岁</b></div>
                            </div>
                        </div>
                        <div class="form-warning" data-role="tipSpan"></div>
                    </div>
                </div>
                <div class="form-field" data-widget="app/client/app/finance/widget/template.js#inputField"  data-role="field" data-name="city_domain">
                    <div class="form-item" >
                        <label class="form-label">城　　市</label>
                        <div class="form-control" >
                            <div class="filter-group search-group city-group" data-role="childSelect" data-widget="app/client/app/finance/widget/template.js#showSelect">
                                <div data-widget="app/client/app/finance/widget/loan.js#searchCity">
                                    <input data-role="input" id="city_domain" name="city_domain" value="<%= data.city_domain || '' %>" type="hidden" />
                                    <div class="filter-tips <% if(data.city_domain) { %> active <% } %>" data-role="text"><%= data.city_name || '选择城市' %></div>
                                    <div class="filter-cont no-animation">
                                        <div class="filter-head">
                                            <button class="filter-opt" data-role="cancel">取消</button>
                                            <h2 class="filter-title">选择城市</h2>
                                        </div>
                                        <div class="filter-body js-filter">

                                            <div class="filter-wrap">
                                                <h3>当前定位城市</h3>
                                                <ul class="filter-menu" data-widget="app/client/app/finance/widget/loan.js#getLocationCity">
                                                    <li class="js-touch-state js-searched" data-value="bj,beijing" data-role="city">北京市</li>
                                                </ul>
                                                <h3>热门城市</h3>
                                                <ul class="filter-menu">
                                                    <li class="js-touch-state" data-value="bj,beijing">北京市</li>
                                                    <li class="js-touch-state" data-value="sh,shanghai">上海市</li>
                                                    <li class="js-touch-state" data-value="gz,guangzhou">广州市</li>
                                                    <li class="js-touch-state" data-value="sz,shenzhen">深圳市</li>
                                                    <li class="js-touch-state" data-value="cd,chengdu">成都市</li>
                                                </ul>
                                                <h3 class="search-title">搜索结果</h3>
                                                <h3 data-dict="A">A</h3>
                                                <ul class="filter-menu">
                                                    <li class="js-touch-state" data-value="aba,aba">阿坝藏族羌族自治州</li>
                                                    <li class="js-touch-state" data-value="akesu,akesu">阿克苏市</li>
                                                    <li class="js-touch-state" data-value="alaer,alaer">阿拉尔</li>
                                                    <li class="js-touch-state" data-value="alashan,alashan">阿拉善盟</li>
                                                    <li class="js-touch-state" data-value="aletai,aletai">阿勒泰市</li>
                                                    <li class="js-touch-state" data-value="ali,ali">阿里地区</li>
                                                    <li class="js-touch-state" data-value="ankang,ankang">安康市</li>
                                                    <li class="js-touch-state" data-value="anqing,anqing">安庆市</li>
                                                    <li class="js-touch-state" data-value="anshan,anshan">鞍山市</li>
                                                    <li class="js-touch-state" data-value="anshun,anshun">安顺市</li>
                                                    <li class="js-touch-state" data-value="anyang,anyang">安阳市</li>
                                                    <li class="js-touch-state" data-value="aomen,aomen">澳门自治区</li>
                                                </ul>
                                                <h3 data-dict="B">B</h3>
                                                <ul class="filter-menu">
                                                    <li class="js-touch-state" data-value="baicheng,baicheng">白城市</li>
                                                    <li class="js-touch-state" data-value="baise,baise">百色市</li>
                                                    <li class="js-touch-state" data-value="baishan,baishan">白山市</li>
                                                    <li class="js-touch-state" data-value="baiyin,baiyin">白银市</li>
                                                    <li class="js-touch-state" data-value="baoding,baoding">保定市</li>
                                                    <li class="js-touch-state" data-value="baoji,baoji">宝鸡市</li>
                                                    <li class="js-touch-state" data-value="baoshan,baoshan">保山市</li>
                                                    <li class="js-touch-state" data-value="baotou,baotou">包头市</li>
                                                    <li class="js-touch-state" data-value="bayannaoer,bayannaoer">巴彦淖尔市</li>
                                                    <li class="js-touch-state" data-value="bayinguoleng,bayinguoleng">巴音郭楞蒙古自治州</li>
                                                    <li class="js-touch-state" data-value="bazhong,bazhong">巴中市</li>
                                                    <li class="js-touch-state" data-value="beihai,beihai">北海市</li>
                                                    <li class="js-touch-state" data-value="bj,beijing">北京市</li>
                                                    <li class="js-touch-state" data-value="bengbu,bengbu">蚌埠市</li>
                                                    <li class="js-touch-state" data-value="benxi,benxi">本溪市</li>
                                                    <li class="js-touch-state" data-value="bijie,bijie">毕节地区</li>
                                                    <li class="js-touch-state" data-value="binzhou,binzhou">滨州市</li>
                                                    <li class="js-touch-state" data-value="boertala,boertala">博尔塔拉蒙古自治州</li>
                                                    <li class="js-touch-state" data-value="bozhou,bozhou">亳州市</li>
                                                </ul>
                                                <h3 data-dict="C">C</h3>
                                                <ul class="filter-menu">
                                                    <li class="js-touch-state" data-value="cangzhou,cangzhou">沧州市</li>
                                                    <li class="js-touch-state" data-value="cc,changchun">长春市</li>
                                                    <li class="js-touch-state" data-value="changde,changde">常德市</li>
                                                    <li class="js-touch-state" data-value="changdu,changdu">昌都地区</li>
                                                    <li class="js-touch-state" data-value="changji,changji">昌吉市</li>
                                                    <li class="js-touch-state" data-value="cs,changsha">长沙市</li>
                                                    <li class="js-touch-state" data-value="changzhi,changzhi">长治市</li>
                                                    <li class="js-touch-state" data-value="changzhou,changzhou">常州市</li>
                                                    <li class="js-touch-state" data-value="chaohu,chaohu">巢湖市</li>
                                                    <li class="js-touch-state" data-value="chaoyang,chaoyang">朝阳市</li>
                                                    <li class="js-touch-state" data-value="chaozhou,chaozhou">潮州市</li>
                                                    <li class="js-touch-state" data-value="chengde,chengde">承德市</li>
                                                    <li class="js-touch-state" data-value="cd,chengdu">成都市</li>
                                                    <li class="js-touch-state" data-value="chenzhou,chenzhou">郴州市</li>
                                                    <li class="js-touch-state" data-value="chifeng,chifeng">赤峰市</li>
                                                    <li class="js-touch-state" data-value="chizhou,chizhou">池州市</li>
                                                    <li class="js-touch-state" data-value="cq,chongqing">重庆市</li>
                                                    <li class="js-touch-state" data-value="chongzuo,chongzuo">崇左市</li>
                                                    <li class="js-touch-state" data-value="chuxiong,chuxiong">楚雄市</li>
                                                    <li class="js-touch-state" data-value="chuzhou,chuzhou">滁州市</li>
                                                </ul>
                                                <h3 data-dict="D">D</h3>
                                                <ul class="filter-menu">
                                                    <li class="js-touch-state" data-value="dali,dali">大理市</li>
                                                    <li class="js-touch-state" data-value="dl,dalian">大连市</li>
                                                    <li class="js-touch-state" data-value="dandong,dandong">丹东市</li>
                                                    <li class="js-touch-state" data-value="danzhou,danzhou">儋州市</li>
                                                    <li class="js-touch-state" data-value="daqing,daqing">大庆市</li>
                                                    <li class="js-touch-state" data-value="datong,datong">大同市</li>
                                                    <li class="js-touch-state" data-value="daxinganling,daxinganling">大兴安岭地区</li>
                                                    <li class="js-touch-state" data-value="dazhou,dazhou">达州市</li>
                                                    <li class="js-touch-state" data-value="dehong,dehong">德宏德宏傣族景颇族自治州</li>
                                                    <li class="js-touch-state" data-value="deyang,deyang">德阳市</li>
                                                    <li class="js-touch-state" data-value="dezhou,dezhou">德州市</li>
                                                    <li class="js-touch-state" data-value="dingxi,dingxi">定西县</li>
                                                    <li class="js-touch-state" data-value="diqing,diqing">迪庆迪庆藏族自治州</li>
                                                    <li class="js-touch-state" data-value="dg,dongguan">东莞市</li>
                                                    <li class="js-touch-state" data-value="dongying,dongying">东营市</li>
                                                </ul>
                                                <h3 data-dict="E">E</h3>
                                                <ul class="filter-menu">
                                                    <li class="js-touch-state" data-value="eerduosi,eerduosi">鄂尔多斯市</li>
                                                    <li class="js-touch-state" data-value="enshi,enshi">恩施州</li>
                                                    <li class="js-touch-state" data-value="ezhou,ezhou">鄂州市</li>
                                                </ul>
                                                <h3 data-dict="F">F</h3>
                                                <ul class="filter-menu">
                                                    <li class="js-touch-state" data-value="fangchenggang,fangchenggang">防城港市</li>
                                                    <li class="js-touch-state" data-value="foshan,foshan">佛山市</li>
                                                    <li class="js-touch-state" data-value="fushun,fushun">抚顺市</li>
                                                    <li class="js-touch-state" data-value="fuxin,fuxin">阜新市</li>
                                                    <li class="js-touch-state" data-value="fuyang,fuyang">阜阳市</li>
                                                    <li class="js-touch-state" data-value="fz,fuzhou">福州市</li>
                                                </ul>
                                                <h3 data-dict="G">G</h3>
                                                <ul class="filter-menu">
                                                    <li class="js-touch-state" data-value="gannan,gannan">甘南州</li>
                                                    <li class="js-touch-state" data-value="ganzhou,ganzhou">赣州市</li>
                                                    <li class="js-touch-state" data-value="ganzi,ganzi">甘孜藏族自治州</li>
                                                    <li class="js-touch-state" data-value="guangan,guangan">广安市</li>
                                                    <li class="js-touch-state" data-value="guangyuan,guangyuan">广元市</li>
                                                    <li class="js-touch-state" data-value="gz,guangzhou">广州市</li>
                                                    <li class="js-touch-state" data-value="guigang,guigang">贵港市</li>
                                                    <li class="js-touch-state" data-value="gl,guilin">桂林市</li>
                                                    <li class="js-touch-state" data-value="gy,guiyang">贵阳市</li>
                                                    <li class="js-touch-state" data-value="guoluo,guoluo">果洛州</li>
                                                    <li class="js-touch-state" data-value="guyuan,guyuan">固原市</li>
                                                </ul>
                                                <h3 data-dict="H">H</h3>
                                                <ul class="filter-menu">
                                                    <li class="js-touch-state" data-value="hrb,haerbin">哈尔滨市</li>
                                                    <li class="js-touch-state" data-value="haibei,haibei">海北州</li>
                                                    <li class="js-touch-state" data-value="haidong,haidong">海东地区</li>
                                                    <li class="js-touch-state" data-value="hn,haikou">海口市</li>
                                                    <li class="js-touch-state" data-value="hainanzhou,hainanzhou">海南州</li>
                                                    <li class="js-touch-state" data-value="haixi,haixi">海西州</li>
                                                    <li class="js-touch-state" data-value="hami,hami">哈密市</li>
                                                    <li class="js-touch-state" data-value="handan,handan">邯郸市</li>
                                                    <li class="js-touch-state" data-value="hz,hangzhou">杭州市</li>
                                                    <li class="js-touch-state" data-value="hanzhong,hanzhong">汉中市</li>
                                                    <li class="js-touch-state" data-value="hebi,hebi">鹤壁市</li>
                                                    <li class="js-touch-state" data-value="hechi,hechi">河池市</li>
                                                    <li class="js-touch-state" data-value="hf,hefei">合肥市</li>
                                                    <li class="js-touch-state" data-value="hegang,hegang">鹤岗市</li>
                                                    <li class="js-touch-state" data-value="heihe,heihe">黑河市</li>
                                                    <li class="js-touch-state" data-value="hengshui,hengshui">衡水市</li>
                                                    <li class="js-touch-state" data-value="hengyang,hengyang">衡阳市</li>
                                                    <li class="js-touch-state" data-value="hetian,hetian">和田市</li>
                                                    <li class="js-touch-state" data-value="heyuan,heyuan">河源市</li>
                                                    <li class="js-touch-state" data-value="heze,heze">菏泽市</li>
                                                    <li class="js-touch-state" data-value="hezhou,hezhou">贺州市</li>
                                                    <li class="js-touch-state" data-value="hljyichun,hljyichun">伊春市</li>
                                                    <li class="js-touch-state" data-value="honghe,honghe">红河县</li>
                                                    <li class="js-touch-state" data-value="huaian,huaian">淮安市</li>
                                                    <li class="js-touch-state" data-value="huaibei,huaibei">淮北市</li>
                                                    <li class="js-touch-state" data-value="huaihua,huaihua">怀化市</li>
                                                    <li class="js-touch-state" data-value="huainan,huainan">淮南市</li>
                                                    <li class="js-touch-state" data-value="huanggang,huanggang">黄冈市</li>
                                                    <li class="js-touch-state" data-value="huangnan,huangnan">黄南州</li>
                                                    <li class="js-touch-state" data-value="huangshan,huangshan">黄山市</li>
                                                    <li class="js-touch-state" data-value="huangshi,huangshi">黄石市</li>
                                                    <li class="js-touch-state" data-value="nmg,huhehaote">呼和浩特市</li>
                                                    <li class="js-touch-state" data-value="huizhou,huizhou">惠州市</li>
                                                    <li class="js-touch-state" data-value="huludao,huludao">葫芦岛市</li>
                                                    <li class="js-touch-state" data-value="hulunbeier,hulunbeier">呼伦贝尔市</li>
                                                    <li class="js-touch-state" data-value="huzhou,huzhou">湖州市</li>
                                                </ul>
                                                <h3 data-dict="I">I</h3>
                                                <ul class="filter-menu">
                                                </ul>
                                                <h3 data-dict="J">J</h3>
                                                <ul class="filter-menu">
                                                    <li class="js-touch-state" data-value="jiamusi,jiamusi">佳木斯市</li>
                                                    <li class="js-touch-state" data-value="jian,jian">吉安市</li>
                                                    <li class="js-touch-state" data-value="jiangmen,jiangmen">江门市</li>
                                                    <li class="js-touch-state" data-value="jiaozuo,jiaozuo">焦作市</li>
                                                    <li class="js-touch-state" data-value="jiaxing,jiaxing">嘉兴市</li>
                                                    <li class="js-touch-state" data-value="jiayuguan,jiayuguan">嘉峪关市</li>
                                                    <li class="js-touch-state" data-value="jieyang,jieyang">揭阳市</li>
                                                    <li class="js-touch-state" data-value="jilin,jilinshi">吉林市</li>
                                                    <li class="js-touch-state" data-value="jn,jinan">济南市</li>
                                                    <li class="js-touch-state" data-value="jinchang,jinchang">金昌市</li>
                                                    <li class="js-touch-state" data-value="jincheng,jincheng">晋城市</li>
                                                    <li class="js-touch-state" data-value="jingdezhen,jingdezhen">景德镇市</li>
                                                    <li class="js-touch-state" data-value="jingmen,jingmen">荆门市</li>
                                                    <li class="js-touch-state" data-value="jingzhou,jingzhou">荆州市</li>
                                                    <li class="js-touch-state" data-value="jinhua,jinhua">金华市</li>
                                                    <li class="js-touch-state" data-value="jining,jining">济宁市</li>
                                                    <li class="js-touch-state" data-value="jinzhong,jinzhong">晋中市</li>
                                                    <li class="js-touch-state" data-value="jinzhou,jinzhou">锦州市</li>
                                                    <li class="js-touch-state" data-value="jiujiang,jiujiang">九江市</li>
                                                    <li class="js-touch-state" data-value="jiuquan,jiuquan">酒泉市</li>
                                                    <li class="js-touch-state" data-value="jixi,jixi">鸡西市</li>
                                                    <li class="js-touch-state" data-value="jiyuan,jiyuan">济源市</li>
                                                    <li class="js-touch-state" data-value="jstaizhou,jstaizhou">泰州市</li>
                                                    <li class="js-touch-state" data-value="jxfuzhou,jxfuzhou">抚州市</li>
                                                    <li class="js-touch-state" data-value="jxyichun,jxyichun">宜春市</li>
                                                </ul>
                                                <h3 data-dict="K">K</h3>
                                                <ul class="filter-menu">
                                                    <li class="js-touch-state" data-value="kaifeng,kaifeng">开封市</li>
                                                    <li class="js-touch-state" data-value="kashi,kashi">喀什市</li>
                                                    <li class="js-touch-state" data-value="kelamayi,kelamayi">克拉玛依市</li>
                                                    <li class="js-touch-state" data-value="kezilesu,kezilesu">克孜勒苏柯尔克孜自治州</li>
                                                    <li class="js-touch-state" data-value="kuerle,kuerle">库尔勒</li>
                                                    <li class="js-touch-state" data-value="km,kunming">昆明市</li>
                                                </ul>
                                                <h3 data-dict="L">L</h3>
                                                <ul class="filter-menu">
                                                    <li class="js-touch-state" data-value="laibin,laibin">来宾市</li>
                                                    <li class="js-touch-state" data-value="laiwu,laiwu">莱芜市</li>
                                                    <li class="js-touch-state" data-value="langfang,langfang">廊坊市</li>
                                                    <li class="js-touch-state" data-value="lz,lanzhou">兰州市</li>
                                                    <li class="js-touch-state" data-value="xz,lasa">拉萨市</li>
                                                    <li class="js-touch-state" data-value="leshan,leshan">乐山市</li>
                                                    <li class="js-touch-state" data-value="liangshan,liangshan">凉山州</li>
                                                    <li class="js-touch-state" data-value="lianyungang,lianyungang">连云港</li>
                                                    <li class="js-touch-state" data-value="liaocheng,liaocheng">聊城市</li>
                                                    <li class="js-touch-state" data-value="liaoyang,liaoyang">辽阳市</li>
                                                    <li class="js-touch-state" data-value="liaoyuan,liaoyuan">辽源市</li>
                                                    <li class="js-touch-state" data-value="lijiang,lijiang">丽江市</li>
                                                    <li class="js-touch-state" data-value="lincang,lincang">临沧县</li>
                                                    <li class="js-touch-state" data-value="linfen,linfen">临汾市</li>
                                                    <li class="js-touch-state" data-value="linxia,linxia">临夏州</li>
                                                    <li class="js-touch-state" data-value="linyi,linyi">临沂市</li>
                                                    <li class="js-touch-state" data-value="linzhi,linzhi">林芝地区</li>
                                                    <li class="js-touch-state" data-value="lishui,lishui">丽水市</li>
                                                    <li class="js-touch-state" data-value="liupanshui,liupanshui">六盘水市</li>
                                                    <li class="js-touch-state" data-value="liuzhou,liuzhou">柳州市</li>
                                                    <li class="js-touch-state" data-value="longnan,longnan">陇南地区</li>
                                                    <li class="js-touch-state" data-value="longyan,longyan">龙岩市</li>
                                                    <li class="js-touch-state" data-value="loudi,loudi">娄底市</li>
                                                    <li class="js-touch-state" data-value="luan,luan">六安市</li>
                                                    <li class="js-touch-state" data-value="luohe,luohe">漯河市</li>
                                                    <li class="js-touch-state" data-value="luoyang,luoyang">洛阳市</li>
                                                    <li class="js-touch-state" data-value="luzhou,luzhou">泸州市</li>
                                                    <li class="js-touch-state" data-value="lvliang,lvliang">吕梁市</li>
                                                </ul>
                                                <h3 data-dict="M">M</h3>
                                                <ul class="filter-menu">
                                                    <li class="js-touch-state" data-value="maanshan,maanshan">马鞍山市</li>
                                                    <li class="js-touch-state" data-value="maoming,maoming">茂名市</li>
                                                    <li class="js-touch-state" data-value="meishan,meishan">眉山市</li>
                                                    <li class="js-touch-state" data-value="meizhou,meizhou">梅州市</li>
                                                    <li class="js-touch-state" data-value="mianyang,mianyang">绵阳市</li>
                                                    <li class="js-touch-state" data-value="mudanjiang,mudanjiang">牡丹江市</li>
                                                </ul>
                                                <h3 data-dict="N">N</h3>
                                                <ul class="filter-menu">
                                                    <li class="js-touch-state" data-value="nc,nanchang">南昌市</li>
                                                    <li class="js-touch-state" data-value="nanchong,nanchong">南充市</li>
                                                    <li class="js-touch-state" data-value="nj,nanjing">南京市</li>
                                                    <li class="js-touch-state" data-value="nn,nanning">南宁市</li>
                                                    <li class="js-touch-state" data-value="nanping,nanping">南平市</li>
                                                    <li class="js-touch-state" data-value="nantong,nantong">南通市</li>
                                                    <li class="js-touch-state" data-value="nanyang,nanyang">南阳市</li>
                                                    <li class="js-touch-state" data-value="naqu,naqu">那曲地区</li>
                                                    <li class="js-touch-state" data-value="neijiang,neijiang">内江市</li>
                                                    <li class="js-touch-state" data-value="nb,ningbo">宁波市</li>
                                                    <li class="js-touch-state" data-value="ningde,ningde">宁德市</li>
                                                    <li class="js-touch-state" data-value="nujiang,nujiang">怒江傈傈族自治州</li>
                                                </ul>
                                                <h3 data-dict="O">O</h3>
                                                <ul class="filter-menu">
                                                </ul>
                                                <h3 data-dict="P">P</h3>
                                                <ul class="filter-menu">
                                                    <li class="js-touch-state" data-value="panjin,panjin">盘锦市</li>
                                                    <li class="js-touch-state" data-value="panzhihua,panzhihua">攀枝花市</li>
                                                    <li class="js-touch-state" data-value="pingdingshan,pingdingshan">平顶山市</li>
                                                    <li class="js-touch-state" data-value="pingliang,pingliang">平凉市</li>
                                                    <li class="js-touch-state" data-value="pingxiang,pingxiang">萍乡市</li>
                                                    <li class="js-touch-state" data-value="puer,puer">普洱哈尼族彝族自治县</li>
                                                    <li class="js-touch-state" data-value="putian,putian">莆田市</li>
                                                    <li class="js-touch-state" data-value="puyang,puyang">濮阳市</li>
                                                </ul>
                                                <h3 data-dict="Q">Q</h3>
                                                <ul class="filter-menu">
                                                    <li class="js-touch-state" data-value="qiandongnan,qiandongnan">黔东南州</li>
                                                    <li class="js-touch-state" data-value="qianjiang,qianjiang">潜江市</li>
                                                    <li class="js-touch-state" data-value="qiannan,qiannan">黔南州</li>
                                                    <li class="js-touch-state" data-value="qianxinan,qianxinan">黔西南州</li>
                                                    <li class="js-touch-state" data-value="qd,qingdao">青岛市</li>
                                                    <li class="js-touch-state" data-value="qingyang,qingyang">庆阳市</li>
                                                    <li class="js-touch-state" data-value="qingyuan,qingyuan">清远市</li>
                                                    <li class="js-touch-state" data-value="qinhuangdao,qinhuangdao">秦皇岛市</li>
                                                    <li class="js-touch-state" data-value="qinzhou,qinzhou">钦州市</li>
                                                    <li class="js-touch-state" data-value="qh,qionghai">琼海市</li>
                                                    <li class="js-touch-state" data-value="qiqihaer,qiqihaer">齐齐哈尔市</li>
                                                    <li class="js-touch-state" data-value="qitaihe,qitaihe">七台河市</li>
                                                    <li class="js-touch-state" data-value="quanzhou,quanzhou">泉州市</li>
                                                    <li class="js-touch-state" data-value="qujing,qujing">曲靖市</li>
                                                    <li class="js-touch-state" data-value="quzhou,quzhou">衢州市</li>
                                                </ul>
                                                <h3 data-dict="R">R</h3>
                                                <ul class="filter-menu">
                                                    <li class="js-touch-state" data-value="rikaze,rikaze">日喀则地区</li>
                                                    <li class="js-touch-state" data-value="rizhao,rizhao">日照市</li>
                                                </ul>
                                                <h3 data-dict="S">S</h3>
                                                <ul class="filter-menu">
                                                    <li class="js-touch-state" data-value="sanmenxia,sanmenxia">三门峡市</li>
                                                    <li class="js-touch-state" data-value="sanming,sanming">三明市</li>
                                                    <li class="js-touch-state" data-value="sanya,sanya">三亚市</li>
                                                    <li class="js-touch-state" data-value="sh,shanghai">上海市</li>
                                                    <li class="js-touch-state" data-value="shangluo,shangluo">商洛市</li>
                                                    <li class="js-touch-state" data-value="shangqiu,shangqiu">商丘市</li>
                                                    <li class="js-touch-state" data-value="shangrao,shangrao">上饶市</li>
                                                    <li class="js-touch-state" data-value="shannan,shannan">山南地区</li>
                                                    <li class="js-touch-state" data-value="shantou,shantou">汕头市</li>
                                                    <li class="js-touch-state" data-value="shanwei,shanwei">汕尾市</li>
                                                    <li class="js-touch-state" data-value="shaoguan,shaoguan">韶关市</li>
                                                    <li class="js-touch-state" data-value="shaoxing,shaoxing">绍兴市</li>
                                                    <li class="js-touch-state" data-value="shaoyang,shaoyang">邵阳市</li>
                                                    <li class="js-touch-state" data-value="shennongjia,shennongjia">神农架林区</li>
                                                    <li class="js-touch-state" data-value="sy,shenyang">沈阳市</li>
                                                    <li class="js-touch-state" data-value="sz,shenzhen">深圳市</li>
                                                    <li class="js-touch-state" data-value="shihezi,shihezi">石河子市</li>
                                                    <li class="js-touch-state" data-value="sjz,shijiazhuang">石家庄市</li>
                                                    <li class="js-touch-state" data-value="shiyan,shiyan">十堰市</li>
                                                    <li class="js-touch-state" data-value="shizuishan,shizuishan">石嘴山市</li>
                                                    <li class="js-touch-state" data-value="shuangyashan,shuangyashan">双鸭山市</li>
                                                    <li class="js-touch-state" data-value="shuozhou,shuozhou">朔州市</li>
                                                    <li class="js-touch-state" data-value="siping,siping">四平市</li>
                                                    <li class="js-touch-state" data-value="songyuan,songyuan">松原市</li>
                                                    <li class="js-touch-state" data-value="suihua,suihua">绥化市</li>
                                                    <li class="js-touch-state" data-value="suining,suining">遂宁市</li>
                                                    <li class="js-touch-state" data-value="suizhou,suizhou">随州市</li>
                                                    <li class="js-touch-state" data-value="suqian,suqian">宿迁市</li>
                                                    <li class="js-touch-state" data-value="su,suzhou">苏州市</li>
                                                    <li class="js-touch-state" data-value="ahsuzhou,suzhouah">宿州市</li>
                                                    <li class="js-touch-state" data-value="sxyulin,sxyulin">榆林市</li>
                                                </ul>
                                                <h3 data-dict="T">T</h3>
                                                <ul class="filter-menu">
                                                   <li class="js-touch-state" data-value="tacheng,tacheng">塔城市</li>
                                                   <li class="js-touch-state" data-value="taian,taian">泰安市</li>
                                                   <li class="js-touch-state" data-value="ty,taiyuan">太原市</li>
                                                   <li class="js-touch-state" data-value="tangshan,tangshan">唐山市</li>
                                                   <li class="js-touch-state" data-value="tj,tianjin">天津市</li>
                                                   <li class="js-touch-state" data-value="tianmen,tianmen">天门市</li>
                                                   <li class="js-touch-state" data-value="tianshui,tianshui">天水市</li>
                                                   <li class="js-touch-state" data-value="tieling,tieling">铁岭市</li>
                                                   <li class="js-touch-state" data-value="tongchuan,tongchuan">铜川市</li>
                                                   <li class="js-touch-state" data-value="tonghua,tonghua">通化市</li>
                                                   <li class="js-touch-state" data-value="tongliao,tongliao">通辽市</li>
                                                   <li class="js-touch-state" data-value="tongling,tongling">铜陵市</li>
                                                   <li class="js-touch-state" data-value="tongren,tongren">铜仁地区</li>
                                                   <li class="js-touch-state" data-value="tulufan,tulufan">吐鲁番市</li>
                                                   <li class="js-touch-state" data-value="tumushuke,tumushuke">图木舒克</li>
                                                </ul>
                                                <h3 data-dict="U">U</h3>
                                                <ul class="filter-menu">

                                                </ul>
                                                <h3 data-dict="V">V</h3>
                                                <ul class="filter-menu">

                                                </ul>
                                                <h3 data-dict="W">W</h3>
                                                <ul class="filter-menu">
                                                    <li class="js-touch-state" data-value="weifang,weifang">潍坊市</li>
                                                    <li class="js-touch-state" data-value="wei,weihai">威海市</li>
                                                    <li class="js-touch-state" data-value="weinan,weinan">渭南市</li>
                                                    <li class="js-touch-state" data-value="wenshan,wenshan">文山县</li>
                                                    <li class="js-touch-state" data-value="wenzhou,wenzhou">温州市</li>
                                                    <li class="js-touch-state" data-value="wuhai,wuhai">乌海市</li>
                                                    <li class="js-touch-state" data-value="wh,wuhan">武汉市</li>
                                                    <li class="js-touch-state" data-value="wuhu,wuhu">芜湖市</li>
                                                    <li class="js-touch-state" data-value="wujiaqu,wujiaqu">五家渠</li>
                                                    <li class="js-touch-state" data-value="wulanchabu,wulanchabu">乌兰察布盟</li>
                                                    <li class="js-touch-state" data-value="xj,wulumuqi">乌鲁木齐市</li>
                                                    <li class="js-touch-state" data-value="wuwei,wuwei">武威市</li>
                                                    <li class="js-touch-state" data-value="wx,wuxi">无锡市</li>
                                                    <li class="js-touch-state" data-value="wuzhishan,wuzhishan">五指山</li>
                                                    <li class="js-touch-state" data-value="wuzhong,wuzhong">吴忠市</li>
                                                    <li class="js-touch-state" data-value="wuzhou,wuzhou">梧州市</li>
                                                </ul>
                                                <h3 data-dict="X">X</h3>
                                                <ul class="filter-menu">
                                                    <li class="js-touch-state" data-value="xm,xiamen">厦门市</li>
                                                    <li class="js-touch-state" data-value="xa,xian">西安市</li>
                                                    <li class="js-touch-state" data-value="xianggang,xianggang">香港自治区</li>
                                                    <li class="js-touch-state" data-value="xiangtan,xiangtan">湘潭市</li>
                                                    <li class="js-touch-state" data-value="xiangxi,xiangxi">湘西州</li>
                                                    <li class="js-touch-state" data-value="xiangyang,xiangyang">襄阳市</li>
                                                    <li class="js-touch-state" data-value="xianning,xianning">咸宁市</li>
                                                    <li class="js-touch-state" data-value="xiantao,xiantao">仙桃市</li>
                                                    <li class="js-touch-state" data-value="xianyang,xianyang">咸阳市</li>
                                                    <li class="js-touch-state" data-value="xiaogan,xiaogan">孝感市</li>
                                                    <li class="js-touch-state" data-value="xilinguole,xilinguole">锡林郭勒盟</li>
                                                    <li class="js-touch-state" data-value="xingan,xingan">兴安盟</li>
                                                    <li class="js-touch-state" data-value="xingtai,xingtai">邢台市</li>
                                                    <li class="js-touch-state" data-value="xn,xining">西宁市</li>
                                                    <li class="js-touch-state" data-value="xinxiang,xinxiang">新乡市</li>
                                                    <li class="js-touch-state" data-value="xinyang,xinyang">信阳市</li>
                                                    <li class="js-touch-state" data-value="xinyu,xinyu">新余市</li>
                                                    <li class="js-touch-state" data-value="xinzhou,xinzhou">忻州市</li>
                                                    <li class="js-touch-state" data-value="xishuangbanna,xishuangbanna">西双版纳傣族自治州</li>
                                                    <li class="js-touch-state" data-value="xuancheng,xuancheng">宣城市</li>
                                                    <li class="js-touch-state" data-value="xuchang,xuchang">许昌市</li>
                                                    <li class="js-touch-state" data-value="xuzhou,xuzhou">徐州市</li>
                                                </ul>
                                                <h3 data-dict="Y">Y</h3>
                                                <ul class="filter-menu">
                                                    <li class="js-touch-state" data-value="yaan,yaan">雅安市</li>
                                                    <li class="js-touch-state" data-value="yanan,yanan">延安市</li>
                                                    <li class="js-touch-state" data-value="yanbian,yanbian">延边朝鲜族自治州</li>
                                                    <li class="js-touch-state" data-value="yancheng,yancheng">盐城市</li>
                                                    <li class="js-touch-state" data-value="yangjiang,yangjiang">阳江市</li>
                                                    <li class="js-touch-state" data-value="yangquan,yangquan">阳泉市</li>
                                                    <li class="js-touch-state" data-value="yangzhou,yangzhou">扬州市</li>
                                                    <li class="js-touch-state" data-value="yantai,yantai">烟台市</li>
                                                    <li class="js-touch-state" data-value="yibin,yibin">宜宾市</li>
                                                    <li class="js-touch-state" data-value="yichang,yichang">宜昌市</li>
                                                    <li class="js-touch-state" data-value="yili,yili">伊犁哈萨克自治州</li>
                                                    <li class="js-touch-state" data-value="yc,yinchuan">银川市</li>
                                                    <li class="js-touch-state" data-value="yingkou,yingkou">营口市</li>
                                                    <li class="js-touch-state" data-value="yingtan,yingtan">鹰潭市</li>
                                                    <li class="js-touch-state" data-value="yiyang,yiyang">益阳市</li>
                                                    <li class="js-touch-state" data-value="yongzhou,yongzhou">永州市</li>
                                                    <li class="js-touch-state" data-value="yueyang,yueyang">岳阳市</li>
                                                    <li class="js-touch-state" data-value="gxyulin,yulin">玉林市</li>
                                                    <li class="js-touch-state" data-value="yuncheng,yuncheng">运城市</li>
                                                    <li class="js-touch-state" data-value="yunfu,yunfu">云浮市</li>
                                                    <li class="js-touch-state" data-value="yushu,yushu">玉树州</li>
                                                    <li class="js-touch-state" data-value="yuxi,yuxi">玉溪市</li>
                                                </ul>
                                                <h3 data-dict="Z">Z</h3>
                                                <ul class="filter-menu">
                                                    <li class="js-touch-state" data-value="zaozhuang,zaozhuang">枣庄市</li>
                                                    <li class="js-touch-state" data-value="zhangjiajie,zhangjiajie">张家界市</li>
                                                    <li class="js-touch-state" data-value="zhangjiakou,zhangjiakou">张家口市</li>
                                                    <li class="js-touch-state" data-value="zhangye,zhangye">张掖市</li>
                                                    <li class="js-touch-state" data-value="zhangzhou,zhangzhou">漳州市</li>
                                                    <li class="js-touch-state" data-value="zhanjiang,zhanjiang">湛江市</li>
                                                    <li class="js-touch-state" data-value="zhaoqing,zhaoqing">肇庆市</li>
                                                    <li class="js-touch-state" data-value="zhaotong,zhaotong">昭通市</li>
                                                    <li class="js-touch-state" data-value="zz,zhengzhou">郑州市</li>
                                                    <li class="js-touch-state" data-value="zhenjiang,zhenjiang">镇江市</li>
                                                    <li class="js-touch-state" data-value="zhongshan,zhongshan">中山市</li>
                                                    <li class="js-touch-state" data-value="zhongwei,zhongwei">中卫县</li>
                                                    <li class="js-touch-state" data-value="zhoukou,zhoukou">周口市</li>
                                                    <li class="js-touch-state" data-value="zhoushan,zhoushan">舟山市</li>
                                                    <li class="js-touch-state" data-value="zhuhai,zhuhai">珠海市</li>
                                                    <li class="js-touch-state" data-value="zhumadian,zhumadian">驻马店市</li>
                                                    <li class="js-touch-state" data-value="zhuzhou,zhuzhou">株洲市</li>
                                                    <li class="js-touch-state" data-value="zibo,zibo">淄博市</li>
                                                    <li class="js-touch-state" data-value="zigong,zigong">自贡市</li>
                                                    <li class="js-touch-state" data-value="ziyang,ziyang">资阳市</li>
                                                    <li class="js-touch-state" data-value="zjtaizhou,zjtaizhou">台州市</li>
                                                    <li class="js-touch-state" data-value="zunyi,zunyi">遵义市</li>
                                                </ul>
                                            </div>
                                            <div class="filter-index-show js-index-show">A</div>
                                            <ul class="filter-menu filter-index">
                                                <li data-index="0">A</li>
                                                <li data-index="1">B</li>
                                                <li data-index="2">C</li>
                                                <li data-index="3">D</li>
                                                <li data-index="4">E</li>
                                                <li data-index="5">F</li>
                                                <li data-index="6">G</li>
                                                <li data-index="7">H</li>
                                                <li data-index="8">I</li>
                                                <li data-index="9">J</li>
                                                <li data-index="10">K</li>
                                                <li data-index="11">L</li>
                                                <li data-index="12">M</li>
                                                <li data-index="13">N</li>
                                                <li data-index="14">O</li>
                                                <li data-index="15">P</li>
                                                <li data-index="16">Q</li>
                                                <li data-index="17">R</li>
                                                <li data-index="18">S</li>
                                                <li data-index="19">T</li>
                                                <li data-index="20">U</li>
                                                <li data-index="21">V</li>
                                                <li data-index="22">W</li>
                                                <li data-index="23">X</li>
                                                <li data-index="24">Y</li>
                                                <li data-index="25">Z</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="mask" data-role="cancel"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <% if(data.type === "1") { %>
                <div class="form-field" data-widget="app/client/app/finance/widget/template.js#inputField"  data-role="field" data-name="geren_company_type">
                    <div class="form-item" >
                        <label class="form-label">单位性质</label>
                        <div class="form-control" >
                            <div class="filter-group" data-role="childSelect" data-widget="app/client/app/finance/widget/template.js#showSelect">
                                <div data-widget="app/client/app/finance/widget/template.js#checkSelect">
                                    <input data-role="input" name="geren_company_type" value="<%= data.geren_company_type || '-1' %>" type="hidden" />
                                    <div class="filter-tips" data-role="text">选择单位性质</div>
                                    <div class="filter-cont">
                                        <div class="filter-head">
                                            <h2 class="filter-title">单位性质</h2>
                                            <button class="filter-opt" data-role="cancel">取消</button>
                                            <button class="filter-opt" data-role="confirm">完成</button>
                                        </div>
                                        <div class="filter-wrap" data-widget="app/client/app/finance/widget/template.js#initScroll">
                                            <ul class="filter-menu">
                                                <li class="js-touch-state" data-value="-1">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>不限</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="1">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>事业单位</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="2">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>国企</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="3">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>公务员</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="4">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>外企</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="5">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>私企</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="6">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>个体工商户</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="7">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>其它</span>
                                                    </label>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="mask" data-role="cancel"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-field" data-widget="app/client/app/finance/widget/template.js#inputField"  data-role="field" data-name="geren_salary_type">
                    <div class="form-item" >
                        <label class="form-label">工资发放形式</label>
                        <div class="form-control" >
                            <div class="filter-group" data-role="childSelect" data-widget="app/client/app/finance/widget/template.js#showSelect">
                                <div data-widget="app/client/app/finance/widget/template.js#checkSelect">
                                    <input data-role="input" name="geren_salary_type" value="<%= data.geren_salary_type || '-1' %>" type="hidden" />
                                    <div class="filter-tips" data-role="text">请选择</div>
                                    <div class="filter-cont">
                                        <div class="filter-head">
                                            <h2 class="filter-title">工资发放形式</h2>
                                            <button class="filter-opt" data-role="cancel">取消</button>
                                            <button class="filter-opt" data-role="confirm">完成</button>
                                        </div>
                                        <div class="filter-wrap">
                                            <ul class="filter-menu">
                                                <li class="js-touch-state" data-value="-1">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>不限</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="1">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>现金</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="2">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>打卡</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="3">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>部分现金，部分打卡</span>
                                                    </label>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="mask" data-role="cancel"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-field" data-widget="app/client/app/finance/widget/template.js#inputField"  data-role="field" data-name="geren_salary">
                    <div class="form-item" >
                        <label class="form-label">月&nbsp;&nbsp;收&nbsp;&nbsp;入</label>
                        <div class="form-control" >
                            <div class="filter-group" data-role="childSelect" data-widget="app/client/app/finance/widget/template.js#showSelect">
                                <div data-widget="app/client/app/finance/widget/template.js#select">
                                    <input data-role="input" name="geren_salary" value="<%= data.geren_salary || '-1' %>" type="hidden" />
                                    <div class="filter-tips" data-role="text">请选择</div>
                                    <div class="filter-cont">
                                        <div class="filter-head">
                                            <h2 class="filter-title">月收入</h2>
                                            <button class="filter-opt" data-role="cancel">取消</button>
                                        </div>
                                        <div class="filter-wrap" data-widget="app/client/app/finance/widget/template.js#initScroll">
                                            <ul class="filter-menu">
                                                <li class="js-touch-state" data-value="-1">不限</li>
                                                <li class="js-touch-state" data-value="1">不低于1500元</li>
                                                <li class="js-touch-state" data-value="2">不低于2000元</li>
                                                <li class="js-touch-state" data-value="3">不低于3000元</li>
                                                <li class="js-touch-state" data-value="4">不低于4000元</li>
                                                <li class="js-touch-state" data-value="5">不低于5000元</li>
                                                <li class="js-touch-state" data-value="6">不低于6000元</li>
                                                <li class="js-touch-state" data-value="7">不低于8000元</li>
                                                <li class="js-touch-state" data-value="8">不低于10000元</li>
                                                <li class="js-touch-state" data-value="9">不低于12000元</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="mask" data-role="cancel"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-field" data-widget="app/client/app/finance/widget/template.js#inputField"  data-role="field" data-name="geren_work_time">
                    <div class="form-item" >
                        <label class="form-label">工作时长</label>
                        <div class="form-control" >
                            <div class="filter-group" data-role="childSelect" data-widget="app/client/app/finance/widget/template.js#showSelect">
                                <div data-widget="app/client/app/finance/widget/template.js#select">
                                    <input data-role="input" name="geren_work_time" value="<%= data.geren_work_time || '-1' %>" type="hidden" />
                                    <div class="filter-tips" data-role="text">请选择</div>
                                    <div class="filter-cont">
                                        <div class="filter-head">
                                            <h2 class="filter-title">工作时长</h2>
                                            <button class="filter-opt" data-role="cancel">取消</button>
                                        </div>
                                        <div class="filter-wrap">
                                            <ul class="filter-menu">
                                                <li class="js-touch-state" data-value="-1">不限</li>
                                                <li class="js-touch-state" data-value="1">不低于1个月</li>
                                                <li class="js-touch-state" data-value="2">不低于3个月</li>
                                                <li class="js-touch-state" data-value="3">不低于6个月</li>
                                                <li class="js-touch-state" data-value="4">不低于12个月</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="mask" data-role="cancel"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-field" data-widget="app/client/app/finance/widget/template.js#inputField"  data-role="field" data-name="geren_shebao">
                    <div class="form-item" >
                        <label class="form-label">社保缴纳时长</label>
                        <div class="form-control" >
                            <div class="filter-group" data-role="childSelect" data-widget="app/client/app/finance/widget/template.js#showSelect">
                                <div data-widget="app/client/app/finance/widget/template.js#select">
                                    <input data-role="input" name="geren_shebao" value="<%= data.geren_shebao || '-1' %>" type="hidden" />
                                    <div class="filter-tips" data-role="text">请选择</div>
                                    <div class="filter-cont">
                                        <div class="filter-head">
                                            <h2 class="filter-title">社保缴纳时长</h2>
                                            <button class="filter-opt" data-role="cancel">取消</button>
                                        </div>
                                        <div class="filter-wrap">
                                            <ul class="filter-menu">
                                                <li class="js-touch-state" data-value="-1">不限</li>
                                                <li class="js-touch-state" data-value="1">不低于1个月</li>
                                                <li class="js-touch-state" data-value="2">不低于6个月</li>
                                                <li class="js-touch-state" data-value="3">不低于12个月</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="mask" data-role="cancel"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-field" data-widget="app/client/app/finance/widget/template.js#inputField"  data-role="field" data-name="geren_gjj">
                    <div class="form-item" >
                        <label class="form-label">公积金缴纳时长</label>
                        <div class="form-control" >
                            <div class="filter-group" data-role="childSelect" data-widget="app/client/app/finance/widget/template.js#showSelect">
                                <div data-widget="app/client/app/finance/widget/template.js#select">
                                    <input data-role="input" name="geren_gjj" value="<%= data.geren_gjj || '-1' %>" type="hidden" />
                                    <div class="filter-tips" data-role="text">请选择</div>
                                    <div class="filter-cont">
                                        <div class="filter-head">
                                            <h2 class="filter-title">公积金缴纳时长</h2>
                                            <button class="filter-opt" data-role="cancel">取消</button>
                                        </div>
                                        <div class="filter-wrap">
                                            <ul class="filter-menu">
                                                <li class="js-touch-state" data-value="-1">不限</li>
                                                <li class="js-touch-state" data-value="1">不低于1个月</li>
                                                <li class="js-touch-state" data-value="2">不低于6个月</li>
                                                <li class="js-touch-state" data-value="3">不低于12个月</li
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="mask" data-role="cancel"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-field" data-widget="app/client/app/finance/widget/template.js#inputField"  data-role="field" data-name="geren_fang">
                    <div class="form-item" >
                        <label class="form-label">名下房产</label>
                        <div class="form-control" >
                            <div class="filter-group" data-role="childSelect" data-widget="app/client/app/finance/widget/template.js#showSelect">
                                <div data-widget="app/client/app/finance/widget/template.js#checkSelect">
                                    <input data-role="input" name="geren_fang" value="<%= data.geren_fang || '-1' %>" type="hidden" />
                                    <div class="filter-tips" data-role="text">请选择</div>
                                    <div class="filter-cont">
                                        <div class="filter-head">
                                            <h2 class="filter-title">名下房产</h2>
                                            <button class="filter-opt" data-role="cancel">取消</button>
                                            <button class="filter-opt" data-role="confirm">完成</button>
                                        </div>
                                        <div class="filter-wrap">
                                            <ul class="filter-menu">
                                                <li class="js-touch-state" data-value="-1">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>不限</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="1">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>无房产</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="5">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>有房无贷</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="2">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>有房有贷，还款未满6个月</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="3">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>有房有贷，还款超过6个月</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="4">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>有房有贷，贷款已经还清</span>
                                                    </label>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="mask" data-role="cancel"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-field" data-widget="app/client/app/finance/widget/template.js#inputField"  data-role="field" data-name="geren_che">
                    <div class="form-item" >
                        <label class="form-label">名下车辆</label>
                        <div class="form-control" >
                            <div class="filter-group" data-role="childSelect" data-widget="app/client/app/finance/widget/template.js#showSelect">
                                <div data-widget="app/client/app/finance/widget/template.js#checkSelect">
                                    <input data-role="input" name="geren_che" value="<%= data.geren_che || '-1' %>" type="hidden" />
                                    <div class="filter-tips" data-role="text">请选择</div>
                                    <div class="filter-cont">
                                        <div class="filter-head">
                                            <h2 class="filter-title">名下车辆</h2>
                                            <button class="filter-opt" data-role="cancel">取消</button>
                                            <button class="filter-opt" data-role="confirm">完成</button>
                                        </div>
                                        <div class="filter-wrap">
                                            <ul class="filter-menu">
                                                <li class="js-touch-state" data-value="-1">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>不限</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="1">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>无车辆</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="2">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>有车未抵押</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="3">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>有车已抵押</span>
                                                    </label>
                                                </li>

                                            </ul>
                                        </div>
                                    </div>
                                    <div class="mask" data-role="cancel"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <% } else { %>
                <div class="form-field" data-widget="app/client/app/finance/widget/template.js#inputField"  data-role="field" data-name="qiye_time">
                    <div class="form-item" >
                        <label class="form-label">公司经营时间</label>
                        <div class="form-control" >
                            <div class="filter-group" data-role="childSelect" data-widget="app/client/app/finance/widget/template.js#showSelect">
                                <div data-widget="app/client/app/finance/widget/template.js#select">
                                    <input data-role="input" name="qiye_time" value="<%= data.qiye_time || '-1' %>" type="hidden" />
                                    <div class="filter-tips" data-role="text">选择经营时间</div>
                                    <div class="filter-cont">
                                        <div class="filter-head">
                                            <h2 class="filter-title">公司经营时间</h2>
                                            <button class="filter-opt" data-role="cancel">取消</button>
                                        </div>
                                        <div class="filter-wrap" data-widget="app/client/app/finance/widget/template.js#initScroll">
                                            <ul class="filter-menu">
                                                <li class="js-touch-state" data-value="-1">不限</li>
                                                <li class="js-touch-state" data-value="1">不低于6个月</li>
                                                <li class="js-touch-state" data-value="2">不低于1年</li>
                                                <li class="js-touch-state" data-value="3">不低于2年</li>
                                                <li class="js-touch-state" data-value="4">不低于3年</li>
                                                <li class="js-touch-state" data-value="5">不低于4年</li>
                                                <li class="js-touch-state" data-value="6">不低于5年</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="mask" data-role="cancel"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-field" data-widget="app/client/app/finance/widget/template.js#inputField"  data-role="field" data-name="qiye_money">
                    <div class="form-item" >
                        <label class="form-label">公司半年流水</label>
                        <div class="form-control" >
                            <div class="filter-group" data-role="childSelect" data-widget="app/client/app/finance/widget/template.js#showSelect">
                                <div data-widget="app/client/app/finance/widget/template.js#select">
                                    <input data-role="input" name="qiye_money" value="<%= data.qiye_money || '-1' %>" type="hidden" />
                                    <div class="filter-tips" data-role="text">选择半年流水</div>
                                    <div class="filter-cont">
                                        <div class="filter-head">
                                            <h2 class="filter-title">公司半年流水</h2>
                                            <button class="filter-opt" data-role="cancel">取消</button>
                                        </div>
                                        <div class="filter-wrap">
                                            <ul class="filter-menu">
                                                <li class="js-touch-state" data-value="-1">不限</li>
                                                <li class="js-touch-state" data-value="1">不低于10万</li>
                                                <li class="js-touch-state" data-value="2">不低于30万</li>
                                                <li class="js-touch-state" data-value="3">不低于50万</li>
                                                <li class="js-touch-state" data-value="4">不低于100万</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="mask" data-role="cancel"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-field" data-widget="app/client/app/finance/widget/template.js#inputField"  data-role="field" data-name="qiye_fang">
                    <div class="form-item" >
                        <label class="form-label">名下房产</label>
                        <div class="form-control">
                            <div class="multi-group" data-widget="app/client/app/finance/widget/template.js#selectDisable">
                                <input type="hidden" name="qiye_fang" data-role="input" value="<%= data.qiye_fang || '-1' %>">
                                <div class="switch-group-wrap">
                                    <ul class="switch-group">
                                        <li data-value="1" ><span>有</span></li>
                                        <li data-value="-1" class="active"><span>不限</span></li>
                                    </ul>
                                </div>
                                <div class="form-text">|</div>
                                <label class="input-group">
                                    <input class="input-text" pattern="\\d*" data-role="text" type="text" placeholder="估值不低于" value="<%= data.qiye_fang || '' %>">
                                </label>
                                <div class="form-text"><b>万元</b></div>
                            </div>
                        </div>
                        <div class="form-warning" data-role="tipSpan"></div>
                    </div>
                </div>
                <div class="form-field" data-widget="app/client/app/finance/widget/template.js#inputField"  data-role="field" data-name="qiye_che">
                    <div class="form-item" >
                        <label class="form-label">名下车辆</label>
                        <div class="form-control">
                            <div class="multi-group" data-widget="app/client/app/finance/widget/template.js#selectDisable">
                                <input type="hidden" name="qiye_che"  data-role="input" value="<%= data.qiye_che || '-1' %>">
                                <div class="switch-group-wrap">
                                    <ul class="switch-group">
                                        <li data-value="1"><span>有</span></li>
                                        <li data-value="-1" class="active"><span>不限</span></li>
                                    </ul>
                                </div>
                                <div class="form-text">|</div>
                                <label class="input-group">
                                    <input class="input-text" pattern="\\d*" data-role="text" type="text" placeholder="估值不低于" value="<%= data.qiye_che || '' %>">
                                </label>
                                <div class="form-text"><b>万元</b></div>
                            </div>
                        </div>
                        <div class="form-warning" data-role="tipSpan"></div>
                    </div>
                </div>
                <div class="form-field" data-widget="app/client/app/finance/widget/template.js#inputField"  data-role="field" data-name="qiye_type">
                    <div class="form-item" >
                        <label class="form-label">身份要求</label>
                        <div class="form-control" >
                            <div class="filter-group" data-role="childSelect" data-widget="app/client/app/finance/widget/template.js#showSelect">
                                <div data-widget="app/client/app/finance/widget/template.js#checkSelect">
                                    <input data-role="input" name="qiye_type" value="<%= data.qiye_type || '-1' %>" type="hidden" />
                                    <div class="filter-tips" data-role="text">请选择</div>
                                    <div class="filter-cont">
                                        <div class="filter-head">
                                            <h2 class="filter-title">身份要求</h2>
                                            <button class="filter-opt" data-role="cancel">取消</button>
                                            <button class="filter-opt" data-role="confirm">完成</button>
                                        </div>
                                        <div class="filter-wrap">
                                            <ul class="filter-menu">
                                                <li class="js-touch-state" data-value="-1">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>不限</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="1">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>企业法人</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="2">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>股东</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="3">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>其它</span>
                                                    </label>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="mask" data-role="cancel"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <% } %>
                <div class="form-field" data-widget="app/client/app/finance/widget/template.js#inputField"  data-role="field" data-name="card_record">
                    <div class="form-item" >
                        <label class="form-label">两年内信用</label>
                        <div class="form-control" >
                            <div class="filter-group" data-role="childSelect" data-widget="app/client/app/finance/widget/template.js#showSelect">
                                <div data-widget="app/client/app/finance/widget/template.js#checkSelect">
                                    <input data-role="input" name="card_record" value="<%= data.card_record || '-1' %>" type="hidden" />
                                    <div class="filter-tips" data-role="text">请选择</div>
                                    <div class="filter-cont">
                                        <div class="filter-head">
                                            <h2 class="filter-title">两年内信用</h2>
                                            <button class="filter-opt" data-role="cancel">取消</button>
                                            <button class="filter-opt" data-role="confirm">完成</button>
                                        </div>
                                        <div class="filter-wrap">
                                            <ul class="filter-menu">
                                                <li class="js-touch-state" data-value="-1">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>不限</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="1">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>信用白户</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="2">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>无逾期记录</span>
                                                    </label>
                                                </li>
                                                <li class="js-touch-state" data-value="3">
                                                    <label class="checkbox-group">
                                                        <input type="checkbox" >
                                                        <span>有逾期记录</span>
                                                    </label>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="mask" data-role="cancel"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-opt">
                <button class="btn btn-primary btn-large js-touch-state">提交模版</button>
            </div>
        </div>
        <input type="hidden" name="user_id" value="<%= data.user_id %>">
        <% if(data.id) { %><input type="hidden" name="id" value="<%= data.id %>"><% } %>
    </form>
    <div id="validatorConfig"></div>
    <div class="footbar">
        <nav class="nav" data-widget="app/client/app/finance/widget/loan.js#goUrl">
            <% if(data.id) { %>
            <a href="javascript::" class="nav-item" data-id="<%= data.id %>" data-user-id="<%= data.user_id %>" data-widget="app/client/app/finance/widget/template.js#deleteTemplate"><i class="icon icon-trash"></i>删除</a>
            <% } %>
            <a href="###" data-role="toUrl" data-url="app/client/app/finance/controller/vip_contact.js" class="nav-item"><i class="icon icon-headphone"></i>联系我们</a>
        </nav>
    </div>
</section>
<!-- section end -->
<!-- popup start -->
<div id="delTpl">
    <div class="popup popup-confirm" style="margin-top: -78px;">
        <div class="popup-head">
            <h2>提示</h2>
        </div>
        <div class="popup-body">
            <p>确认删除模版？</p>
        </div>
        <div class="popup-bar">
            <a href="javascript:;" data-role="cancel">取消</a>
            <a href="javascript:;" data-role="confirm">确认</a>
        </div>
    </div>
    <div class="mask"></div>
</div>

<div id="confirm" data-widget="app/client/app/finance/widget/template.js#confirmSubmit">
    <div class="popup popup-confirm" style="margin-top: -78px;">
        <div class="popup-head">
            <h2>提示</h2>
        </div>
        <div class="popup-body">
            <p>选择应用后模版将立即生效，确定应用或者先保存？</p>
        </div>
        <div class="popup-bar">
            <a href="javascript:;" data-role="save">仅保存</a>
            <a href="javascript:;" data-role="use">应用</a>
        </div>
    </div>
    <div class="mask"></div>
</div>