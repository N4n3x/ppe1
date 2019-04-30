<?php
Class SQL
{
  public $Connexion;
  public $Resultat = FALSE;
  public $nomId;
  public $select = "SELECT * ";
  public $join= " INNER JOIN ";
  public $where = " WHERE ";
  public $id;
  public $orderBy = " ORDER BY ";
  public $limit = " LIMIT ";
  public $data = array();


//##########################################################################################################
//	 __constructeur($id:entier)
//   @arg: si $id n'est pas valorisé, alors tous les enregistrements sont pris en considération
//   * Se connecte à la base de données
//   * Valorise les attibuts $id, $Connexion, $where(si $id!=0)
//   * Récupère le résultat (si $id!=0)
//##########################################################################################################
  public function __construct($id=0) {
    $this->id=$id;
    $this->Connexion = new PDO ('mysql:host='.$this->Serveur.';dbname='.$this->Bddnom,$this->Identifiant,$this->Mdp);
    if(get_class($this)!="sql"){
      $Resultat=$this->Connexion->query("SHOW COLUMNS FROM ".get_class($this));
      $Obj=$Resultat->fetch(PDO::FETCH_OBJ);
      $this->nomId=$Obj->Field; // Récupère le nom de la clé primaire exemple edi_id
    }
	  if($id!=0) {
		  $this->where.=$this->nomId."=".$this->id;
		  $this->lire();
	  }
  }


//##########################################################################################################
//	 jointure($tbEt:chaîne, $idEt:chaîne, $tbPrim:chaîne, $idPrim:chaîne)
//   @arg: $tbEt   : nom de la table comportant la clé étrangère
//   @arg: $idEt   : nom de la clé étrangère
//   @arg: $tbPrim : nom de la table comportant la clé primaire
//   @arg: $idPrim : nom de la clé primaire
//   * Remplit le tableau $tbJointures
//##########################################################################################################
  protected function jointure($tbEt,$idEt,$tbPrim,$idPrim){
    $this->tbJointures[]=array($tbEt,$idEt,$tbPrim,$idPrim);
  }


//##########################################################################################################
//	 executer()
//   * Assemble les divers éléments constitutifs d'une requête SQL de type SELECT
//   * Exécute la requête SQL
//##########################################################################################################
  public function executer() {
    $sql=$this->select;
    $sql.="FROM ".get_class($this);

	if($this->join!=" INNER JOIN "){ //Concatène l'attribut $join à $sql (si pas vide)
          $sql.=$this->join;
    }
    if($this->where!=" WHERE "){ //Concatène l'attribut $where à $sql (si pas vide)
          $sql.=$this->where;
    }
    if($this->orderBy!=" ORDER BY "){ //Concatène l'attribut $orderBy à $sql (si pas vide)
          $sql.=$this->orderBy;
    }
    if($this->limit!=" LIMIT "){ //Concatène l'attribut $limit à $sql (si pas vide)
          $sql.=$this->limit;
    }

    $this->Resultat=$this->Connexion->query($sql);
  }


//##########################################################################################################
//	 lire()
//   * Exécute la requête SQL si elle n'a pas été exécutée
//   * Passe au résultat suivant
//   * Valorise les attributs correspondant aux champs de la table
//   * Valorise l'attribut $id
//   @return:  si résultat alors $this sinon FALSE
//##########################################################################################################
  public function lire() {
    if ($this->Resultat==FALSE) {
      $this->executer();
    }
    $obj=$this->Resultat->fetch(PDO::FETCH_OBJ);
  	if($obj!=FALSE) {
      $this->data=array();
  		foreach($obj AS $champ=>$val) {
        $this->$champ=utf8_encode($val);
        $this->data[]=utf8_encode($val);
  		}
  	}
  	eval('$this->id=$this->'.$this->nomId.';');
  	if($obj) {
  		return $this;
  	}
  	else {
  		return FALSE;
  	}
  }


//##########################################################################################################
//	 trier($champ:chaîne)
//   @arg: $champ: nom d'un champ (peut être précédé de "-" pour tri décroissant)
//   * Trie sur un champ
//##########################################################################################################
  public function trier($champ) {
    if($champ[0]=="+" OR $champ[0]=="-"){
          $this->orderBy.=substr($champ, 1);
    }
    else {
      $this->orderBy.=$champ;
    }
    if($champ[0]=="-") {
      $this->orderBy.=" DESC ";
    }
  }


//##########################################################################################################
//	 filtrer($champ:chaîne, $condition:chaîne)
//   @arg: $champ : nom du champ sur lequel appliquer une condition
//   @arg: $condition : condition à appliquer (opérateurs possibles : >, >=, <, <=, !)
//   * Filtre les résultats en fonction d'une condition appliquée à un champ
//##########################################################################################################
  public function filtrer($champ,$condition){
    if($this->where!=" WHERE "){ $this->where.=" AND ";} //Vérifie si le WHERE n'est pas vide
    if(preg_match("/^([><]={0,1})(.*)/",$condition,$get)){ //La condition commence par >,<,>=,<=
      $this->where.=$champ.$get[1].'"'.$get[2].'"';
    }
    elseif (preg_match("/^(!)(.*)/",$condition,$get)) { //La condition commence par !
      $this->where.=$champ.$get[1].'="'.$get[2].'"';
    }
    else{
      if(preg_match("/[%_]/",$condition)){ //La condition se conforme à un modèle (LIKE)
        $this->where.=$champ.' LIKE "'.$condition.'"';
      }
      else {
        $this->where.=$champ.' = "'.$condition.'"';
      }
    }
  }


//##########################################################################################################
//	 compter()
//   * Compte le nombre de résultats de la requête SQL
//   @return: le nombre de résultats de la requête SQL
//##########################################################################################################
  public function compter(){
    $select=$this->select; //Stock temporairement la valeur de SELECT
    $this->select="SELECT COUNT(*) AS nb ";
    $res=$this->lire();
    $this->select=$select;
    $this->Resultat=FALSE;
    return $res->nb;
  }


//##########################################################################################################
//	 paginer($numPage:entier, $nombre:entier)
//   @arg: $numPage : numéro de la page à récupérer
//   @arg: $nombre : nombre d'éléments par page (par défaut 10)
//   * Récupère les enregistrements correspondant à une page
//##########################################################################################################
  public function paginer($numPage,$nombre=10){
    $this->limit.=($numPage-1)*$nombre.",".$nombre;
  }


//##########################################################################################################
//	 nbPageMax($nombre:entier)
//   @arg: $nombre : nombre d'éléments par page (par défaut 10)
//   * Calcule le nombre maximal de pages
//   @return: nombre maximal de pages
//##########################################################################################################
  public function nbPageMax($nombre=10){
    return ceil($this->compter()/$nombre); //Retourne l'entier supérieur
  }


//##########################################################################################################
//	 __call($methode:chaîne, $arguments:tableau)
//   * Permet de récupèrer une méthode qui n'est pas déclarée dans une classe
//   * Gére les jointures (ex: $lesAuteurs=$unDocument->auteur() )
//   @return: un objet instancié à partir de la classe SQL
//##########################################################################################################
  public function __call($methode,$arguments){
    foreach($this->tbJointures as $jointure){
	  // ### 1er cas => en partant d'une table fille vers la table mère ###
      if($jointure[0]==$methode AND $jointure[2]==get_class($this)){
        $obj=new $jointure[0]();
		$obj->where.=$jointure[1]."=".$this->id;
        break;
      }
	  // ### 2e cas => en partant de la table mère vers la table fille ###
      elseif($jointure[0]==get_class($this) AND $jointure[2]==$methode){
		//$this->Resultat=FALSE;
		//$obj1=$this->lire();
		$obj=new $jointure[2];
		//eval('$id=$obj1->'.$jointure[1].';');
		//$obj->where.=$jointure[3]."=".$id;
		$obj->where.=$jointure[3]."=".$this->id;
		$obj->lire();
        break;
      }
	  // ### 3e cas => table associative ###
      elseif ($jointure[2]==$methode){
        foreach ($this->tbJointures as $jointure2){
            if ($jointure2[0]==$jointure[0] AND $jointure2[2]==get_class($this)){
			  $obj= new $methode();
			  $obj->join.=$jointure[0]." ON ".$jointure[0].".".$jointure[1]."=".$jointure[2].".".$jointure[3];
			  $obj->where.=$jointure2[0].".".$jointure2[1]."=".$this->id;
              break;
            }
        }
      }
    }
    return $obj;
  }


//##########################################################################################################
//	 ecrire($tbData:tableau associatif)
//   @arg: $tbData : tableau associatif (champ=>valeur) des données à ajouter ou modifier
//   * Ajoute (id=0) ou modifie (id!=0) des données dans une table
//##########################################################################################################

public function ecrire($tbData){
  
  if ($this->id==0) { //Faire un ajout si ID égale à 0
    $sql="INSERT INTO ".get_class($this)." SET ";
  }
  else { //Faire une modification
    $sql="UPDATE ".get_class($this)." SET ";
  }

  foreach ($tbData as $champ => $valeur) {
    $sql.=$champ.'="'.$valeur.'", ';
  }
  $sql=substr($sql,0 , -2);

if($this->where!=" WHERE "){ //Ajoute la condition WHERE si pas vide
        $sql.=$this->where;
  }
  //echo $sql;
  $this->Resultat=$this->Connexion->query($sql);
}
//##########################################################################################################
//	 supprimer()
//   * Supprime un enregistrement ($id!=0) ou tous ($id=0) dans une table
//##########################################################################################################

public function supprimer(){
  $sql="DELETE FROM ".get_class($this);

if($this->where!=" WHERE "){ //Ajoute la condition WHERE si pas vide
        $sql.=$this->where;
  }

  $this->Resultat=$this->Connexion->query($sql);
}

public function returnJson($listCol){
  $sql = "SELECT JSON_OBJECT(";
  for ($i=0; $i < count($listCol); $i++) { 
    $sql.= '"'.$listCol[$i].'",'.$listCol[$i].',';
  }
  $sql= substr($sql, 0, -1);
  $sql.= ") FROM `".get_class($this)."`";
  $Resultat=$this->Connexion->query($sql);
  return $Resultat->fetch();
}

  /*

  public function supprimer($where){
    $sql="DELETE FROM ".get_class($this);

	if($where!=""){ //Ajoute la condition WHERE si pas vide
          $sql.=$where;
    }

    $this->Resultat=$this->Connexion->query($sql);
  }

*/
//===========================================================================================================


}// FIN DE CLASSE

/* 
  

  public function supprimer(){
    $sql="DELETE FROM ".get_class($this);

	if($this->where!=" WHERE "){ //Ajoute la condition WHERE si pas vide
          $sql.=$this->where;
    }

    $this->Resultat=$this->Connexion->query($sql);
  }
  
  
  
  */


?>
