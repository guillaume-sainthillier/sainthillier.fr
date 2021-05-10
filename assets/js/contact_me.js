import $ from 'jquery';
import '../vendor/jqBootstrapValidation';

$(document).ready(function () {
    const contactForm = $('#contactForm');
    $('input, textarea', contactForm).jqBootstrapValidation({
        preventSubmit: true,
        submitError: function ($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function ($form, event) {
            event.preventDefault(); // prevent default submit behaviour

            //Contact Form
            var name = $('input#name', contactForm).val();
            var email = $('input#email', contactForm).val();
            var phone = $('input#phone', contactForm).val();
            var message = $('textarea#message', contactForm).val();
            var firstName = name; // For Success/Failure Message

            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(' ') >= 0) {
                firstName = name.split(' ').slice(0, -1).join(' ');
            }

            var messageButton = $('#sendMessageButton');
            messageButton.prop('disabled', true); // Disable submit button until AJAX call is complete to prevent duplicate messages
            $.ajax({
                url: $('#contactForm').attr('action'),
                type: 'POST',
                dataType: 'json',
                data: {
                    _replyto: email,
                    message: `${name} a fait une demande de contact :
                        ${message}
                        Téléphone : ${phone}
                        Email : ${email}
                    `,
                },
                cache: false,
                success: function () {
                    // Success message
                    $('#success').html(`
                        <div class="alert alert-success alert-dismissible fade show">
                            <strong>Votre message a bien été envoyé.</strong>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
                        </div>
                    `);

                    //clear all fields
                    $('#contactForm').trigger('reset');
                },
                error: function () {
                    $('#success').html(`
                        <div class="alert alert-danger alert-dismissible fade show">
                            <strong>Désolé ${firstName}, on dirait que le message n'a pas pu être envoyé. Merci d'essayer un peu plus tard !</strong>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
                        </div>
                    `);
                },
                complete: function () {
                    setTimeout(function () {
                        messageButton.prop('disabled', false); // Re-enable submit button when AJAX call is complete
                    }, 1000);
                },
            });
        },
        filter: function () {
            return $(this).is(':visible');
        },
    });

    $('input#name', contactForm).focus(function () {
        $('#success').html('');
    });
});
