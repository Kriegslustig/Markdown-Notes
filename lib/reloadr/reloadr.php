<?php

/**
 * @package reloadr
 * @version 0.1
 */
/*
 * Plugin Name: Reloadr
 * Description: A WordPress-Plugin that reloads all pages when a file in the current theme is updated.
 * Author: Luca Nils Schmid
 * Version: 0.1
 * License: MIT
 * Author URI: http://netzkinder.cc/
 * Plugin URI: https://github.com/Kriegslustig/reloadr
*/

require 'settings.php';

// This will Probably change later
$plugin_name = 'reloadr';

/*
 * Enqueing my JS in the frontend
 */
add_action('wp_enqueue_scripts', 'reloadr_wp_enqueue_scripts');
function reloadr_wp_enqueue_scripts () {
  wp_enqueue_script('reloadr', plugin_dir_url(__FILE__) . 'reloadr.js', array(), false, true);
}

/*
 * This adds the JS defining variables for the eventSource script
 * It defines the location of the php sourceScript and sets the flag for notifications
 * the script gets in the WP_Head section
 */
add_action('wp_head', 'js_set_event_source');
function js_set_event_source () {
  $settings_arr = [
    'ignore' => get_option('reloadr_ignore'),
    'watch_dir' => get_option('reloadr_watch_direcotry')
  ];
  $url = plugin_dir_url(__FILE__) . 'source.php';
  $url .= '?' . http_build_query($settings_arr);
  $notifications = (get_option('reloadr_notifications') == 'on' ? 'true' : 'false');
  echo "<script>var reloadr = {reloadSource: '$url', notifications: $notifications};</script>";
}