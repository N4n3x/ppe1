<?php

include("modele/php/bdd.php");

//##########################################################################################################
//####### Base de données mydb ###########################################################################
//##########################################################################################################

Class ppe1 extends sql{
  protected $Serveur = 'localhost';
  protected $Bddnom = 'ppe1.2';
  protected $Identifiant = 'root';
  protected $Mdp = '';
  protected $tbJointures=array();


  public function __construct($id=0){
    parent::__construct($id);
  }
}


//##########################################################################################################
//####### Tables de mydb #################################################################################
//##########################################################################################################

class ligue extends ppe1{};
class reservation extends ppe1{
  public function addReservation($tb){
    $sql='call resSalle("'.$tb["reservation_debut"].'","'.$tb["reservation_fin"].'",'.$tb["salle_informatise"].','.$tb["ligue_num"].','.$tb["salle_places"].')';
    return $this->exeReq($sql);
  }
};
class salle extends ppe1{};
class utilisateur extends ppe1{};
?>
