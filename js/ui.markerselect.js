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

    _fillItem: function($itemDiv, itemDescr) {
      var $markerWrapperDiv = $('<div></div>');
      $markerWrapperDiv.addClass('markerwrapper');
      var $shadowDiv = $('<div></div>');
      $shadowDiv.addClass('shadow');
      var $iconDiv = $('<div></div>');
      $iconDiv.addClass('icon');
      $shadowDiv.append($iconDiv);
      this._setButtonMarker($shadowDiv, $iconDiv, itemDescr);
      $markerWrapperDiv.append($shadowDiv);                
      $itemDiv.append($markerWrapperDiv);
      $markerWrapperDiv.attr('title', itemDescr.title);

      var $captionDiv = $('<div></div>');
      $captionDiv
          .addClass('caption')
          .text(itemDescr.title);
      $itemDiv.append($captionDiv);
    },

    _createList: function() {
      // create dummy list for testing purposes now
      (this.$list = $('<div></div>'))
          .addClass("ui-markerselect-list");

      this.$list.append('<div class="scrollbar"><div class="track"><div class="thumb"><div class="end"></div></div></div></div>');
      var $viewport = $('<div></div>');
      $viewport.addClass('viewport');
      this.$list.append($viewport);
      var $overview = $('<div></div>');
      $overview.addClass('overview');
      
      for (var i = 0; i < 100; i++) {
        var $itemDiv = $('<div></div>');
        $itemDiv.addClass('item');
        this._fillItem($itemDiv, this.options.selected);
        $overview.append($itemDiv);
      }
      $viewport.append($overview);
      this.element.append(this.$list);
      this.$list.tinyscrollbar();
      this.$list.hide();
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

    // utility methods
    _setDivImageSrc: function($div, url, callback) {
      var self = this;
      var img = new Image();
      if (url) {
        $(img).load(function(){
          $div
              .css({
                width: img.width + 'px',
                height: img.height + 'px',
                backgroundImage: 'url(' + img.src + ')'
              })
              .attr({             // to pass dimensions to further procession
                width: img.width,
                height: img.height
              });
          if (callback)
            callback();
        }).attr('src', url);
      } else {
        $div
          .css({
            width: 0,
            height: 0
          })
          .attr({
            width: 0,
            height: 0
          });
        if (callback)
          callback();
      }
    },

    _positionShadow: function($shadowDiv) {
      $shadowDiv.css({
        top: '50%',
        left: '50%',
        marginTop: (-($shadowDiv.attr('height') / 2)) + 'px',
        marginLeft: (-($shadowDiv.attr('width') / 2)) + 'px'
      });
    },

    _setButtonMarker: function($shadowDiv, $iconDiv, markerDescr) {
      var self = this;
      if (markerDescr.shadow) {
        self._setDivImageSrc($shadowDiv, markerDescr.shadow, function() {
          self._setDivImageSrc($iconDiv, markerDescr.icon, function() {
            self._positionShadow($shadowDiv);
          })
        });
      } else {
        self._setDivImageSrc($iconDiv, markerDescr.icon, function() {
          var w = $iconDiv.attr('width');
          var h = $iconDiv.attr('height');
          $shadowDiv
              .css({
                width: w + 'px',
                height: h + 'px'
              })
              .attr({
                width: w,
                height: h
              });
          self._positionShadow($shadowDiv);
        })
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
      var $wrapper = $('<div></div>');
      $wrapper
          .addClass('markerwrapper')
          .append($shadowDiv);      
      if (this.options.selected) {
        this._setButtonMarker($shadowDiv, $iconDiv, this.options.selected);
        $wrapper.attr('title', this.options.selected.title);
      }

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
        shadow: "/sites/all/modules/gmap/markers/small/shadow.png",
        icon: "/sites/all/modules/gmap/markers/small/red.png"
      }
    }
  });
}) (jQuery);
