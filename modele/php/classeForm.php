<?php
class form{
    private $html="";
    private $submit="";
    function __construct($action, $submit="Envoyer", $method="POST"){
        $this->html.='<form action="'.$action.'" method="'.$method.'"><table>';
        $this->submit=$submit;
    }

    function __call($methode, $args){
        if(!isset($args[2])){
            $args[2]="";
        }
        $tbInput=array("texte"=>"text", "mdp"=>"password", "heure"=>"time", "mail"=>"email", "url"=>"url", "date"=>"date", "dateHeure"=>"datetime-local");
        $this->input($tbInput[$methode], $args[0], $args[1], $args[2]);
    }

    private function label($nom, $label){
        $this->html.='<tr><td><label for="'.$nom.'">'.$label.'</label></td>';
    }

    private function input($type, $label, $nom, $valeur=""){
        $this->label($nom, $label);
        $this->html.='<td><input id="'.$nom.'"';
        $this->html.='type="'.$type.'"';
        $this->html.='name="'.$nom.'"';
        if(!empty($valeur)) {
            $this->html.='value="'.$valeur.'"';
        }
        $this->html.='/></td></tr>';
    }

    public function range($label, $nom, $min, $max, $valeur="") {
        
        $this->label($nom, $label.': <span id="val"></span>');
        $this->html.='<td><input id="'.$nom.'"';
        $this->html.='type="range"';
        $this->html.='name="'.$nom.'"';
        if(!empty($valeur)) {
            $this->html.='value="'.$valeur.'"';
        }
        $this->html.='min="'.$min.'"';
        $this->html.='max="'.$max.'"';
        $this->html.='/>';
        $this->html.='<script>
                        var slider = document.getElementById("'.$nom.'");
                        var output = document.getElementById("val");
                        output.innerHTML = slider.value;
                        slider.oninput = function() {
                            output.innerHTML = this.value;
                        }
                    </script>';
        $this->html.='</td></tr>';
    }

    public function zoneTexte($label, $nom, $valeur="") {
        $this->label($nom, $label);
        $this->html.='<td><textarea name="'.$nom.'">';
        if(!empty($valeur)){
            $this->html.=$valeur;
        }
        $this->html.='</textarea></td></tr>';
    }

    public function select($label, $nom, $tbdata, $valeur="") {
        $this->label($nom, $label);
        $this->html.='<td><select name="'.$nom.'">';
        foreach($tbdata As $val=>$intitule){
            $this->html.='<option value="'.$val.'"';
            if($valeur==$val){
                $this->html.=' selected="selected" ';
            }
            $this->html.='>'.$intitule.'</option>';
        }
        if(!empty($valeur)){
            $this->html.=$valeur;
        }
        $this->html.='</select></td></tr>';
    }

    public function radio($label, $nom, $tbdata, $valeur="") {
        $this->label($nom, $label);
        $this->html.='<td>';
        foreach($tbdata As $val=>$intitule){
            $this->html.='<input type="radio" name="'.$nom.'" ';
            $this->html.='value="'.$val.'"';
            if($valeur==$val){
                $this->html.=' checked="checked" ';
            }
            $this->html.='/> '.$intitule.' ';
        }
        $this->html.='</td></tr>';
        
    }

    public function check($label, $nom, $tbdata, $tbValeurs=array()) {
        $this->label($nom, $label);
        $this->html.='<td>';
        $num=0;
        foreach($tbdata As $val=>$intitule){
            $this->html.='<input type="checkbox" name="'.$nom.'['.$num.']" ';
            $this->html.='value="'.$val.'"';
            if(in_array($val, $tbValeurs)){
                $this->html.=' checked="checked" ';
            }
            $this->html.='/> '.$intitule.' ';
            $num++;
        }
        $this->html.='</td></tr>';
        
        
    }

    public function fichier($label, $nom, $url){
        $this->input("file", $label, $nom);
        $this->html.='<td><a href="'.$url.'">';
        if(isImage($url)){
            $this->html.='<img class="icn" src="'.$url.'" /></td><td>';
        }
        $this->html.=$url.'</a></td></tr>';
    }

    public function afficher(){
        $this->html.='<tr><td><input type="submit" value="'.$this->submit.'"/>';
        $this->html.='</tr></td></table></form>';
        echo $this->html;
    }
} //FIN CLASSE
?>