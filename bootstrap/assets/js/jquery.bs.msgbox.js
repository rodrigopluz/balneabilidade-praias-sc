/*!
* Bootstrap MessageBox jQUery plugin v0.1.0
* Copyright 2015 Denis Mokhin; please visit http://mokh.in
* Licensed under GNU GPL v2 or later; see LICENSE.txt
*/

(function($) {
    jQuery.fn.bsMsgBox = function(options) {
        // Extend options by default
        options = $.extend(true, {
            titletag: '<h3/>',
            name:     'msgbox',
            iconset:  'glyphicons',
            title:    'Untitled message',
            text:     'Text of a message...',
            buttons: {
                close: {
                    type:    "default",
                    doclose: true,                    
                    text:    "Fechar"
                }
            }
        }, options);

        // Create modal
        var make = function() {
            // Buttons
            var buttons=(options.buttons)?[]:null;
            $.each(options.buttons, function(index,button) {
                // Extend by defaults
                button = $.extend({
                    type: "default"
                },button);

                // Setting class                
                var sClass="btn";                
                if (button.type)
                    sClass+=" btn-"+button.type;                                

                // Add class to button's attributes
                if (button.attr) {                    
                    if (button.attr.class) {
                        button.attr.class += " " + sClass;
                    } else {
                        button.attr.class = sClass;
                    }
                } else {
                    button.attr = { class: sClass };
                }

                // If button should close modal
                if (button.doclose) button.attr = $.extend({'data-dismiss': "modal" }, button.attr);

                // If button have onclick
                if (button.onclick) button.attr.onclick = button.onclick;

                // Set button
                buttons.push($("<button/>", button.attr).html(button.text));
            });

            // Helper array of icons htmls
            var icons = {
                glyphicons: {
                    info:     "<span class='glyphicon glyphicon-info-sign text-info' style='font-size: 3em;' aria-hidden='true'></span>",
                    error:    "<span class='glyphicon glyphicon-remove-sign text-danger' style='font-size: 3em;' aria-hidden='true'></span>",                    
                    question: "<span class='glyphicon glyphicon-question-sign text-primary' style='font-size: 3em;' aria-hidden='true'></span>",
                    ok:       "<span class='glyphicon glyphicon-ok-sign text-success' style='font-size: 3em;' aria-hidden='true'></span>",
                },
                fontawesome: {
                    info:     "<i class='fa fa-info-circle fa-4x text-info'></i>",
                    error:    "<i class='fa fa-times-circle fa-4x text-danger'></i>",                    
                    question: "<i class='fa fa-question-circle fa-4x text-primary'></i>",
                    ok:       "<i class='fa fa-check-circle fa-4x text-success'></i>"
                }
            };

            // Setup icon's html
            var icon = '';
            if (options.icon) {
                icon = icons[options.iconset][options.icon];
            }

            // Main content element
            var content = 
                $("<div/>",{ class: "modal-content" })
                    .append(
                        $("<div/>",{ class: "modal-header" })
                        .append(
                            $("<button/>",{ type: "button", class: "close", 'data-dismiss': "modal", 'aria-label': "Fechar" })
                            .append(
                                $("<span/>",{ 'aria-hidden': "true" })
                            )
                            .html("&times;")
                        )
                        .append(
                            $(options.titletag,{ class: "modal-title", id: options.name + "Label" })
                            .html(options.title)
                        )
                    )
                    .append(
                        $("<div/>",{ class: "modal-body" })
                        .append(
                            $("<div/>",{ class: "media" })
                            .append(
                                $("<div/>",{ class: "media-left" })
                                .html(icon)
                            )
                            .append(
                                $("<div/>",{ class: "media-body" })
                                .html(options.text)
                            )
                        )
                    );

            // Footer element
            var footer = null;
            if (buttons) {
                footer = $("<div/>",{
                    class: "modal-footer" 
                });

                $.each(buttons, function(index,button) {
                    footer.append(button);
                    content.append(footer);
                })
            }

            // Modal DOM element
            var modalDiv =
                $('<div/>',{
                    tabindex: '-1',
                    role: "dialog",
                    id: options.name,
                    class: 'modal fade',
                    'aria-labelledby': options.name+"Label"
                }).append(
                    $("<div/>",{
                        role: "document",
                        class: "modal-dialog"
                    }).append(
                        content
                    )
                );

            // Insert modal to DOM
            $(this).append(modalDiv);

            // Hide event handler
            $("#" + options.name).on('hidden.bs.modal', function (e) {
                $(this).remove("#" + options.name); // Remove modal from DOM
            });

            // Show modal
            $("#" + options.name).modal('show');
        };            

        return this.each(make);
    };
})(jQuery);