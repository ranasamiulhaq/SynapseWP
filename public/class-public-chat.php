<?php
if (!defined('ABSPATH')) {
    die;
}

class Synapse_Public_Chat {
    public static function enqueue_public_assets() {
        wp_enqueue_style('synapse-chat-style', plugin_dir_url(__FILE__) . 'css/chat-styles.css');
        wp_enqueue_script('synapse-chat-script', plugin_dir_url(__DIR__) . 'public/js/chat-scripts.js', [], false, true);
        
        $site_id = get_option('your_plugin_site_id');
        wp_localize_script('synapse-admin-upload', 'faqbotData', ['site_id' => $site_id]);
    }

    public static function add_chat_html() {
        include_once plugin_dir_path(__DIR__) . 'public/partials/chat-interface.php';
    }
}