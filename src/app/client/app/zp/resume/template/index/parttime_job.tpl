<div class="category category-turn">
    <ul class="list" data-role="hotJobList">
    <% _.each(parttimeJobs, function (job) { %>
        <li>
            <a
                data-role="link"
                data-query='{"category_type": "<%= job.url%>", "job_type": "parttime"}'
                data-name="<%= job.name %>"
                href="javascript: void(0);"
            >
                <%= job.name %>
            </a>
        </li>
    <% }) %>
    </ul>
</div>