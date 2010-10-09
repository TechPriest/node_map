// $id$

// static class for node_map operationing
var node_map = {
  // properties
  map: null,

  // methods
  initialize: function() {
    var options = {
      mapTypeId: google.maps.MapTypeId.HYBRID,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
      },
      navigationControlOptions: {
        style: google.maps.NavigationControlStyle.SMALL
      }
    };
    node_map.map = new google.maps.Map($('#node_map')[0], options);

    // Load markers of needed type
    var type = $('#node_map').attr('data-node-type');
    $.ajax({
      url: '/node_map_callback/markers/' + type,
      dataType: 'json',
      error: function(request, status, exception) {
        alert('Failed to load map data!');
      },
      success: function(data, status, request) {
        node_map.processData(data);
      }
    });
  },

  processData: function(data) {
    // clear the marker list
    $('#node_map_markerlist:first > .wrapper:first').empty();
    // add markers to the map
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < data.length; i++) {
      var d = data[i];
      var marker = node_map.processMarker(d);
      bounds.extend(marker.position);
    }
    // fit all the markers to the map
    node_map.map.fitBounds(bounds);
    node_map.map.setZoom(Math.min(17, node_map.map.getZoom()));
  },
  
  processMarker: function(d) {
    var markerOpts = {
      title: d.title,
      position: new google.maps.LatLng(d.latitude, d.longitude),
      map: node_map.map
    };
    if (d.marker) {
      markerOpts.icon = new google.maps.MarkerImage(d.marker.path + d.marker.iconfile,
          undefined, undefined, new google.maps.Point(d.marker.anchorX, d.marker.anchorY));
      if (d.marker.shadow) {
        markerOpts.shadow = new google.maps.MarkerImage(d.marker.path + d.marker.shadow,
          undefined, undefined, new google.maps.Point(d.marker.anchorX, d.marker.anchorY));
      }
    }
    var marker = new google.maps.Marker(markerOpts);
    google.maps.event.addListener(marker, 'click', function() {
      var infoWindow = new google.maps.InfoWindow({
        content: d.title + '<div class="node_map_loadingsign"></div>',
        disableAutoPan: false
      });
      infoWindow.open(node_map.map, marker);      
      $.ajax({
        url: '/node_map_callback/info/' + d.nid,
        dataType: 'html',
        error: function(request, status, exception) {
          alert('Failed to load node data!');
        },
        success: function(data, status, request) {
          infoWindow.setContent(data);
        }
      });
    });
    // add marker to the list
    var onclickfunc = function() {
        node_map.map.panTo(markerOpts.position);
        return false;
    };
    var itemDiv = document.createElement('div');
    $(itemDiv).attr('class', 'item');
    var markerWrapper = document.createElement('div');
    $(markerWrapper).attr('class', 'markerboxwrapper');
    var markerBox = document.createElement('div');
    $(markerBox).attr('class', 'markerbox');
    var caption = document.createElement('div');
    $(caption).attr('class', 'caption');
    var captionRef = document.createElement('a');
    $(captionRef).attr('href', '#').click(onclickfunc);
    var captionSpan = document.createElement('span');
    $(captionSpan).attr('class', 'text').text(d.title);
    $(captionRef).append(captionSpan);
    $(caption).append(captionRef);
    $(markerWrapper).append(markerBox);
    $(itemDiv).append(markerWrapper);
    $(itemDiv).append(caption);

    $('#node_map_markerlist:first > div.wrapper:first').append(itemDiv);

    var shadowImg = new Image();
    $(shadowImg).load(function() {
      var markerHref = document.createElement('a');
      $(markerHref).attr('href', '#').click(onclickfunc);
      var shadowSpan = document.createElement('span');
      $(shadowSpan)
          .attr('class', 'marker-shadow')
          .css('width', shadowImg.width + 'px')
          .css('height', shadowImg.height + 'px')
          .css('background-image', 'url('+shadowImg.src+')');
      $(markerHref).append(shadowSpan);

      var markerImg = new Image();
      $(markerImg).load(function() {
        var imageSpan = document.createElement('span');
        $(imageSpan)
          .attr('class', 'marker-icon')
          .css('width', markerImg.width + 'px')
          .css('height', markerImg.height + 'px')
          .css('background-image', 'url('+markerImg.src+')');
        $(shadowSpan).append(imageSpan);
        $(markerBox).append(markerHref);
      }).attr('src', d.marker.path + d.marker.iconfile);
    }).attr('src', d.marker.path + d.marker.shadow);

    return marker;
  }
}

$(document).ready(function() {
  node_map.initialize();
  $('#taxonomy_menu').checkmenu();
  
});