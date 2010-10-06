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

  $block->title = t('Node Map content type');
  $block->content = node_map_page('organization');

  return $block;
}

/**
 * 'Edit form' callback for the content type.
 */
function node_map_content_edit_form(&$form, &$form_state) {
  $conf = $form_state['conf'];
  $form['item1'] = array(
    '#type' => 'textfield',
    '#title' => t('Item1'),
    '#size' => 50,
    '#description' => t('The setting for item 1.'),
    '#default_value' => !empty($conf['item1']) ? $conf['item1'] : '',
    '#prefix' => '<div class="clear-block no-float">',
    '#suffix' => '</div>',
  );
  $form['item2'] = array(
    '#type' => 'textfield',
    '#title' => t('Item2'),
    '#size' => 50,
    '#description' => t('The setting for item 2'),
    '#default_value' => !empty($conf['item2']) ? $conf['item2'] : '',
    '#prefix' => '<div class="clear-block no-float">',
    '#suffix' => '</div>',
  );
  return $form;
}

function node_map_content_edit_form_submit(&$form, &$form_state) {
  foreach (array('item1', 'item2') as $key) {
    $form_state['conf'][$key] = $form_state['values'][$key];
  }
}