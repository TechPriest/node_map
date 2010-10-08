/**
 * Marker selector widget
 *
 * @TODO: Write documentation here
 *
 */
( function($) {
  $.widget("ui.markerselect", {
    listVisible: false,
    $list: null,
    $input: null,
    $selectedMarkerContainer: null,

    // callbalcks
    _clicked: function() {
      this._toggleList();
    },

    // methods
    _toggleList: function() {
      this.listVisible ? this._hideList() : this._showList();
    },

    _createList: function() {
      // create dummy list for testing purposes now
      (this.$list = $('<div></div>'))
          .addClass("ui-markerselect-list")
          .hide();
      this.element.append(this.$list);
    },

    _showList: function() {
      if (!this.listVisible) {
        if (!this.$list)
          this._createList();
        this.element.addClass('active');
        this.$list.stop(true, true).slideDown(150);
        this.listVisible = true;
      }
    },

    _hideList: function() {
      if (this.listVisible) {
        this.$list.stop(true,true).slideUp(75);
        this.element.removeClass('active');
        this.listVisible = false;
      }
    },

    // constructor
    _init: function() {
      var self = this;
      (this.$input = $('<input/>'))
        .attr({
          name: this.options.name,
          type: 'hidden',
          value: 'somevalue' // @TODO: selected marker name here
        });

      var $shadowDiv = $('<div></div>');
      var $iconDiv = $('<div></div>');
      $shadowDiv.addClass('shadow');
      $iconDiv.addClass('icon');
      $shadowDiv.append($iconDiv);
      if (this.options.selected) {
        var shadowImg = new Image();
        $(shadowImg).load(function() {
          $shadowDiv.css({
            height: shadowImg.height,
            backgroundPosition: '0 0',
            backgroundImage: 'url('+self.options.selected.shadow+')'
          });
          $iconDiv.css({
            backgroundImage: 'url('+self.options.selected.icon+')'
          });
        }).attr('src', this.options.selected.shadow);
        this.element.attr('title', this.options.selected.title);
      }

      var $wrapper = $('<div></div>');
      $wrapper
          .addClass('markerwrapper')
          .append($shadowDiv);

      this.element
        .addClass("ui-markerselect ui-widget ui-widget-content ui-corner-all")
        .append($wrapper)
        .append(this.$input)
        .click( function(e) { self._clicked(); } );
    },

    // destructor
    destroy: function() {
      $.Widget.prototype.destroy.apply(this, arguments); // default destroy
    }
  });

  $.extend($.ui.markerselect, {
    version: "1.0.0",
    defaults: {
      name: "marker",
      selected: {
        title: "Some marker",
        name: "some_marker",
        shadow: "/sites/all/modules/gmap/markers/big/shadow.png",
        icon: "/sites/all/modules/gmap/markers/big/red.png"
      }
    }
  });
}) (jQuery);