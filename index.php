<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>IMA</title>
        <link rel="stylesheet" href="assets/css/fontawesome.css">
        <link rel="stylesheet" href="assets/css/bootstrap.min.css">
        <style type="text/css">
			.carregando { color:#666; display:none; }
		</style>
    </head>
    <body>
        <?php $con = new mysqli( 'localhost', 'root', '', 'sys_tsi_ifc' ); ?>
        <?php $con->set_charset("utf8"); ?>
        <nav class="navbar text-center navbar-expand-md navbar-dark bg-dark">
            <a class="container" href="#">IMA</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbars" aria-controls="navbars" aria-expanded="false" aria-label="Toggle Navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
        </nav>
        <main class="container" role="main">&nbsp;</main>
        <main class="container" role="main">
            <div class="starter-template">
                <div class="col-lg-12 row">
                    
                </div>
            </div>
        </main>
    </body>
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/bootstrap.min.js"></script>
    <script src="assets/js/fontawesome.js"></script>
    <script type="text/javascript">
		jQuery( document ).ready( function( $ ) {
			var $table1 = jQuery( '#table-1' );
			
			// Initialize DataTable
			$table1.DataTable( {
				"aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
				"bStateSave": true
			});
			
			// Initalize Select Dropdown after DataTables is created
			$table1.closest( '.dataTables_wrapper' ).find( 'select' ).select2( {
				minimumResultsForSearch: -1
			});
		} );
	</script>
</html>