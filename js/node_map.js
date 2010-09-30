// $id$

// static class for node_map operationing
var node_map = {
  // properties
  map: null,

  // methods
  initialize: function() {
    var options = {
      mapTypeId: google.maps.MapTypeId.HYBRID
    };
    node_map.map = new google.maps.Map(jQuery('#node_map')[0], options);

    // Load markers of needed type
    var type = jQuery('#node_map').attr('data-node-type');
    jQuery.ajax({
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
      var infoWindow = new google.maps.InfoWindow({content: d.title});
      infoWindow.open(node_map.map, marker);      
      jQuery.ajax({
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
    return marker;
  }
}

jQuery(document).ready(function() {
  node_map.initialize();
});