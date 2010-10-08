/**
 * jQuery UI widget for selecting taxonomy terms for node filtering
 */
( function($) {
    $.widget("ui.checkmenu", {
      // fields
      options: { data: null, fadeSpeed: 200 },

      // event handlers
      _topMenuItemMouseEnter: function(a) {
        $(a.currentTarget).children('.submenu:first').stop(true, true).fadeIn(200);
      },

      _topMenuItemMouseLeave: function(a) {
        $(a.currentTarget).children('.submenu:first').hide();
      },

      _parentMenuItemClicked: function(a) {
        
      },

      _menuItemClicked: function(a) {
        $(a.currentTarget).toggleClass('checked');
      },

      // those functions are used to populate the mnu
      _addSubMenu: function($parent, childrenDescr) {
        if (childrenDescr.length) {
          var $subMenu = $('<div></div>');
          $subMenu
              .addClass('submenu')
              .hide();

          for (var i = 0; i < childrenDescr.length; i++) {
            var $item = $('<div></div>');
            $item
                .addClass('item')
                .text(childrenDescr[i].title)
                .click(this._menuItemClicked);
            if (childrenDescr[i].checked) {
              $item.addClass('checked');
            }
            if (childrenDescr[i].children) {
              this._addSubMenu($item, childrenDescr[i].children);
            }
            $subMenu.append($item);
          }

          $parent.append($subMenu);
        }
      },

      _addTopLevelMenu: function(menuDescr) {
        var $newItem = $('<div></div>');
        $newItem
            .addClass('checkmenu-top-menu-item')
            .text(menuDescr.title)
            .mouseenter(this._topMenuItemMouseEnter)
            .mouseleave(this._topMenuItemMouseLeave);
        if (menuDescr.children) {
          this._addSubMenu($newItem, menuDescr.children);
        }
        this.$container.append($newItem);
      },

      // constructor
      _init: function() {
        (this.$container = $('<div></div>')).addClass('checkmenu-top-wrapper');
        this.element
            .addClass("ui-checkmenu ui-widget ui-widget-content ui-corner-all")
            .append(this.$container);

        // test section
        var menuDescr = {
          title: 'Test menu',
          children: [
            {title: 'Test menu 1', value: 'test1', checked: true},
            {title: 'Test menu 2', value: 'test2', checked: false}  
          ]
        };
        this._addTopLevelMenu(menuDescr);
        // end test section
      },

      // destructor
      destroy: function() {
        $.Widget.prototype.destroy.apply(this, arguments); // default destroy
        // now do other stuff particular to this widget        
      }
    });
}) ( jQuery );