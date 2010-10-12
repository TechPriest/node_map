<?php
// $id$

/**
 * Gathers marker info
 *
 * @param bool $reset
 * @return void
 */
function node_map_get_marker_info($reset = FALSE) {
  if ($reset || !($markerdata = cache_get('node_map_marker_info'))) {
    $markerdir = variable_get('gmap_markerfiles', drupal_get_path('module', 'gmap') .'/markers');
    $markerdata = _node_map_process_marker_dir($markerdir);
    cache_set('node_map_marker_info', $markerdata);
  }
  else
    $markerdata = $markerdata->data;
  return $markerdata;
}