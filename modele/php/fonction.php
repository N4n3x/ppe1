<?php
    function sessionInit($tb){
        foreach($tb as $var=>$val){
            if(!isset($_SESSION[$var])) $_SESSION[$var]=$val;
        }
    }

    function postInit(){
        $tb=func_get_args();
        for($i=0; $i<count($tb);$i=$i+2){
            if(!isset($_POST[$tb[$i]])) $_POST[$tb[$i]]=$tb[$i+1];
        }  
    }

    function connexion(){
        $user = new utilisateur();
        $conditions = 'utilisateur_identifiant LIKE "'.$_POST["identifiant"].'" AND utilisateur_mdp LIKE "'.$_POST["motDePasse"].'"';
        $champs = array("utilisateur_verr","utilisateur_admin","ligue_nom","ligue_num");
        $testCnx = $user->executer($champs,$conditions);
        
        if($testCnx){
            if($testCnx[0]["utilisateur_verr"]=" "){
                $_SESSION["utilisateur_nom"] = $_POST["identifiant"];
                $_SESSION["utilisateur_admin"] = $testCnx[0]["utilisateur_admin"];
                $_SESSION["ligue_nom"] = $testCnx[0]["ligue_nom"];
                $_SESSION["ligue_num"] = $testCnx[0]["ligue_num"];
                $res = "true";
            }
        }else{
            $res = "false";
        }
        return $res;
    }

    function getSalle(){
        $lesSalles = new salle();
        $champs= array("salle_num","salle_nom","salle_places","salle_informatise","salle_verr");
        $conditions = "salle_verr IS null";
        $tbSalles = $lesSalles->executer($champs,$conditions);
        return $tbSalles;
    }

    function getLigue(){
        $lesLigues = new ligue();
        $champs= array("ligue_num","ligue_nom","ligue_sport","ligue_tel","ligue_verr");
        $conditions = "ligue_verr IS null";
        $tbLigues = $lesLigues->executer($champs,$conditions);
        return $tbLigues;
    }

    function getReservations($debut,$fin){
        $lesReservations = new reservation();
        $champs = array("reservation_num", "salle_nom", "ligue_nom", "reservation_debut", "reservation_fin");
        $conditions = 'reservation_debut BETWEEN "';
        $conditions .= $debut.'" AND "'.$fin.'" ORDER BY reservation_debut';
        $tb=$lesReservations->executer($champs,$conditions);
        return $tb;
    }

    function getResByNum($num){
        $lesReservations = new reservation();
        // $champs = array("reservation_num", "salle_nom", "ligue_nom", "reservation_debut", "reservation_fin");
        $champs = array("reservation_debut", "reservation_fin", "salle_places", "salle_informatise");
        $conditions = "reservation_num = ".$num;
        $tb=$lesReservations->executer($champs,$conditions);
        return $tb;
    }

    function updateReservation($tbData){
        $table = new reservation();
        $table->suppression("reservation_num = ".$tbData["numRes"]);
        if(strlen($tbData["reservation_debutH"])==1){
            $tbData["reservation_debutH"] = "0".$tbData["reservation_debutH"];
        }
        if(strlen($tbData["reservation_debutM"])==1){
            $tbData["reservation_debutM"] = "0".$tbData["reservation_debutM"];
        }
        $tbData["reservation_debut"] = $tbData["date"]." ".$tbData["reservation_debutH"].":".$tbData["reservation_debutM"];
        
        if(strlen($tbData["reservation_finH"])==1){
            $tbData["reservation_finH"] = "0".$tbData["reservation_finH"];
        }
        if(strlen($tbData["reservation_finM"])==1){
            $tbData["reservation_finM"] = "0".$tbData["reservation_finM"];
        }
        $tbData["reservation_fin"] = $tbData["date"]." ".$tbData["reservation_finH"].":".$tbData["reservation_finM"];
        if($tbData["salle_informatise"]=="OUI"){
            $tbData["salle_informatise"] = 1;
        }else{
            $tbData["salle_informatise"] = 0;
        }
        if($tbData["salle_places"]<=18){
            $tbData["salle_places"] = 18;
        }else{
            $tbData["salle_places"] = 30;
        }
        unset($tbData["type"],$tbData["numRes"],$tbData["reservation_finH"],$tbData["reservation_debutH"],$tbData["reservation_debutM"],$tbData["reservation_finM"],$tbData["date"]);
        $tbData["ligue_num"] = $_SESSION["ligue_num"];
        $resReq = $table->addReservation($tbData);
        if(is_object($resReq)){
            return $resReq->errorInfo[2];
        }else{
            return $resReq;
        }
    }

    function addReservation($tbData){
        $table = new reservation();
        $tbData["reservation_debut"] = $tbData["date"]." ".$tbData["reservation_debutH"];
        if(strlen($tbData["reservation_finH"])==1){
            $tbData["reservation_finH"] = "0".$tbData["reservation_finH"];
        }
        if(strlen($tbData["reservation_finM"])==1){
            $tbData["reservation_finM"] = "0".$tbData["reservation_finM"];
        }
        $tbData["reservation_fin"] = $tbData["date"]." ".$tbData["reservation_finH"].":".$tbData["reservation_finM"];
        if($tbData["salle_informatise"]=="OUI"){
            $tbData["salle_informatise"] = 1;
        }else{
            $tbData["salle_informatise"] = 0;
        }
        if($tbData["salle_places"]<=18){
            $tbData["salle_places"] = 18;
        }else{
            $tbData["salle_places"] = 30;
        }
        unset($tbData["type"],$tbData["reservation_finH"],$tbData["reservation_debutH"],$tbData["reservation_finM"],$tbData["date"]);
        $tbData["ligue_num"] = $_SESSION["ligue_num"];
        $resReq = $table->addReservation($tbData);
        if(is_object($resReq)){
            return "Réservation impossible";
        }else{
            return $resReq;
        }
    }

    function stringToBin($tbData){
        foreach($tbData as $key => $value){
            if($value === "OUI" || $value === "oui" || $value === "1"){
                $tbData[$key] = 1;
            }
            if($value === "NON" || $value === "non" || $value === "0"){
                $tbData[$key] = 0;
            }
        }
        return $tbData;
    }

    // function DisplayOccupation($year){
    //     $lesReservations = new reservation();
    //     $tbOccup = $lesReservations->Occupation($year);
    //     return $tbOccup;
    // }

    function ResGeneration($nbRes, $dateStart){
        $reservations = new reservation();
        
        for($j = 1; $j < 30; $j++){
            for($i = 0; $i < 5; $i++){
                $dateEnd = new DateTime();
                $dateStart->setDate($dateStart->format("Y"), $dateStart->format("m"), $j);
                $dateEnd->setDate($dateStart->format("Y"), $dateStart->format("m"), $j);
                $start = rand(8,16);
                $dateStart->setTime($start,0,0);
                $end = $start + rand(1,4);
                $dateEnd->setTime($end,0,0);
                $laReservation["reservation_debut"] = $dateStart->format('Y-m-d H:i:s');
                $laReservation["reservation_fin"] = $dateEnd->format('Y-m-d H:i:s');
                $laReservation["salle_informatise"] = rand(0,1); // 0 ou 1
                $laReservation["ligue_num"] = rand(1,10); // 1 à 10
                $laReservation["salle_places"] = 18; // 18 ou 30
                $res = $reservations->addReservation($laReservation);
            }
        }
        return [$start,$end,$dateStart,$dateEnd];
    }
?>