<div id="ligueManager"></div>
<form  id="formEdit" style="display: none;">
    <table id="dynContentForm"></table> 
    <input type="submit" value="Ok" id="submit">
</form>
<link rel="stylesheet" type="text/css" href="css/tablejs.css"/>
<link rel="stylesheet" type="text/css" href="modele/js/dataTable/datatables.min.css"/>
<script src="modele/js/jquery-3.3.1.js" type="text/javascript"></script>
<script src="modele/js/table.js" type="text/javascript"></script>
<script type="text/javascript" src="modele/js/dataTable/datatables.min.js"></script>
<script type="text/javascript" >
    jQuery(document).ready(function () {
        jQuery.ajax({
            method : "POST",
            url: "./index.php?action=getLigue",
            async: true,
        }).done(function(reponse){
            if(reponse){
                var reponseLig = JSON.parse(reponse);
                jQuery.ajax({ method: "POST", url: "./index.php?action=getSession", async: true }).done(function (rep) {
                    var tableLigues= new tablePPE1("#ligueManager",reponseLig,"tableLigues","LIGUES",["num","Nom","Sport","Tél","verr"],rep);
                });
            }else{
                $("#ligueManager").html("Erreur");
            }
        });
        
        jQuery( "form" ).submit(function (e) {
            e.preventDefault();
            jQuery.ajax({
                method : "POST",
                url: "./index.php?action=editer",
                async: true,
                data: $( "form" ).serialize()
            }).done(function(reponse){
                console.log(reponse);
                if(!reponse){
                    $("#ligueManager").html("");
                    $("#dynContentForm").html("");
                    jQuery.ajax({
                        method : "POST",
                        url: "./index.php?action=getLigue",
                        async: true,
                    }).done(function(reponse){
                        if(reponse){
                            reponseLig = JSON.parse(reponse);
                            jQuery.ajax({ method: "POST", url: "./index.php?action=getSession", async: true }).done(function (rep) {
                                var tableLigues= new tablePPE1("#ligueManager",reponseLig,"tableLigues","LIGUES",["num","Nom","Sport","Tél","verr"],rep);
                            });
                            $("#dynContentForm").html("<h2 style='color:green'>Edition réussie</h2>");
                        }else{
                            $("#ligueManager").html("Erreur");
                        }
                    });
                }
            });
        });
        
        
    })
</script>