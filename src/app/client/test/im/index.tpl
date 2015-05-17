<style>
    .btn-large {
        width: 180px;
        position: absolute;
        left: 50%;
        margin-left: -90px;
    }
    div {
        padding: 10px;
        min-height: 50px;
    }
    input {
        width: 100px;
    }
</style>
<div
    data-widget="app/client/test/im/index.js#open"
    data-name="immain"
>
    <input type="hidden" name="pagetype" data-role="input" value="nearby">
    <a class="btn btn-large btn-primary" href="javascript: void(0)" data-role="btn">附近</a>
</div>

<div
    data-widget="app/client/test/im/index.js#open"
    data-name="immain"
>
    <input type="hidden" name="pagetype" data-role="input" value="discovery">
    <a class="btn btn-large btn-primary" href="javascript: void(0)" data-role="btn">发现</a>
</div>
<div
    data-widget="app/client/test/im/index.js#open"
    data-name="immain"
>
    <input type="hidden" name="pagetype" data-role="input" value="messagelist">
    <a class="btn btn-large btn-primary" href="javascript: void(0)" data-role="btn">消息列表</a>
</div>
<div
    data-widget="app/client/test/im/index.js#open"
    data-name="immain"
>
    <input type="hidden" name="pagetype" data-role="input" value="mypage">
    <a class="btn btn-large btn-primary" href="javascript: void(0)" data-role="btn">我的页面</a>
</div>
<div
    data-widget="app/client/test/im/index.js#open"
    data-name="impersonpage"
>
    <input type="text" data-role="input" placeholder="用户id" name="userid">
    <a class="btn btn-primary" href="javascript: void(0)" data-role="btn">去这个人的个人资料页面</a>
</div>
<div
    data-widget="app/client/test/im/index.js#open"
    data-name="imgrouppage"
>
    <input type="text" data-role="input" placeholder="群id" name="groupid">
    <a class="btn btn-primary" href="javascript: void(0)" data-role="btn">去这个群组的资料页面</a>
</div>