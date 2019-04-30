<div id="popUpReservation" style="display: none;">
    <form id="formReservation"></form>
</div>
<div id="calendrier" class="calendrier">     </div>
<link rel="stylesheet" type="text/css" href="css/calendrierTrySup.css"/>
<script type="text/javascript" src="modele/js/jquery-3.3.1.js"></script>
<script type="text/javascript" src="modele/js/calendrierTrySup.js"></script>
<script type="text/javascript">
    jQuery(document).ready(function () {
        if(typeof dateRef != "undefined"){
            console.log(dateRef);
            var calendrier = new InterfaceReservationSalle('#calendrier',dateRef);
        }else{
            var calendrier = new InterfaceReservationSalle('#calendrier');
        }
        var url = "./index.php?action=getReservations&dateDebut=" + calendrier.getFirstDayOfWeek() + "&dateFin=" + calendrier.getLastDayOfWeek();
        calendrier.affichageReservations(url);
        calendrier.initBtnNav();
        jQuery( "form" ).submit(function (e) {
            e.preventDefault($( "form" ).serialize());
            jQuery.ajax({
                method : "POST",
                url: "./index.php?action=editerReservation",
                async: true,
                data: $( "form" ).serialize()
            }).done(function(reponse){
                console.log(reponse);
                if(reponse != 1){
                    var popup = document.getElementById("popUpReservation");
                    popup.childNodes[1].innerHTML = reponse;
                }else{
                    window.location.href = "./index.php?action=reservation&dateRef=" + calendrier.getFirstDayOfWeek();
                }
            });
        });
    });            
</script>