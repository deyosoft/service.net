<?php
/**
 * Plugin Name: Services posts.
 * Description: This plugin allows creating post type Service.
 * Author: Deyan Yosifov
 * Author URI: http://deyan-yosifov.com
 * Version: 1.0
 * License: GPLv2
 *
 */

/**
 * Copyright (C) 2015 Deyan Yosifov

 This program is free software; you can redistribute it and/or
 modify it under the terms of the GNU General Public License
 as published by the Free Software Foundation; either version 2
 of the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program; if not, write to the Free Software
 Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * */

/**
 * The main class for the services posts plugin initializations.
 *
 * @author deyan-yosifov
 *
 */
 
class ServiceConstants {
	const Service_Post_Name = "service";
	const Plugin_Text_Domain = "servicePostPlugin";
	const ServiceType_Taxonomy_Name = "serviceTypeTaxonomy";
	const Location_Taxonomy_Name = "locationTaxonomy";
	const Max_Posts_Per_Page = 10;
	
	static function init(){
		// TODO: Define static variables here!
	}
}
ServiceConstants::init();

class Services_Plugin_Initializator {
	
	public function __construct() {
		// create custom posts
		add_action( 'init', array( $this, 'register_service_post' ) );
		add_action( 'init', array( $this, 'register_service_post_taxonomies' ) );
		
		add_action('wp_json_server_before_serve', array( $this, 'servicePostType_restApi_inits' ));		
		add_filter( 'json_query_var-posts_per_page', array( $this, 'restrict_posts_per_page_filter' ));
		add_filter( 'json_query_vars', array( $this, 'prepare_pagination_offset_variable' ));
	}
	
	public function prepare_pagination_offset_variable($valid_vars) {
		$valid_vars[] = 'offset';
		
		return $valid_vars;
	}
	
	public function restrict_posts_per_page_filter($posts_per_page){
		if ( ServiceConstants::Max_Posts_Per_Page < intval( $posts_per_page )  ) {
			$posts_per_page = ServiceConstants::Max_Posts_Per_Page;
		}
		
		return $posts_per_page;
	}
	
	public function servicePostType_restApi_inits($server){		
		require_once dirname( __FILE__ ) . '/dpy_service_rest_api.php';
		$serviceApi = new Dpy_ServicePostType_RestApi($server);
		$serviceApi->register_filters();
	}
	
	public function register_service_post() {
		register_post_type(ServiceConstants::Service_Post_Name, array(
			'labels' => array(
				'name' => __( 'Service', ServiceConstants::Plugin_Text_Domain ),
				'singular_name' => __( 'Service', ServiceConstants::Plugin_Text_Domain ),
				'add_new' => _x( 'Add new', 'pluginbase', ServiceConstants::Plugin_Text_Domain ),
				'add_new_item' => __( 'Add new service', ServiceConstants::Plugin_Text_Domain ),
				'edit_item' => __( 'Edit service', ServiceConstants::Plugin_Text_Domain ),
				'new_item' => __( 'New service', ServiceConstants::Plugin_Text_Domain ),
				'view_item' => __( 'View service', ServiceConstants::Plugin_Text_Domain ),
				'search_items' => __( 'Search services', ServiceConstants::Plugin_Text_Domain ),
				'not_found' =>  __( 'No services found', ServiceConstants::Plugin_Text_Domain ),
				'not_found_in_trash' => __( 'No services found in trash.', ServiceConstants::Plugin_Text_Domain ),
				),
			'description' => __( 'Services.', ServiceConstants::Plugin_Text_Domain ),
			'public' => true,
			'publicly_queryable' => true,
			'query_var' => true,
			'rewrite' => true,
			'exclude_from_search' => true,
			'show_ui' => true,
			'show_in_menu' => true,
			'menu_position' => 40, // probably have to change, many plugins use this
			'supports' => array(
				'title',
				'thumbnail',
				'author',
				'editor',
				'page-attributes',
				//'custom-fields',
				),
		));		
	}	
	
	public function register_service_post_taxonomies() {
		// Service -> Type
		register_taxonomy(ServiceConstants::ServiceType_Taxonomy_Name, 
		Array(ServiceConstants::Service_Post_Name), 
		Array(
			'labels' => array(
					'name'                       => _x( 'Service type', 'taxonomy general name' ),
					'singular_name'              => _x( 'Service type', 'taxonomy singular name' ),
					'add_new_item'               => __( 'Add new service type' ),
			),
			'rewrite' => array( 'slug' => 'ServiceType' ),
			'hierarchical' => true,
			'capabilities' => array(
					'manage_terms' => true
					,'edit_terms' => true
					,'delete_terms' => true
					,'assign_terms' => true
			)
		));
		
		// Service -> Location
		register_taxonomy(ServiceConstants::Location_Taxonomy_Name,
		Array(ServiceConstants::Service_Post_Name),
		Array(
			'label' => __( 'Service location', ServiceConstants::Plugin_Text_Domain ),
			'rewrite' => array( 'slug' => 'Location' ),
			'hierarchical' => true,
			'capabilities' => array(
					'manage_terms' => true
					,'edit_terms' => true
					,'delete_terms' => true
					,'assign_terms' => true
			)
		));
	}
}

// init plugin
new Services_Plugin_Initializator();
