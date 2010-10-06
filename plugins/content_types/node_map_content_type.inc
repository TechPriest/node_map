<?php
// $id$

/**
 * @file
 * "Node map" content type.
 * Used to wrap node_map into panel.
 */

/**
 * Plugins are described by creating a $plugin array which will be used
 * by the system that includes this file.
 */
$plugin = array(
  'title' => t('Node Map'),
  'description' => t('Node Map content type. Renders Node Map.'),
  'single' => TRUE,
  // Constructor
  'content_types' => array('node_map_content_type'),
  'render callback' => 'node_map_content_type_render',
  'defaults' => array(),
  // This explicitly declares the config form. Without this line, the func would be
  // ctools_plugin_example_no_context_content_type_edit_form.
  'edit form' => 'node_map_content_edit_form',
  // 'icon' => 'icon.png',    // do not care about icon for now
  'category' => array(t('Node Map'), -9),
  // this contetnt type does not provide 'admin info', which would populate the
  // panels builder page preview.
);


/**
 * Run-time rendering of the body of the block.
 *
 * @param $subtype
 * @param $conf
 *   Configuration as done at admin time.
 * @param $args
 * @param $context
 *
 * @return
 *   An object with at least title and content members.
 */
function node_map_content_type_render($subtype, $conf, $args, $context) {
  $block = new stdClass();
  if ($type = isset($conf['node_type']) ? $conf['node_type'] : '') {
    $typename = db_result(db_query(sprintf('SELECT name FROM {node_type} WHERE type="%s" LIMIT 1', db_escape_string($type))));
    $block->title = t('Node Map') . ' - ' . $typename;
    $block->content = node_map_page($type);
  } else {
    drupal_set_message(t('Node type not set'), 'error');
    $block->title = t('Node Map content type');
    $block->content = t('Node type not set');
  }
  return $block;
}

/**
 * 'Edit form' callback for the content type.
 */
function node_map_content_edit_form(&$form, &$form_state) {
  $conf = $form_state['conf'];
  // gather node types
  $options = array();
  $types = db_query('SELECT type, name FROM {node_type}');
  while ($type = db_fetch_object($types)) {
    $options[$type->type] = $type->name;
  }
  // form controls
  $form['node_type'] = array(
    '#type' => 'radios',
    '#options' => $options,
    '#title' => t('Node type'),
    '#description' => t('Node type for this map'),
    '#default_value' => isset($conf['node_type']) ? $conf['node_type'] : '',
    '#prefix' => '<div class="clear-block no-float">',
    '#suffix' => '</div>'
  );

  return $form;
}


/**
 * Stores entered configuration values
 * 
 * @param  $form
 * @param  $form_state
 * @return void
 */
function node_map_content_edit_form_submit(&$form, &$form_state) {
  foreach (array('node_type') as $key) {
    $form_state['conf'][$key] = $form_state['values'][$key];
  }
}