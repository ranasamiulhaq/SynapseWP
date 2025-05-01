<?php
/**
 * Plugin Name: Synapse AI Chat Plugin
 * Description: Modular chatbot plugin for FAQ and WooCommerce bots.
 * Version: 1.0
 * Author: Synapse Team
 */

if (!defined('ABSPATH')) {
    die; // Prevent direct access
}

// Include autoloader (if you use Composer)
// require_once __DIR__ . '/vendor/autoload.php';

// Core plugin functionality
require_once plugin_dir_path(__FILE__) . 'includes/class-synapse-plugin.php';

// Activation hook
register_activation_hook(__FILE__, ['Synapse_Plugin', 'activate']);

// Initialize plugin
add_action('plugins_loaded', ['Synapse_Plugin', 'init']);

// AJAX handlers
add_action('wp_ajax_faqbot_fetch_products', ['Synapse_Plugin', 'faqbot_fetch_products']);