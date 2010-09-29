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
      url: '/node_map_callback/' + type,
      dataType: 'json',
      error: function(request, status, exception) {
        alert('Failed to load map data');
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
      var marker = new google.maps.Marker({
        title: d.info,
        position: new google.maps.LatLng(d.latitude, d.longitude),
        map: node_map.map
      });
      bounds.extend(marker.position);
    }
    // fit all the markers to the map
    node_map.map.fitBounds(bounds);
    node_map.map.setZoom(Math.min(14, node_map.map.getZoom()));
  }
}

jQuery(document).ready(function() {
  node_map.initialize();
});