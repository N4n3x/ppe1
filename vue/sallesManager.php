<div id="salleManager"></div>
<form  id="formEdit" style="display: none;">
    <table id="dynContentForm"></table> 
    <input type="submit" value="Ok" id="submit">
</form>
<link rel="stylesheet" type="text/css" href="css/tablejs.css"/>
<link rel="stylesheet" type="text/css" href="modele/js/dataTable/datatables.min.css"/>
<script type="text/javascript" src="modele/js/jquery-3.3.1.js"></script>
<script type="text/javascript" src="modele/js/dataTable/datatables.min.js"></script>
<script type="text/javascript" src="modele/js/table.js"></script>
<script type="text/javascript" >
    jQuery(document).ready(function () {
        jQuery.ajax({
            method : "POST",
            url: "./index.php?action=getSalle",
            async: true,
        }).done(function(reponse){
            if(reponse){
                var reponseSal = JSON.parse(reponse);
                jQuery.ajax({ method: "POST", url: "./index.php?action=getSession", async: true }).done(function (rep) {
                    var tableSalles= new tablePPE1("#salleManager",reponseSal,"tableSalles","SALLES",["num","Nom","Places","Informatisé","verr"],rep);                
                });
            }else{
                $("#salleManager").html("Erreur");
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
                    $("#salleManager").html("");
                    $("#dynContentForm").html("");
                    jQuery.ajax({
                        method : "POST",
                        url: "./index.php?action=getSalle",
                        async: true,
                    }).done(function(reponse){
                        if(reponse){
                            var reponseSal = JSON.parse(reponse);
                            jQuery.ajax({ method: "POST", url: "./index.php?action=getSession", async: true }).done(function (rep) {
                                var tableSalles= new tablePPE1("#salleManager",reponseSal,"tableSalles","SALLES",["num","Nom","Places","Informatisé","verr"],rep);                
                            });
                            $("#dynContentForm").html("<h2 style='color:green'>Edition réussie</h2>");
                        }else{
                            $("#salleManager").html("Erreur");
                        }
                    });
                }
            });
        });
    })
</script>