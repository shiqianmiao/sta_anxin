<!-- section start -->
<section class="section">
<!-- form start -->
    <form action=""
        data-widget="app/client/app/zp/resume/view/advance_filter.js#form"
        data-filter='<%= JSON.stringify(currentFilter) %>'
    >
        <% _.each(groups, function (group) { %>
        <div class="form-group">
            <% _.each(group, function (field) { %>
            <% var val = currentFilter[field.name] %>
            <div class="form-field">
                <div class="form-item">

                <% if (field.type === 'radio') { %>
                    <label class="form-label"><%= field.title %></label>
                    <div class="form-control" data-widget="app/client/app/zp/resume/view/advance_filter.js#radio">
                        <ul class="switch-group" >
                            <% _.each(field.options, function (option, i) { %>
                            <li data-role="option"
                                data-value="<%= option.value %>"
                                <% if (val === option.value || (typeof val === 'undefined' && i === 0)) { %>
                                class="active"
                                <% } %>
                            ><span><%= option.title %></span></li>
                            <% }) %>
                        </ul>
                        <input type="hidden" data-role="input" name="<%= field.name %>" value="<%= typeof val !== 'undefined' ? val : field.options[0].value %>">
                    </div>
                <% } else { %>
                    <label class="form-label"><%= field.title %></label>
                    <div class="form-control">
                        <div class="filter-group" data-widget="app/client/app/zp/resume/view/advance_filter.js#select">
                            <div class="filter-tips active" data-role="select">
                                <% if (typeof val !== 'undefined') { %>
                                    <% try { %>
                                        <%= field.options.filter(function (option) {return option.value === val })[0].title %>
                                    <% } catch (ex) { %>
                                        请选择
                                    <% } %>
                                <% } else { %>
                                请选择
                                <% } %>
                            </div>
                            <input type="hidden" data-role="input" name="<%= field.name %>" value="<%= typeof val === 'undefined' ? '' : val %>"/>
                            <div class="filter-value"></div>
                            <div class="filter-cont" data-role="options">
                                <div class="filter-head">
                                    <h2 class="filter-title"><%= field.title %></h2>
                                    <button class="filter-opt" data-role="cancel">取消</button>
                                </div>
                                <div class="filter-wrap js-need-iscroll">
                                    <ul class="filter-menu">
                                        <% _.each(field.options, function (option, i) {%>
                                            <li class="js-touch-state <%if (val === option.value || (typeof val === 'undefined' && option.value === -1)) {%>active<% } %>"
                                                data-role="option"
                                                data-value="<%= option.value %>"
                                            ><%= option.title %></li>
                                        <% }) %>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                <% } %>
                </div>
            </div>
            <% }) %>
        </div>
        <% }) %>

        <div class="form-opt">
            <button class="btn btn-primary btn-large" type="button" data-role="submit">确认</button>
        </div>
    </form>
<!-- form end -->
</section>
<!-- section end -->
<!-- popup start -->
<div class="mask"></div>
<!-- popup end -->