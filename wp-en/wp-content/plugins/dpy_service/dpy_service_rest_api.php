<?php
class Dpy_ServicePostType_RestApi extends WP_JSON_CustomPostType {
	//$var servicePluginName = ServiceConstants::Plugin_Text_Domain;
	protected $base = '/servicePostPlugin/services';
	protected $type = 'service';	

	public function register_routes( $routes ) {
		$routes = parent::register_routes( $routes );
		// $routes = parent::register_revision_routes( $routes );
		// $routes = parent::register_comment_routes( $routes );
	
		// Add more custom routes here
	
		return $routes;
	}
}
