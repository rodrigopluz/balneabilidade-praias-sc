<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="author" content="Rodrigo Pereira">
    <meta name="description" content="IMA - BOOTSTRAP FRAMEWORK FRONT-END">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IMA - BOOTSTRAP FRONT-END</title>
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/style.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js" defer></script>
    <script src="assets/js/jquery.min.js" defer></script>
    <!-- <script src="assets/js/script.js" defer></script> -->
</head>
<body>
    <header>
        <nav class="navbar navbar-expand-md navbar-dark bg-dark">
            <a class="container navbar-brand" href="#">IMA - BALNEABILIDADE</a>
            <!--
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle Navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            -->
        </nav>
    </header>
    <main class="container">
        <div class="starter-template">
            <label for="municipio-select" class="form-label">Selecione o município:</label>
            <select id="municipio-select" class="form-select">
                <option value="" selected disabled>Escolha um município</option>
                <option value="1">Biguaçu</option>
                <option value="2">Florianópolis</option>
                <option value="3">São José</option>
                <option value="4">Palhoça</option>
                <option value="5">Garopaba</option>
                <option value="6">Imbituba</option>
                <option value="7">Laguna</option>
                <option value="8">Jaguaruna</option>
                <option value="9">Balneário Rincão</option>
                <option value="10">Araranguá</option>
                <option value="11">Passo de Torres</option>
                <option value="12">Balneário Arroio do Silva</option>
                <option value="14">Balneário Gaivota</option>
                <option value="15">Itapoá</option>
                <option value="16">Joinville</option>
                <option value="17">São Francisco do Sul</option>
                <option value="18">Balneário da Barra do Sul</option>
                <option value="19">Barra Velha</option>
                <option value="20">Balneário Piçarras</option>
                <option value="21">Penha</option>
                <option value="22">Navegantes</option>
                <option value="23">Itajaí</option>
                <option value="24">Balneário Camboriú</option>
                <option value="25">Itapema</option>
                <option value="26">Porto Belo</option>
                <option value="27">Bombinhas</option>
                <option value="28">Governador Celso Ramos</option>
                <option value="29">Paulo Lopes</option>
            </select>
            <!-- <canvas id="line-chart"></canvas> -->
        </div>
    </main>
</body>
</html>
