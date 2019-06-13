<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="author" content="Rodrigo Pereira">
        <meta name="description" content="IMA - MATERIALIZE FRAMEWORK FRONT-END -">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>IMA - MATERIALIZE FRAMEWORK FRONT-END -</title>
        <link rel="stylesheet" href="assets/css/fontawesome.css">
        <link rel="stylesheet" href="assets/css/materialize.min.css">
        <link rel="stylesheet" href="assets/css/style.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js"></script>
    </head>
    <body>
        <nav>
            <div class="container">
                <a class="" href="#">IMA - BALNEABILIDADE</a>
            </div>
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
    <script src="assets/js/materialize.min.js"></script>
    <script src="assets/js/fontawesome.js"></script>
    <script type="text/javascript">
        jQuery(document).ready(function($) {
            var titles   = [],
                ecolis   = [],
                points   = [],
                collects = [];

            $.ajax({
                cache:false,
                type: "GET",
                url: "ima.php",
                dataType: "json",
                crossDomain: true,
                contentType: 'application/json',
                success: function (result) {
                    var lineT = [],
                        colorslist = ["lime","blue","cyan","orange","amber","magenta","teal","green","brown","black","grey","navy","white","yellow","pink","red","ruby","iron"];
                    
                    $.each(result, function (i, iValue) {
                        // console.log(iValue);
                        var series = [];
                        if (i % 2 == 0) {
                            var ecoli = [],
                                dataEcoli = [];

                            $.each(result[i], function (j, jValue) {
                                ecoli.push(jValue.ecoli);
                                dataEcoli.push(jValue.data);
                            });

                            series = ecoli;
                            lineT = dataEcoli;
                        }
                        
                        var colors = '',
                            point_collect = '';
                        
                        if (series.length != 0) {
                            point_collect = result[i-1].Ponto_de_Coleta +": "+ result[i-1].Localizacao;
                            colors = colorslist[i-1];

                            points.push({
                                fill: false,
                                data: series.reverse(),
                                borderColor: colors,
                                label: point_collect,
                            });
                        }
                    });

                    var dataLabels = lineT.reverse(),
                        dataSets = points,
                        year = dataLabels[0].split('/');

                    new Chart(document.getElementById("line-chart"), {
                        type: 'line',
                        data: {
                            labels: dataLabels,
                            datasets: dataSets
                        },
                        options: {
                            title: {
                                display: true,
                                text: 'CIDADE DE '+ result[1].Municipio +' - '+ result[1].Balneario +' - ANO: '+ year[2]
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