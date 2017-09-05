edit = (id) =>
{
    var user_div = $("div[name="+id+"]")[0];

    var id_field = $(user_div.children[0].children[1]);
    id_field.html("<input name='id-field' class='form-control' type='text' value='"+id+"'</input>");

    var access = $(user_div.children[1].children[1]).text();
    var access_field = $(user_div.children[1].children[1]);
    access_field.html("<input name='access-field' class='form-control' type='text' value='"+access+"'</input>");

    var username = $(user_div.children[2].children[1]).text();
    var username_field = $(user_div.children[2].children[1]);
    username_field.html("<input name='username-field' class='form-control' type='text' value='"+username+"'</input>");

    var email = $(user_div.children[3].children[1]).text();
    var email_field = $(user_div.children[3].children[1]);
    email_field.html("<input name='email-field' class='form-control' type='text' value='"+email+"'</input>");

    var name = $(user_div.children[4].children[1]).text();
    var name_field = $(user_div.children[4].children[1]);
    name_field.html("<input name='name-field' class='form-control' type='text' value='"+name+"'</input>");

    $(".btn-success[name="+id+"]").hide();
    $(".btn-primary[name="+id+"]").show();
};

save = (id) =>
{
    var user_div = $("div[name="+id+"]")[0];

    var new_id = $(user_div).find("input[name='id-field']")[0].value;
    var id_field = $(user_div.children[0].children[1]);
    id_field.html("<span>"+new_id+"</span>");

    var new_access = $(user_div).find("input[name='access-field']")[0].value;
    var access_field = $(user_div.children[1].children[1]);
    access_field.html("<span>"+new_access+"</span>");

    var new_username = $(user_div).find("input[name='username-field']")[0].value;
    var username_field = $(user_div.children[2].children[1]);
    username_field.html("<span>"+new_username+"</span>");

    var new_email = $(user_div).find("input[name='email-field']")[0].value;
    var email_field = $(user_div.children[3].children[1]);
    email_field.html("<span>"+new_email+"</span>");

    var new_name = $(user_div).find("input[name='name-field']")[0].value;
    var name_field = $(user_div.children[4].children[1]);
    name_field.html("<span>"+new_name+"</span>");

    var user_data =
    {
        "id": new_id,
        "access": new_access,
        "username": new_username,
        "email": new_email,
        "name": new_name
    };

    $(".btn-primary[name="+id+"]").hide();
    $(".btn-success[name="+id+"]").show();
    console.log(user_data);


    $.post("admin/updateuser",
    {
        "_csrf": $(".admin-users").attr("_csrf"),
        "user_data": user_data
    });

};
