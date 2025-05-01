<?php
if (!defined('ABSPATH')) {
    die;
}

class Synapse_Admin_Upload {
    public static function process_upload() {
        if (isset($_FILES['faq_doc'])) {
            $uploaded_file = $_FILES['faq_doc'];

            // Check for errors
            if ($uploaded_file['error'] === UPLOAD_ERR_OK) {
                // Process the uploaded file
                $upload_dir = plugin_dir_path(__DIR__, 2) . 'uploads/'; // Go up two levels to plugin root
                if (!is_dir($upload_dir)) {
                    mkdir($upload_dir, 0777, true);
                }

                $move_file = move_uploaded_file($uploaded_file['tmp_name'], $upload_dir . $uploaded_file['name']);

                if ($move_file) {
                    // File successfully uploaded
                } else {
                    // Handle errors
                }
            } else {
                // Handle file upload error
            }
        }

        // Redirect back to the admin dashboard
        wp_redirect(admin_url('admin.php?page=faq_rag_bot'));
        exit;
    }
}