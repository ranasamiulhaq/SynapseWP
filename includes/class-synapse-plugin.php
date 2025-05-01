<?php
if (!defined('ABSPATH')) {
    die;
}

class Synapse_Plugin {

    public static function init() {
        // Instantiate classes and setup actions/filters
        self::includes();
        self::init_hooks();
    }

    private static function includes() {
        // Include other necessary files
        require_once plugin_dir_path(__DIR__) . 'includes/functions.php';
        require_once plugin_dir_path(__DIR__) . 'admin/class-admin-menu.php';
        require_once plugin_dir_path(__DIR__) . 'admin/class-admin-upload.php';
        require_once plugin_dir_path(__DIR__) . 'includes/class-woocommerce.php';
        require_once plugin_dir_path(__DIR__) . 'public/class-public-chat.php';
    }

    private static function init_hooks() {
        add_action('admin_menu', ['Synapse_Admin_Menu', 'add_admin_menu']);
        add_action('admin_enqueue_scripts', ['Synapse_Admin_Menu', 'enqueue_admin_assets']);
        add_action('wp_enqueue_scripts', ['Synapse_Public_Chat', 'enqueue_public_assets']);
        add_action('wp_footer', ['Synapse_Public_Chat', 'add_chat_html']);
        add_action('admin_post_faqbot_upload', ['Synapse_Admin_Upload', 'process_upload']);
    }

    public static function activate() {
        // Activation logic (e.g., create database tables, set options)
        $site_id = get_option('your_plugin_site_id');
        if (!$site_id) {
            $site_id = wp_generate_uuid4();
            update_option('your_plugin_site_id', $site_id);
        }
    }

    public static function faqbot_fetch_products() {
        Synapse_WooCommerce::fetch_products();
    }
}