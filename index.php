<?php 
    include "modele/php/fonction.php";
    include "modele/php/Config/configBdd.php";
    include "modele/php/classeForm.php";
    
    session_start();

    if(!isset($_GET['action']))
       $_GET['action']="log";
    
    switch($_GET['action']) {

        case "log":
            include("vue/log.php");
        break;

        case "connexion":
            echo connexion();
        break;

        case "accueil":
            include("vue/entete.html");
            include("vue/pied.html");
        break;

        case "reservation":
            include("vue/entete.html");
            if(isset($_GET["dateRef"])){
                echo "<script>var dateRef = '".$_GET["dateRef"]."'</script>";
            }
            include("vue/calendrierTrySup.php");
            include("vue/pied.html");
        break;

        case "salle":
            include("vue/entete.html");
            include("vue/sallesManager.php");
            include("vue/pied.html");
        break;

        case "ligue":
            include("vue/entete.html");
            include("vue/liguesManager.php");
            include("vue/pied.html");
        break;

        case "getSalle":
            print_r(json_encode(getSalle()));
        break;

        case "getLigue":
            print_r(json_encode(getLigue()));
        break;

        case "getReservations":
            if(getReservations($_GET["dateDebut"],$_GET["dateFin"])){
                print_r(json_encode(getReservations($_GET["dateDebut"],$_GET["dateFin"])));
            }
        break;
        
        case "getResByNum":
            if(getResByNum($_GET["reservation_num"])){
                print_r(json_encode(getResByNum($_GET["reservation_num"])));
            }
        break;

        case "getSession":
            print_r(json_encode($_SESSION));
        break;

        case "editerReservation":
            switch($_POST["type"]){
                case "update":
                    echo updateReservation($_POST);
                break;
                case "add":
                    echo addReservation($_POST);
                break;
            }
        break;

        case "editer":
            $_POST = stringToBin($_POST);
            switch($_POST["nomTable"]){
                case "salle":
                    $table = new salle();
                    unset($_POST["nomTable"]);
                break;
                case "ligue":
                    $table = new ligue();
                    unset($_POST["nomTable"]);
                break;
            }
            switch($_POST["type"]){
                case "update":
                    unset($_POST["type"]);
                    $table->update($_POST);
                break;
                case "des":
                    unset($_POST["type"]);
                    $table->update($_POST);
                break;
                case "add":
                    unset($_POST["type"]);
                    $table->add($_POST);
                break;
            }
        break;

        case "suprRes":
            $table = new reservation();
            $msg = $table->suppression("reservation_num = ".$_GET["reservation_num"]);
            print_r($msg);
        break;

        case "test":
            var_dump($_POST);
        break;

    }
?>