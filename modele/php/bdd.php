<?php
    Class SQL
    {
      public $Connexion;
      public $Resultat = array();
      public $nomCol = array();
      public $jointures = array();
      public $select = "SELECT ";
      public $join= " FROM ";
      public $where = " WHERE ";
      public $data = array();
    
    
    //##########################################################################################################
    //	 __constructeur()
    //   * Se connecte à la base de données
    //   * Valorise l'attibuts $Connexion
    //##########################################################################################################
      public function __construct() {
        $this->Connexion = new PDO ('mysql:host='.$this->Serveur.';dbname='.$this->Bddnom,$this->Identifiant,$this->Mdp);
        $this->Connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->nomCol = $this->getNomColonnes();
        $this->jointures = $this->getJointures();
        $this->join .= get_class($this).$this->initJoin();
        $this->Resultat = $this->executer($this->nomCol);
      }

      public function exeReq($req){
        try{
          $sqlReq = $this->Connexion->prepare($req);
          return $sqlReq->execute();
        }catch(Exception $e){
          return $e;
        }
        
      }

      public function returnTable($osql){
        $tbRes = array();
        $coor = 0;
        $sqlReq = $this->Connexion->prepare($osql);
        $sqlReq->execute();
        while ($row =$sqlReq->fetch()) {
            $tbRes[$coor] = $row;
            $coor +=1;
        }
        return $tbRes;
      }

      public function getNomColonnes(){
        $sql = 'SELECT `COLUMN_NAME` FROM INFORMATION_SCHEMA.COLUMNS WHERE `TABLE_NAME` LIKE "'.get_class($this).'" AND `TABLE_SCHEMA` LIKE "'.$this->Bddnom.'"';
        $tbRes = array();
        $resultat = array();
        $tbRes = $this->returnTable($sql);
        foreach($tbRes as $key => $val){
          $resultat[$key] = $val[0];
        }
        return $resultat;
      }

      public function getJointures(){
        $reqSql = 'SELECT `TABLE_NAME`,`COLUMN_NAME`,`REFERENCED_TABLE_NAME`,`REFERENCED_COLUMN_NAME` FROM information_schema.`KEY_COLUMN_USAGE` WHERE `CONSTRAINT_SCHEMA` LIKE "'.$this->Bddnom.'" AND CONSTRAINT_NAME NOT LIKE "PRIMARY" AND `TABLE_NAME` LIKE "'.get_class($this).'"';
        $tableRes = array();
        $tableRes = $this->returnTable($reqSql);
        return $tableRes;
      }

      public function initJoin(){
        $sqlr = '';
        if($this->jointures){
          for($i=0;$i<=count($this->jointures)-1;$i++){
            $sqlr .= ' JOIN '.$this->jointures[$i][2].' ON '.$this->jointures[$i][0].'.'.$this->jointures[$i][1].'='.$this->jointures[$i][2].'.'.$this->jointures[$i][3];
          }
        }
        return $sqlr;
      }

      public function executer($champs,$conditions=null){
        $dataReq = array();
        $nbData = array();
        $this->select = "SELECT ";
        for($k=0;$k<=count($champs)-1;$k++){
          $this->select .= $champs[$k].",";
        }
        $this->select=substr($this->select,0,-1);
        if($conditions==null){
          $this->where = " ";
        }else{
          $this->where = " WHERE ".$conditions;
        }
        $request = $this->select.$this->join.$this->where;
        $query = $this->Connexion->prepare($request);
      
        $valChamp = array();
        foreach($champs as $keyChamp=>$nomChamp){
          $query->bindColumn(($keyChamp+1), $valChamp[$keyChamp]);
        }
        $query->execute();
        $o = 0;
        while ($query->fetch()) {
          foreach($champs as $keyChamp=>$nomChamp){
            $dataReq[$o][$nomChamp] = $valChamp[$keyChamp];
          }
          $o+=1;
        }
        return $dataReq;
      }

      public function testExecuter($champs=array("*"),$conditions=null){
        $res = array();
        $nbData = array();
        $this->select = "SELECT ";
        for($k=0;$k<=count($champs)-1;$k++){
          $this->select .= $champs[$k].",";
        }
        $this->select=substr($this->select,0,-1);
        if($conditions==null){
          $this->where = " ";
        }else{
          $this->where = " WHERE ".$conditions;
        }
        $request = $this->select.$this->join.$this->where;
        $query = $this->Connexion->prepare($request);
        return $query;
      }

      //dataInsert => array avec meme nombre de données que de colonne dans la table
      //si donnée manquante insertion données null
      //Ex:array("null",'"i_18_6"',18,1,"null")
      public function insert($dataInsert){ 
        $reqInsert = 'INSERT INTO '.get_class($this).' (';
        $reqValues = ' VALUES (';
        for($k=0;$k<=count($dataInsert)-1;$k++){
          $reqInsert .= $this->nomCol[$k].',';
          $reqValues .= $dataInsert[$k].',';
        }
        $reqInsert = substr($reqInsert,0,-1).')';
        $reqValues = substr($reqValues,0,-1).')';
        $reqInsert = $this->Connexion->prepare($reqInsert.$reqValues);
        $reqInsert->execute();
        return $reqInsert->fetchall();
      }

      //dataUpdate => array avec obligatoirement  la clef primaire, nom de la colonne en index, nouvelle donné en valeur
      //Ex:Array([salle_num] => 1[salle_nom] => ni_30_1[salle_places] => 30[salle_informatise] => 0[salle_verr] => )
      public function update($dataUpdate){
        $index = array_keys($dataUpdate);
        $reqUpdate = 'UPDATE '.get_class($this).' SET ';
        for($k=1;$k<count($index);$k++){
          if(is_int($dataUpdate[$index[$k]])){
            $reqUpdate .= $index[$k].'='.$dataUpdate[$index[$k]].',';
          }else if(empty($dataUpdate[$index[$k]])){
            $reqUpdate .= $index[$k].'='.'null'.',';
          }else{
            $reqUpdate .= $index[$k].'="'.$dataUpdate[$index[$k]].'",';
          }
        }
        $reqUpdate = substr($reqUpdate,0,-1);
        $reqUpdate .= ' WHERE '.$index[0].'='.$dataUpdate[$index[0]];
        $reqUpdate = $this->Connexion->prepare($reqUpdate);
        $reqUpdate->execute();
        return $reqUpdate;
      }

      public function add($dataInsert){
        $index = array_keys($dataInsert);
        $reqInsert = 'INSERT INTO '.get_class($this).' (';
        $values = ' VALUES(';
        for($k=0;$k<count($index);$k++){
          $reqInsert .= $index[$k].',';
          if(is_int($dataInsert[$index[$k]])){
            $values .= $dataInsert[$index[$k]].',';
          }else{
            if($dataInsert[$index[$k]] == ""){
              $values .= 'null,';
            }else{
              $values .= '"'.$dataInsert[$index[$k]].'",';
            }
          }
        }
        $reqInsert = substr($reqInsert,0,-1).')';
        $values = substr($values,0,-1).')';
        $reqInsert .= $values;
        $reqInsert = $this->Connexion->prepare($reqInsert);
        $reqInsert->execute();
        return $reqInsert;
      }

      public function suppression($conditions){
        $req = "DELETE FROM ".get_class($this)." WHERE ".$conditions;
        $msg = $this->exeReq($req);
        return $msg;
      }
    }
?>