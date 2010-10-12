/**
 * Marker selector widget
 *
 * @TODO: Write documentation here
 *
 */
( function($) {
  $.widget("ui.markerselect", {
    listVisible: false,
    $shadowDiv: null,
    $iconDiv: null,
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

    _fillItem: function($itemDiv, itemName, itemDescr) {
      var self = this;
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
      $shadowDiv.attr('title', itemDescr.name);

      var $captionDiv = $('<div></div>');
      $captionDiv
          .addClass('caption')
          .text(itemDescr.name);
      $itemDiv.append($captionDiv);
      $itemDiv.click( function() {
        self.$input.val(itemName);
        // update marker on the button
        self._setButtonMarker(self.$shadowDiv, self.$iconDiv, itemDescr);
        self.$shadowDiv.attr('title', itemDescr.name);
        // no need to hide the list - parent handler does this for us
      });
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

      var data = this.options.data;
      var empty = {name: "No Marker"};
      var $emptyItemDiv = $('<div></div>');
      $emptyItemDiv.addClass('item');
      this._fillItem($emptyItemDiv, "", empty);
      $overview.append($emptyItemDiv);
      for (var i in data) {
        var markerDescr = data[i];
        var $itemDiv = $('<div></div>');
        $itemDiv.addClass('item');
        this._fillItem($itemDiv, i, markerDescr);
        $overview.append($itemDiv);
      }
      this.options.data = null;
      $viewport.append($overview);
      this.element.append(this.$list);
      this.$list.tinyscrollbar({sizethumb: 15});
      this.$list.hide();
    },

    _showList: function() {
      if (!this.listVisible) {
        if (!this.$list) {
          this._createList();
        }
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
        self._setDivImageSrc($shadowDiv, markerDescr.path + markerDescr.shadow, function() {
          if (markerDescr.iconfile) {
            self._setDivImageSrc($iconDiv, markerDescr.path + markerDescr.iconfile, function() {
              self._positionShadow($shadowDiv);
            })
          } else {
            self._positionShadow($shadowDiv);            
          }
        });
      } else if (markerDescr.iconfile) {
        self._setDivImageSrc($iconDiv, markerDescr.path + markerDescr.iconfile, function() {
          var w = $iconDiv.attr('width');
          var h = $iconDiv.attr('height');
          $shadowDiv
              .css({
                width: w + 'px',
                height: h + 'px',
                backgroundImage: 'none'
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
          value: this.options.selectedName 
        });

      self.$shadowDiv = $('<div></div>');
      self.$iconDiv = $('<div></div>');
      self.$shadowDiv.addClass('shadow');
      self.$iconDiv.addClass('icon');
      self.$shadowDiv.append(self.$iconDiv);
      var $wrapper = $('<div></div>');
      $wrapper
          .addClass('markerwrapper')
          .append(self.$shadowDiv);
      if (this.options.selectedName && !this.options.selected) {
        this.options.selected = this.options.data[this.options.selectedName];
      }
      if (self.options.selected) {
        self._setButtonMarker(self.$shadowDiv, self.$iconDiv, this.options.selected);
        self.$shadowDiv.attr('title', this.options.selected.name);
        self.$input.val(self.options.selectedName);
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
      data: [],
      selectedName: null,
      selected: null
    }
  });
}) (jQuery);
