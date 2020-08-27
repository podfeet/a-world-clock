(function ($) {
    var defaults = {
        treshold: 4,
        maximumItems: 5,
        highlightTyped: true,
        highlightClass: 'text-primary'
    };
    function createItem(lookup, item, opts) {
        var label;
        if (opts.highlightTyped) {
            var idx = item.label.toLowerCase().indexOf(lookup.toLowerCase());
            label = item.label.substring(0, idx)
                + '<span class="' + opts.highlightClass + '">' + item.label.substring(idx, idx + lookup.length) + '</span>'
                + item.label.substring(idx + lookup.length, item.label.length);
        }
        else {
            label = item.label;
        }
        return '<button type="button" class="dropdown-item" data-value="' + item.value + '">' + label + '</button>';
    }
    function createItems(field, opts) {
        var lookup = field.val();
        if (lookup.length < opts.treshold) {
            field.dropdown('hide');
            return 0;
        }
        var items = field.next();
        items.html('');
        var count = 0;
        var keys = Object.keys(opts.source);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var object = opts.source[key];
            var item = {
                label: opts.label ? object[opts.label] : key,
                value: opts.value ? object[opts.value] : object
            };
            if (item.label.toLowerCase().indexOf(lookup.toLowerCase()) >= 0) {
                items.append(createItem(lookup, item, opts));
                if (++count >= opts.maximumItems) {
                    break;
                }
            }
        }
        // option action
        field.next().find('.dropdown-item').click(function () {
            field.val($(this).text());
            if (opts.onSelectItem) {
                opts.onSelectItem({
                    value: $(this).data('value'),
                    label: $(this).text()
                }, field[0]);
            }
        });
        return items.children().length;
    }
    $.fn.autocomplete = function (options) {
        // merge options with default
        var opts = {};
        $.extend(opts, defaults, options);
        var _field = $(this);
        // clear previously set autocomplete
        _field.parent().removeClass('dropdown');
        _field.removeAttr('data-toggle');
        _field.removeClass('dropdown-toggle');
        _field.parent().find('.dropdown-menu').remove();
        _field.dropdown('dispose');
        // attach dropdown
        _field.parent().addClass('dropdown');
        _field.attr('data-toggle', 'dropdown')

        // add aria data attributes to tell screen readers there is a popup and its default state is not expanded. aria-expanded will change to "true" automatically when the menu exists
        _field.attr('aria-haspopup', 'true');
        _field.attr('aria-expanded', 'false');
        // add aria-controls attribute
        // Indicates whether and how the user's input into the field could trigger display of a prediction of the intended value
        _field.attr('aria-controls', `${_field.attr('id')}menu`);
        _field.attr('aria-autocomplete', 'list');

        _field.addClass('dropdown-toggle');

        // creates a div
        // need div to have an ID to be controlled by the input box and a role for the input box to have as aria-popup
        _field.after(`<div id="${_field.attr('id')}menu" aria-labelledby="${_field.attr('id')}" role="listbox" ></div>`);

        _field.dropdown(opts.dropdownOptions);
        this.off('click.autocomplete').click('click.autocomplete', function (e) {
            if (createItems(_field, opts) == 0) {
                // prevent show empty
                e.stopPropagation();
                _field.dropdown('hide');
            }
            ;
        });
        // show options
        this.off('keyup.autocomplete').keyup('keyup.autocomplete', function () {
            if (createItems(_field, opts) > 0) {
                _field.dropdown('show');
                _field.role('listbox')
                // ad aria expanded and role
                _field.attr('aria-expanded', 'true');
            }
            else {
                // sets up positioning
                _field.click();
            }
        });
        return this;
    };
}(jQuery));
