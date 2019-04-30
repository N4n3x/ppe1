<?php
    session_unset();
?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr">
<head>
    <title>PPE 2 - Reservation de salle de classe</title>
    <meta http-equiv="Content-Type" content="text/HTML; charset=UTF8"/>
    <link rel="stylesheet" type="text/css" href="css/style.css"/>
    <script type="text/javascript" src="modele/js/jquery-3.3.1.js"></script>
</head>
<body>
    <div class="caps">
        <h2>La maison des ligues</h2>
        <form>
            <input type="text" class="" placeholder="identifiant" id="identifiant" name="identifiant" value="" required/>
            <input  type="password" class="" placeholder="Mot de passe" id="motDePasse" name="motDePasse" required>
            <input type="submit" value="Connexion" /> 
        </form>
        <div id="rep"></div>
        <script type="text/javascript">
            jQuery(document).ready(function () {
                jQuery( "form" ).submit(function (e) {
                    e.preventDefault();
                    var $dataCnx = $( "form" ).serialize();
                    jQuery.ajax({
                        method : "POST",
                        url: "./index.php?action=connexion",
                        async: true,
                        data: $dataCnx
                    }).done(function(reponse){
                        console.log(reponse);
                        if(reponse==="true"){
                            window.location.href = "./index.php?action=accueil";
                        }else{
                            $("#rep").html("Erreur");
                        }
                    });
                });
            })
        </script>
    </div>
</body>
</html>
