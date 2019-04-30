<?php

include("modele/php/bdd.php");

//##########################################################################################################
//####### Base de données mydb ###########################################################################
//##########################################################################################################

Class ahernandez extends sql{
  protected $Serveur = 'localhost';
  protected $Bddnom = 'ahernandez';
  protected $Identifiant = 'ahernandez';
  protected $Mdp = 'aifccSIO';
  protected $tbJointures=array();


  public function __construct($id=0){
    parent::__construct($id);
  }
}


//##########################################################################################################
//####### Tables de mydb #################################################################################
//##########################################################################################################

class ligue extends ahernandez{};
class reservation extends ahernandez{
  public function addReservation($tb){
    $sql='call resSalle("'.$tb["reservation_debut"].'","'.$tb["reservation_fin"].'",'.$tb["salle_informatise"].','.$tb["ligue_num"].','.$tb["salle_places"].')';
    return $this->exeReq($sql);
  }
};
class salle extends ahernandez{};
class utilisateur extends ahernandez{};
?>
