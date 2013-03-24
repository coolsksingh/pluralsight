$(document).ready(function () {
    $('#menu li a').click(function (e) {
        e.preventDefault();
        $("#content").empty().append("<div id='loading'><img src='images/preloader.gif' alt='Loading'></div>");
        $('#menu li a').removeClass('current');
        $(this).addClass('current');
        var url = this.href;
        setTimeout(function() {
            $.ajax({
                url:url,
                cache:false,
                success:function (html) {
                    $("#content").html(html);
                }
            });
        }, 1000);

//        return false;
    });
});
