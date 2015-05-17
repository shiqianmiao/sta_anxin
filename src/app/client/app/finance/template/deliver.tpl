 <!-- section start -->
<section class="account account-succ <%= className %>">
    <!-- form start -->
    <form action="" data-widget="app/client/app/finance/widget/loan.js#goUrl">
        <div class="form-widget widget-reg">
            <div class="form-deliver">
                <div class="deliver-title"><i class="icon icon-ticks"></i>注册成功！</div>
            </div>
            <div class="form-opt">
                <button class="btn btn-primary btn-large js-touch-state"
                data-role="toUrl"
                data-url="app/client/app/finance/controller/authenticate.js"
                >去认证</button>
                <!-- <button class="btn btn-common btn-large js-touch-state">回主界面</button> -->
            </div>
        </div>
        <div class="form-widget widget-forgot">
            <div class="form-deliver">
                <div class="deliver-title"><i class="icon icon-ticks"></i>重置密码成功！</div>
            </div>
            <div class="form-opt">
                <button class="btn btn-primary btn-large js-touch-state"
                data-role="toUrl"
                data-url="app/client/app/finance/controller/authenticate.js"
                >去认证</button>
                <!-- <button class="btn btn-common btn-large js-touch-state">回主界面</button> -->
            </div>
        </div>
        <div class="form-widget widget-binding">
            <div class="form-deliver">
                <div class="deliver-title"><i class="icon icon-ticks"></i>绑定手机号码成功！</div>
            </div>
            <div class="form-opt">
                <button class="btn btn-primary btn-large js-touch-state"
                data-role="toUrl"
                data-url="app/client/app/finance/controller/authenticate.js"
                >去认证</button>
                <!-- <button class="btn btn-common btn-large js-touch-state">回主界面</button> -->
            </div>
        </div>
        <div class="form-widget widget-login">
            <div class="form-deliver">
                <div class="deliver-title"><i class="icon icon-ticks"></i>账号登录成功！</div>
            </div>
            <div class="form-opt">
                <button class="btn btn-primary btn-large js-touch-state"
                data-role="toUrl"
                data-url="app/client/app/finance/controller/authenticate.js"
                >去认证</button>
                <!-- <button class="btn btn-common btn-large js-touch-state">回主界面</button> -->
                <!-- <button class="btn btn-common btn-large js-touch-state" data-user-id="<%= user_id %>" data-widget="app/client/app/finance/widget/loan.js#unbind">
                    解除绑定
                </button> -->
            </div>
        </div>
        <div class="form-widget widget-loginAuth">
            <div class="form-deliver">
                <div class="deliver-title"><i class="icon icon-ticks"></i>账号登录成功！</div>
            </div>
            <div class="form-opt">
                <!-- <button class="btn btn-common btn-large js-touch-state" data-user-id="<%= user_id %>" data-widget="app/client/app/finance/widget/loan.js#unbind">
                    解除绑定
                </button> -->
                <button class="btn btn-common btn-large js-touch-state"
                data-role="toUrl"
                data-url="app/client/app/finance/controller/my_template.js"
                >我的模版</button>
                <button class="btn btn-common btn-large js-touch-state"
                data-role="toUrl"
                data-url="app/client/app/finance/controller/case_list.js"
                >例子市场</button>
                <button class="btn btn-common btn-large js-touch-state"
                data-role="toUrl"
                data-url="app/client/app/finance/controller/manage_list.js"
                >客户管理</button>
            </div>
        </div>
    </form>
    <!-- form end -->
</section>
<!-- section end -->
