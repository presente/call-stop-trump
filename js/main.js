// MT1.11 Compat
var $E = function(selector, filter){
	return ($(filter) || document).getElement(selector);
};

var $ES = function(selector, filter){
	return ($(filter) || document).getElements(selector);
};

var trackEvent = function(ev) {
    window['optimizely'] = window['optimizely'] || [];
    window.optimizely.push(["trackEvent", ev]);

    ga('send', 'event', ev);
};

jQuery( document ).ready(function( $ ) {

    var fieldError = function(name, text) {
        var f = $('input[name="'+name+'"]');
        f.addClass('ak-error');

        var err = $('ul#ak-errors');
        err.append('<li>'+text+'</li>');
        return false;
    };

    var validatePhone = function(num) {
        num = num.replace(/\s/g, '').replace(/\(/g, '').replace(/\)/g, '');
        num = num.replace("+", "").replace(/\-/g, '');

        if (num.charAt(0) == "1")
            num = num.substr(1);

        if (num.length != 10)
            return false;

        return num;
    };

    onWidgetSubmit = function(e) {
//        e.preventDefault();

        // clear validation errors
        $('form[name="act"] input').removeClass('ak-error');
        $('ul#ak-errors').empty();

        var email = $('#id_email').val();
        if (!validateEmail(email)) {
            return fieldError('email','Please enter a valid email address');
        }

        var phone = $('#id_phone').val();
        if (!validatePhone(phone)) {
            return fieldError('phone','Please enter a valid US phone number');
        }

        var data = {
            campaignId: 'chc-nn',
            userPhone: validatePhone(phone)
        };

        $.ajax({
            url: 'http://api.call4netfreedom.org/create',
            type: "get",
            dataType: "json",
            data: data,
            success: function(res) {
                trackEvent('call-congress');

                console.log('Placed call-congress call: ', res);
            }
        });
        showOverlay();
        return true;
    };
    $('#phoneForm').submit(onWidgetSubmit);

    $('#emailForm').submit(function(e) {
        e.preventDefault();
        $('#email_button').click();
    });

    $('#email_button').click(function(e) {

        if (!validateEmail($('#email').val()))
            return fieldError('email','Please enter a valid email address!');

        $('#email_form_fields').addClass('fade');
        $('.thanks').addClass('visible');
        setTimeout(function() {
            $('#email_form_fields').hide();
        }, 500);

        var form = $('#emailForm');
        $.post(form.attr('action'), form.serialize(), function(data){});

    });

    $('a.close').click(function (e){
        $('.overlay').removeClass('visible');
    });

});

function showOverlay() {
    $('.overlay').css('display', 'table');
        setTimeout(function() {
            $('.overlay').addClass('visible');
            setTimeout(function() {
                $('.overlay .modal .inner').addClass('visible');
            }, 10);
        }, 100);
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}