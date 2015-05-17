<!-- section start -->
<section class="campaign"
    data-widget="app/client/app/group_chat/chat/view/campaign.js#main"
>
    <div class="board">
        <div class="ready active">
            <p class="notice">距竞选群主开始还有：</p>
            <div class="time">
                <b data-role="hour" class="value"></b>
                <span class="dot">:</span>
                <b data-role="minute" class="value"></b>
                <span class="dot">:</span>
                <b data-role="second" class="value"></b>
            </div>
        </div>
        <div class="<%= data.status === 0 ? 'end' : 'start' %> active">
            <p class="notice"><b>火爆竞选中</b></p>
        </div>
    </div>
    <div class="mod-column form-widget">
        <div class="column-head">
            <h2 class="column-title">您竞选的群组：<%= groupName %></h2>
        </div>
        <div class="column-body">
            <div class="form-group">
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">竞选宣言</label>
                        <div data-role="textBlock" class="form-control">
                            <label class="textarea-group">
                                <textarea data-role="textarea" name="" class="textarea" placeholder="请输入竞选宣言(100字以内)"></textarea>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-opt"> 
                <div class="btn-group"> 
                    <button data-role="submit" disabled type="button" class="btn btn-primary js-touch-state">提交并参选</button> 
                </div> 
            </div>
        </div>
    </div>
    <div class="mod-column rule">
        <div class="column-head">
            <h2 class="column-title">规则说明：</h2>
        </div>
        <div class="column-body">
            <ul class="mod-list">
                <li class="list-item">1、只有群成员才可以进行竞选</li>
                <li class="list-item">2、倒计时结束，竞选开始之后才可以提交进行竞选</li>
                <li class="list-item">3、系统会根据提交人的资料进行筛选，选择一位成员成为群主</li>
                <li class="list-item">4、竞选宣言的内容质量越高越容易当选</li>
            </ul>
        </div>
        <div class="column-head">
            <h2 class="column-title">群主特权说明：</h2>
        </div>
        <div class="column-body">
            <ul class="mod-list">
                <li class="list-item">1、本群群主拥有任命/取消管理员、踢出群成员等管理权利</li>
                <li class="list-item">2、本群群主不能修改本群的群资料</li>
                <li class="list-item">3、本群群主不能解散本群</li>
                <li class="list-item">4、本群群主不想继续担任群主可以自己卸任</li>
                <li class="list-item">5、本群群主未卸任不能退出本群</li>
            </ul>
        </div>
    </div>
</section>
<!-- section end -->