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
            #line-chart { width: 100%; height: 100%; }
		</style>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js"></script>
    </head>
    <body>
        <nav class="navbar text-center navbar-expand-md navbar-dark bg-dark">
            <a class="container" href="#">IMA - BALNEABILIDADE</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbars" aria-controls="navbars" aria-expanded="false" aria-label="Toggle Navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
        </nav>
        <main class="container" role="main">&nbsp;</main>
        <main class="container" role="main">
            <div class="starter-template">
                <div class="col-lg-12 row">
                    <canvas id="line-chart"></canvas>
                </div>
            </div>
        </main>
    </body>
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/bootstrap.min.js"></script>
    <script src="assets/js/fontawesome.js"></script>
    <script type="text/javascript">
        jQuery(document).ready(function($) {
            var titles   = [];
            var ecolis   = [];
            var points   = [];
            var collects = [];

            $.ajax({
                cache:false,
                type: "GET",
                url: "ima.php",
                dataType: "json",
                crossDomain: true,
                contentType: 'application/json',
                success: function (result) {
                    var lineT = [];
                    var colorslist = ["","blue","","orange","","magenta","","green","","black","","navy","","yellow","","red"];
                    $.each(result, function (i, iValue) { 
                        var series = [];
                        if (i % 2 == 0) {
                            var ecoli = [];
                            var dataEcoli = [];
                            $.each(result[i], function (j, jValue) {
                                ecoli.push(jValue.ecoli);
                                dataEcoli.push(jValue.data);
                            });

                            series = ecoli;
                            lineT = dataEcoli;
                        }
                        
                        var colors = '';
                        var point_collect = '';
                        
                        if (series.length != 0) {
                            point_collect = result[i-1].Ponto_de_Coleta;
                            colors = colorslist[i-1];

                            points.push({
                                fill: false,
                                data: series,
                                borderColor: colors,
                                label: point_collect,
                            });
                        }
                    });

                    var dataLabels = lineT;
                    var dataSets = points;

                    new Chart(document.getElementById("line-chart"), {
                        type: 'line',
                        data: {
                            labels: dataLabels,
                            datasets: dataSets
                        },
                        options: {
                            title: {
                                display: true,
                                text: 'CIDADE DE '+ result[1].Municipio +' - '+ result[1].Balneario
                            }
                        }
                    });
                },
                error:function(jqXHR, textStatus, errorThrown) {
                    alert('Erro ao carregar');
                }
            });
		});
	</script>
</html>