/** Créé un calendrier avec une vue à la semaine */
class Calendrier{
    
    /**
     * @constructor
     * @param  {string} domTarget ID de l'element HTML dans lequel sera injecté le calendrier
     * @param  {Date} date=newDate() Date par defaut du calendrier, aujourd'hui si null
     */
    constructor(domTarget,date=new Date()){
         
        //récupère l'élément DOM passé en paramètre
        this.domElement = document.querySelector(domTarget);

        //liste jours et mois
        this.monthList = new Array('janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juilvar', 'aôut', 'septembre', 'octobre', 'novembre', 'décembre');
        this.dayList = new Array('lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche');

        //date demandé
        this.today = date;
        this.initCalendrier();
    }
    /**
     * Construit l'ossature du calendrier ainsi que la navigation
     */
    initCalendrier(){

        //Premier jour (Lundi) de la semaine
        this.firstDayOfWeek = new Date(this.today);
        var jSem = this.firstDayOfWeek.getDay();
        if(jSem === 0){
            this.firstDayOfWeek.setDate(this.firstDayOfWeek.getDate()-6);
        }else{
            this.firstDayOfWeek.setDate(this.firstDayOfWeek.getDate()-jSem+1);
        }

        //créé le block qui contiendra la navigation dans les mois
        var navMois = document.createElement('div');
        navMois.classList.add('header');
        navMois.classList.add('navMois');
        this.domElement.appendChild(navMois);

        //créé le block qui contiendra la navigation dans les semaines
        var navSemaine = document.createElement('div');
        navSemaine.classList.add('header');
        navSemaine.classList.add('navSemaine');
        this.domElement.appendChild(navSemaine);

        //créé le block qui contiendra les jours du calendrier
        this.content = document.createElement('div');
        this.content.id = "contCalendrier";
        this.domElement.appendChild(this.content);

        // Navigation Mois
        // Bouton "précédent"
        var preMoisButton = document.createElement('button');
        preMoisButton.setAttribute('data-action', '-1');
        preMoisButton.textContent = '\u003c';
        preMoisButton.classList.add("btnMois");
        preMoisButton.id = "btnMoisPres";
        navMois.appendChild(preMoisButton);

        // Block qui contiendra le mois/année affiché
        this.monthDiv = document.createElement('div');
        this.monthDiv.classList.add('titreCalendrier');
        navMois.appendChild(this.monthDiv);

        // Bouton "suivant"
        var nextMoisButton = document.createElement('button');
        nextMoisButton.setAttribute('data-action', '1');
        nextMoisButton.textContent = '\u003e';
        nextMoisButton.classList.add("btnMois");
        nextMoisButton.id = "btnMoisNext";
        navMois.appendChild(nextMoisButton);

        // Action des boutons "précédent" et "suivant"
        this.domElement.querySelectorAll('.btnMois').forEach(element =>{
            element.addEventListener('click', () =>
            {
                // multiplier par 1 les valeurs pour forcer leur convertion en "int"
                this.firstDayOfWeek.setMonth(this.firstDayOfWeek.getMonth() * 1 + element.getAttribute('data-action') * 1);
                this.loadSemaine(this.firstDayOfWeek);
            });
        });

        // Navigation Semaines
        // Bouton "précédent"
        var preSemButton = document.createElement('button');
        preSemButton.setAttribute('data-action', '-7');
        preSemButton.textContent = '\u003c';
        preSemButton.classList.add("btnSem");
        preSemButton.id = "btnSemPres";
        navSemaine.appendChild(preSemButton);

        // Block qui contiendra le numéro de la semaine affiché
        this.semaineDiv = document.createElement('div');
        this.semaineDiv.classList.add('titreCalendrier');
        navSemaine.appendChild(this.semaineDiv);

        // Bouton "suivant"
        var nextSemButton = document.createElement('button');
        nextSemButton.setAttribute('data-action', '7');
        nextSemButton.textContent = '\u003e';
        nextSemButton.classList.add("btnSem");
        nextSemButton.id = "btnSemNext";
        navSemaine.appendChild(nextSemButton);

        // Action des boutons "précédent" et "suivant"
        this.domElement.querySelectorAll('.btnSem').forEach(element =>{
            element.addEventListener('click', () =>
            {
                // multiplier par 1 les valeurs pour forcer leur convertion en "int"
                this.firstDayOfWeek.setDate(this.firstDayOfWeek.getDate()+ element.getAttribute('data-action') * 1);
                this.loadSemaine(this.firstDayOfWeek);
            });
        });
    
        //charge la semaine
        this.loadSemaine(this.firstDayOfWeek);
    }
    /**
     * Initialise la semaine demandé
     * @param  {Date} date Date du Lundi de la semaine demandé
     */
    loadSemaine(date){ // date: lundi de la semaine demandée

        //vide le calendrier
        this.content.textContent = '';

        //ajoute le numéro de la semaine affiché
        this.semaineDiv.textContent = "Semaine: " + this.getWeekOfYear(date);

        //Création du tableau
        var tbCalendrier = document.createElement("table");
        tbCalendrier.id = "tbContCalendrier";
        this.content.appendChild(tbCalendrier);
        
        // Création des cellules contenant les jours de la semaine affichée
        var headTb = document.createElement("thead");
        tbCalendrier.appendChild(headTb);
        var headTr = document.createElement("tr");
        headTb.appendChild(headTr);
        var colHeure = document.createElement('th'); // colonne suplémentaire pour les heures
        colHeure.classList.add('cell');
        colHeure.classList.add('colHeures');
        headTr.appendChild(colHeure);

        var dateCell = new Date(date);
        for(var i = 0; i <= 6 ; i++)
        {
            var cell = document.createElement('th');
            cell.classList.add('cell');
            cell.classList.add(this.dayList[i]);
            var jourNomClass = dateCell.getDate();
            if(jourNomClass<10){jourNomClass=0 + "" + jourNomClass};
            var moisNomClass = dateCell.getMonth()+1;
            if(moisNomClass<10){moisNomClass=0 + "" + moisNomClass};
            var dateNomClass = dateCell.getFullYear()+"-"+moisNomClass+"-"+jourNomClass;
            cell.classList.add(dateNomClass);
            cell.id = this.dayList[i];
            cell.textContent = this.dayList[i].substring(0, 3).toUpperCase() + " " + dateCell.getDate();
            headTr.appendChild(cell);

            // Timestamp de la cellule
            var timestamp = this.formatageDate(dateCell);
            var aujourdhui = new Date();
            aujourdhui = this.formatageDate(aujourdhui);
            // Ajoute la classe today si date = aujourd'hui
            if(timestamp === aujourdhui)
            {
                cell.classList.add('today');
            }
            // Ajoute la classe .past si date < aujourd'hui
            if(timestamp < aujourdhui){
                cell.classList.add('past')
            }
            dateCell.setDate(dateCell.getDate()+1);
        }
        dateCell.setDate(dateCell.getDate()-1);
        this.lastDayOfWeek = new Date(dateCell);
        //ajoute le/les mois/année  à afficher
        if(document.getElementById("lundi").textContent.substring(4, 6)*1 < document.getElementById("dimanche").textContent.substring(4, 6)*1){
            this.monthDiv.textContent = this.monthList[date.getMonth()].toUpperCase() + ' ' + date.getFullYear();
        }else{
            this.monthDiv.textContent = this.monthList[date.getMonth()].toUpperCase() + " / " + this.monthList[dateCell.getMonth()].toUpperCase() + ' ' + date.getFullYear();
        }

        this.initCorps();
    }

    /**
     * Construit le corps du calendrier 
     * par défaut: journée de 8h à 22h avec 1 cellule par 1/2h
     */
    initCorps(){
        var tbCalendrier = document.querySelector("#tbContCalendrier");
        //création du corps du tableau
        var corpsCalendrier = document.createElement('tbody');
        tbCalendrier.appendChild(corpsCalendrier);
        var nowMoment = this.firstDayOfWeek;
        var timer = new Date() // initialisation du timer
        timer.setHours(8); // début de la journée à 8:00:00 heure
        timer.setMinutes(0);
        timer.setSeconds(0);
        for(var j = 0; j<=28;j++ ){ //28 -> 28 cellules d'1/2H pour aller de 8H à 22H
            var ligneCal = document.createElement("tr");
            var H = timer.getHours();
            var M = timer.getMinutes();
            if(H<10){H = 0 + "" + H};
            if(M===0){M = M + "" + M};
            ligneCal.classList.add( H + ":" + M);
            timer = this.addMinutes(timer,30); // on ajoute 30 minute pour la prochaine cellule
            //création des cellules
            var celHeure = document.createElement('td'); // première cellule qui affiche l'heure
            celHeure.textContent = H + ":" + M;
            celHeure.classList.add("cell");
            celHeure.classList.add('colHeures');
            ligneCal.appendChild(celHeure);
            
            for(var k=0; k<=6;k++){ // 7 jours
                var celCalendrier = document.createElement('td'); // cellule du tableau
                celCalendrier.classList.add("cell");
                celCalendrier.classList.add(H + ":" + M);
                celCalendrier.classList.add(document.querySelectorAll("th")[k+1].classList[2]);
                //celCalendrier.classList.add(this.dayList[k]);
                var numJour = nowMoment.getDate();
                if(numJour<10){numJour = "0"+numJour}
                ligneCal.appendChild(celCalendrier);
                nowMoment.setDate(nowMoment.getDate()+1);
            }
            nowMoment.setDate(nowMoment.getDate()-7);
            corpsCalendrier.appendChild(ligneCal);
        }
    }

    
    /**
     * Retourne le numéro de la semaine de la date passé en paramètre
     * @param  {Date} date date de la semaine souhaité
     */
    getWeekOfYear(date) {
        var target = new Date(date.valueOf()),
            dayNumber = (date.getUTCDay() + 6) % 7,
            firstThursday;

        target.setUTCDate(target.getUTCDate() - dayNumber + 3);
        firstThursday = target.valueOf();
        target.setUTCMonth(0, 1);

        if (target.getUTCDay() !== 4) {
            target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7);
        }

        return Math.ceil((firstThursday - target) /  (7 * 24 * 3600 * 1000)) + 1;
    }

    /**
     * Ajoute X minutes à un objet Date
     * @param  {Date} date Date à incrémenter
     * @param  {int} minutes Nombre de minute à incrémenter
     */
    addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes*60000);
    }

    /**
     * Donne le premier jour de la semaine chargé actuellement
     * @returns aaaa-mm-jj
     */
    getFirstDayOfWeek(){
        return this.formatageDate(this.firstDayOfWeek);
    }

    /**
     * Donne le dernier jour de la semaine chargé actuellement
     * @returns aaaa-mm-jj
     */
    getLastDayOfWeek(){
        return this.formatageDate(this.lastDayOfWeek);
    }

    /**
     * Convertie un objet Date en chaine
     * @param  {Date} uneDate Date à formater
     * @returns aaaa-mm-jj
     */
    formatageDate(uneDate){ //de type Date()
        var leJour = uneDate.getDate();
        if(leJour<10){leJour=0 + "" + leJour};
        var leMois = uneDate.getMonth()+1;
        if(leMois<10){leMois=0 + "" + leMois};
        var laDate = uneDate.getFullYear()+"-"+leMois+"-"+leJour;
        return laDate;
    } 
    
    /**
    * Ajoute une durée à une date.
    * Exemple: dateAdd(new Date(), 'minute', 30)  //returns now + 30 min.
    * @param date  Date to start
    * @param interval  Au choix: year, quarter, month, week, day, hour, minute, second
    * @param units  Valeur à ajouter.
    * @returns objet Date
    */
    dateAdd(date, interval, units) {
        var ret = new Date(date); 
        var checkRollover = function() { if(ret.getDate() != date.getDate()) ret.setDate(0);};
        switch(interval.toLowerCase()) {
          case 'year'   :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;
          case 'quarter':  ret.setMonth(ret.getMonth() + 3*units); checkRollover();  break;
          case 'month'  :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;
          case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
          case 'day'    :  ret.setDate(ret.getDate() + units);  break;
          case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
          case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
          case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
          default       :  ret = undefined;  break;
        }
        return ret;
    }
}

/** Adapte la classe Calendrier afin de pouvoir y reserver des salles */
class InterfaceReservationSalle extends Calendrier{
    
    /**
     * @constructor
     * @param  {string} domTarget
     * @param  {Date} date=null
     */
    constructor(domTarget,date=null){
        if(date){
            super(domTarget,date);
        }else{
            super(domTarget);
        }
        this.urli = "./index.php?action=getReservations&dateDebut=" + this.getFirstDayOfWeek() + "&dateFin=" + this.getLastDayOfWeek();
    }
    
    /**
     * Modifie la navigation
     */
    initBtnNav(){
        
        var dateLundi = new Date(this.getFirstDayOfWeek());
        var dateDimanche = new Date(this.getLastDayOfWeek());

        this.domElement.querySelectorAll('.btnSem').forEach(element =>{
            element.addEventListener('click', () =>
            {
                dateLundi.setDate(dateLundi.getDate()+ element.getAttribute('data-action') * 1);
                dateDimanche.setDate(dateDimanche.getDate()+ element.getAttribute('data-action') * 1); 
                var lundi = this.formatageDate(dateLundi);
                var dimanche = this.formatageDate(dateDimanche);
                this.urli = "./index.php?action=getReservations&dateDebut=" + lundi + "&dateFin=" + dimanche;
                this.affichageReservations(this.urli);
                popUpHidden();
            });
        });

        this.domElement.querySelectorAll('.btnMois').forEach(element =>{
            element.addEventListener('click', () =>
            {
                dateLundi.setMonth(dateLundi.getMonth()+ element.getAttribute('data-action') * 1);
                dateDimanche.setMonth(dateDimanche.getMonth()+ element.getAttribute('data-action') * 1); 
                var lundi = this.formatageDate(dateLundi);
                var dimanche = this.formatageDate(dateDimanche);
                this.urli = "./index.php?action=getReservations&dateDebut=" + lundi + "&dateFin=" + dimanche;
                this.affichageReservations(this.urli);
                popUpHidden();
                console.log(this.urli);
            });
        }); 
    } 

    /**
     * Affiche les reservations 
     * @param  {string} urlData=this.urli url de récuperation des données de reservation
     */
    affichageReservations(urlData=this.urli){
        jQuery.ajax({ url: urlData, async: true }).done(function (reponse) {
            if (reponse) {
                console.log(reponse);
                var dataRes = JSON.parse(reponse);
                dataRes.forEach(function (e) {
                    var ligue = JSON.parse(getLigue());
                    if (ligue["ligue_nom"] === e["ligue_nom"] || ligue["ligue_nom"] === "ad") {
                        var debutRes = new Date(e["reservation_debut"]);
                        var finRes = new Date(e["reservation_fin"]);
                        var dureeRes = (finRes.getTime() - debutRes.getTime()) / (1000 * 60 * 30);
                        var hRes = new Date(debutRes.getTime());
                        var heureJou = formatageHeure(hRes);
                        var dateDeRes = e["reservation_debut"].split(' ');
                        var classe = heureJou + " " + dateDeRes[0];
                        var cellRes = document.getElementsByClassName(classe);
                        var cellCal = document.getElementsByClassName("08:00" + " " + dateDeRes[0]);
                        var posRes = cellRes[0].getBoundingClientRect().top - cellCal[0].getBoundingClientRect().top;
                        var divCell = document.createElement("div");
                        divCell.innerHTML = e["salle_nom"];
                        if (ligue["ligue_nom"] === "ad") {
                            divCell.innerHTML += "<br/>" + e["ligue_nom"];
                        }
                        divCell.classList.add(e["reservation_num"]);
                        divCell.classList.add("reservation");
                        divCell.style.top = posRes + "px";
                        divCell.style.backgroundColor = "rgb(81, 112, 255)";
                        divCell.style.height = ((dureeRes * 40) - 10) + "px"; //-6 du au padding
                        divCell.style.width = "80%";
                        cellCal[0].appendChild(divCell);
                        console.log(divCell);
                    }
                })
            } else {
                console.log("Aucune données chargées");
            }
            placeReservation();
        });
        var calendrier = this;
        this.domElement.querySelectorAll('.cell').forEach(element =>{
            if(!element.classList.value.includes("colHeures")){
                if(element.nodeName!="TH"){
                    element.addEventListener("click",function(e){
                        calendrier.actionOnClick(e);
                    });
                }    
            }
        });
    }

    /**
     * retourne url actuellement utilisé pour récupérer les réservations
     * @returns string
     */
    getUrli(){
        return this.urli;
    }
    /**
     * définit si l'on doit créer un popup de nouvelle reservation, un popup d'edition, ou faire disparaitre un popup existant
     * @param  {HTMLElement} element element cliqué
     */
    actionOnClick(element){
        var formRes = document.getElementById("popUpReservation");
        if(formRes.style.display === "none"){
            var dataRes = element.target.className.split(' ');
            var popUp = initPopUp(element);
            if(dataRes.indexOf("cell")>=0){
                popUpNewRes(popUp);
            }else{
                popUpEditRes(popUp);
            }
        }else{ 
            formRes.style.display = "none";
            viderNode(formRes.children[0]);
        }
        
    }
}
/**
 * @param  {Date} uneHeure // Heure à formater
 */
function formatageHeure(uneHeure){
    var h = uneHeure.getHours();
    if(h<10){h=0 + "" + h};
    var m = uneHeure.getMinutes();
    if(m<10){m=0 + "" + m};
    return h + ":" + m;
}

function initPopUp(element){
    // if(document.querySelector('#popUpReservation')){
    //     var popUp = document.querySelector('#popUpReservation');
    //     destroyNode(popUp);
    // }
    var popUp = document.getElementById('popUpReservation');
    //document.querySelector("body").insertBefore(popUp,document.querySelector("#menu"));
    //popUp.id = "popUpReservation";
    popUp.className = element.target.className;
    popUp.style.position = "absolute";
    popUp.style.backgroundColor = "rgba(85, 128, 185, 0.712)";
    popUp.style.borderRadius = "3px";
    popUp.style.padding = "3px";
    popUp.style.width = "145px";
    //popUp.style.height = "195px";
    popUp.style.zIndex = "1";
    popUp.style.display = "block";
    //console.log(element);
    popUp.style.top = (element.target.getBoundingClientRect().top + window.scrollY) + "px";
    popUp.style.left = (element.target.getBoundingClientRect().left + window.scrollX) + "px";
    return popUp;
}

function popUpNewRes(popUp){
    var domForm = popUp.children[0];
    viderNode(domForm);
    var hRes = popUp.classList[1].split(":");
    var hResMin = [];
    if(hRes[1]==="00"){
        hResMin[0] = parseInt(hRes[0]);
        hResMin[1] = 30;
    }else{
        hResMin[0] = parseInt(hRes[0])+1;
        hResMin[1] = 0;
    }
    
    var form = [
        {label:" ", input:initInput("hidden","type",[{name:"value", value:"add"}])},
        {label:" ", input:initInput("hidden","date",[{name:"value", value:popUp.classList[2]}])},
        {label:" ", input:initInput("hidden","reservation_debutH",[{name:"value", value:popUp.classList[1]}])},
        {label:"Fin", input:[initInput("number","reservation_finH",[{name:"min", value:hResMin[0]},{name:"max", value:22},{name:"value", value:hResMin[0]}]),initInput("number","reservation_finM",[{name:"step", value:30},{name:"value", value:hResMin[1]},{name:"max", value:59},{name:"min", value:0}])]},
        {label:"Places", input:initInput("number","salle_places",[{name:"value", value:1},{name:"min", value:1}])},
        {label:"Informatisée", input:initInput("select","salle_informatise",["OUI","NON"])},
        {label:" ", input:initInput("submit","btnOk",[{name:"value", value:"OK"}])}
    ]
    var formRes = initForm("formReservation",1,form);
    domForm.appendChild(formRes);
}

function popUpHidden(){
    var formRes = document.getElementById("popUpReservation");
    formRes.style.display = "none";
}

/**
 * Initialise un popUp de reservation de salle
 * @param  {HTMLElement} popUp un popUp
 */
function popUpEditRes(popUp){
    var domForm = popUp.children[0];
    viderNode(domForm);
    var numRes = popUp.classList[0];
    var btnEdit = initInput("div","btnEdit",[{name:"innerHTML", value:"EDITER"},{name:"onclick", value:"editRes("+numRes+")"}]);
    domForm.appendChild(btnEdit);
    var btnSupr = initInput("div","btnSupr",[{name:"innerHTML", value:"SUPPRIMER"},{name:"onclick", value:"suprRes("+numRes+")"}]);
    domForm.appendChild(btnSupr);
}

function editRes(numRes){
    jQuery.ajax({ url : "./index.php?action=getResByNum&reservation_num="+numRes, async: true}).done(function(reponse){
        reponse = JSON.parse(reponse)[0];
        //console.log(reponse);
        var debut = reponse["reservation_debut"].split(" ");
        var hDebut = debut[1].split(":");
        var fin = reponse["reservation_fin"].split(" ");
        var hFin = fin[1].split(":");
        if(reponse["salle_informatise"]==="1"){
            var info = [["OUI","selected"],"NON"];
        }else{
            var info = ["OUI",["NON","selected"]];
        }
        var form = [
            {label:" ", input:initInput("hidden","type",[{name:"value", value:"update"}])},
            {label:" ", input:initInput("hidden","date",[{name:"value", value:debut[0]}])},
            {label:" ", input:initInput("hidden","numRes",[{name:"value", value:numRes}])},
            {label:"Debut", input:[initInput("number","reservation_debutH",[{name:"min", value:8},{name:"max", value:22},{name:"value", value:parseInt(hDebut[0])}]),initInput("number","reservation_debutM",[{name:"step", value:30},{name:"value", value:parseInt(hDebut[1])},{name:"max", value:59},{name:"min", value:0}])]},
            {label:"Fin", input:[initInput("number","reservation_finH",[{name:"min", value:8},{name:"max", value:22},{name:"value", value:parseInt(hFin[0])}]),initInput("number","reservation_finM",[{name:"step", value:30},{name:"value", value:parseInt(hFin[1])},{name:"max", value:59},{name:"min", value:0}])]},
            {label:"Places", input:initInput("number","salle_places",[{name:"value", value:reponse["salle_places"]},{name:"min", value:1}])},
            {label:"Informatisée", input:initInput("select","salle_informatise",info)},
            {label:" ", input:initInput("submit","btnOk",[{name:"value", value:"OK"}])}
        ]
        var formRes = initForm("formReservation",1,form);
        var form = document.getElementById('formReservation');
        form.appendChild(formRes);
    });
}

function suprRes(numRes){
    console.log("supr");
    jQuery.ajax({ url : "./index.php?action=suprRes&reservation_num="+numRes, async: true}).done(function(reponse){
        //console.log(reponse);
        window.location.href = "./index.php?action=reservation";
    });
}

function destroyPopUp(){
    var popUp = document.getElementById("popUpReservation");
    if(popUp){
        destroyNode(popUp);
    }
}

function destroyNode(node){
    node.remove();
}


/**
 * retourne true si l'elementI est "à coté" de l'elementII
 * @param  {HTMLObjectElement} elementI // premier objet à tester
 * @param  {HTMLObjectElement} elementII // second objet à tester
 */
function isNextTo(elementI,elementII){
    var posEleI = elementI.getBoundingClientRect();
    var posEleII = elementII.getBoundingClientRect();
    var res = false;
    if(!((posEleII.top>=posEleI.bottom) || (posEleII.bottom<=posEleI.top))){
        res = true;
    }
    return res;
}

/**
 * Permet de placer les réservations sur le calendrier
 */
function placeReservation(){
    // trie des elements
    //------------------------------
    var premLigne = document.querySelectorAll('[class="08:00"]')[0]; // Récupération de la première plage horaire de chaque jour
    premLigne.childNodes.forEach(element =>{ // Pour chaque jour de la semaine
        if(element.childNodes.length>1){ // Si il y a plus d'une réservation pour la journée
            var grille = []; // La grille de placement
            grille[0] = [element.childNodes[0]]; // On ajoute directement la première réservation à la grille
            for(var i=1; i < element.childNodes.length; i++){ // pour chaque réservation sauf la première
                var numCol = 0;
                // Tant que l'on est pas à la fin du tableau et que l'element à placer est à coté du dernier de celui dans la colonne "numCol" on change de colonne
                while(numCol < grille.length && isNextTo(element.childNodes[i],grille[numCol][grille[numCol].length-1])){
                    numCol++;
                }
                if(!grille[numCol]){grille[numCol] = []}; // si la colonne n'existe pas on l'a crée
                grille[numCol].push(element.childNodes[i]);// On ajoute l'element à la fin de la colonne
            }
            // Mise en place des elements
            //----------------------------------------
            var larParent = element.offsetWidth; // Récupération de la largeur de la plage horaire
            for(var j=0; j < grille.length; j++){ // Pour chaque colonne
                grille[j].forEach(function(e){  // Pour chaque element de la colonne
                    e.style.left = (larParent/grille.length)*j; // On place l'element
                    e.style.width = ((100/grille.length)*0.8) +"%"; // On reduit la taille de l'element en fonction du nombre de colonne
                    e.style.backgroundColor = "rgb("+(81+40*j%255)+", "+(112+40*j%255)+", 255)"; // Changement de la couleur de l'element en fonction de la colonne
                    if(grille.length>2){ // Si il y a 3 colonnes ou plus, on change le sens d'écriture
                        e.style.writingMode = "vertical-lr";
                    }
                });
            }
        }
    });
    
}

function initForm(name,nbCol,elements){
    //var form = document.getElementById(name);
    //form.id = name;
    var formContent = document.createElement("div");
    formContent.id = name;
    var tb = document.createElement("table");
    formContent.appendChild(tb);
    elements.forEach(function(e){
        if(nbCol===1){
            var ligI = document.createElement("tr");
            tb.appendChild(ligI);
            ligI.innerHTML = e["label"];

            var lig = document.createElement("tr");
            tb.appendChild(lig);
        
            if(Array.isArray(e["input"])){
                e["input"].forEach(function(e){
                    lig.appendChild(e);
                });
            }else{
                lig.appendChild(e["input"]);
            }
        }else{
            var lig = document.createElement("tr");
            tb.appendChild(lig);
        
            var cellLabel = document.createElement("td");
            lig.appendChild(cellLabel);
            cellLabel.innerHTML = e["label"];
        
            var cellInput = document.createElement("td");
            lig.appendChild(cellInput);
            if(Array.isArray(e["input"])){
                e["input"].forEach(function(e){
                    cellInput.appendChild(e);
                });
            }else{
                cellInput.appendChild(e["input"]);
            }
        }
    })
    
    return formContent;
}

function initInput(type,name,option=null){
    switch(type){
        case "select":
            var input = document.createElement(type);
            input.name = name;
            input.id = name;
            option.forEach(function(e){
                if(Array.isArray(e)){
                    var opt = document.createElement("option");
                    opt.value = e[0];
                    opt.innerHTML = e[0];
                    opt.selected = true;
                    input.appendChild(opt);
                }else{
                    var opt = document.createElement("option");
                    opt.value = e;
                    opt.innerHTML = e;
                    input.appendChild(opt);
                }
                
            });
        break;
        case "button":
            var input = document.createElement(type);
            input.name = name;
            input.id = name;
            if(option){
                option.forEach(function(e){
                    if(e["name"]==="innerHTML"){
                        input.innerHTML = e["value"];
                    }else{
                        input.setAttribute(e["name"], e["value"]);
                    }
                });
            }
        break;
        case "div":
            var input = document.createElement(type);
            input.name = name;
            input.id = name;
            if(option){
                option.forEach(function(e){
                    if(e["name"]==="innerHTML"){
                        input.innerHTML = e["value"];
                    }else{
                        input.setAttribute(e["name"], e["value"]);
                    }
                });
            }
        break;
        default:
            var input = document.createElement("input");
            input.type = type;
            input.name = name;
            input.id = name;
            if(option){
                option.forEach(function(e){
                    input.setAttribute(e["name"], e["value"]);
                });
            }
        break;
    }
    return input;
}

function sendData(form,url) {
    var XHR = new XMLHttpRequest();

    // Liez l'objet FormData et l'élément form
    var FD = new FormData(form);

    // Définissez ce qui se passe si la soumission s'est opérée avec succès
    XHR.addEventListener("load", function(event) {
      //alert(event.target.responseText);
    });

    // Definissez ce qui se passe en cas d'erreur
    XHR.addEventListener("error", function(event) {
      //alert('Oups! Quelque chose s\'est mal passé.');
    });

    // Configurez la requête
    XHR.open("POST", url);

    // Les données envoyées sont ce que l'utilisateur a mis dans le formulaire
    XHR.send(FD);
}

function viderNode(node){
    node.childNodes.forEach(function(e){
        destroyNode(e);
    });
}

function getLigue(){
    var ligue;
    jQuery.ajax({method : "POST", url : "http://localhost/PPE1.3/index.php?action=getSession", async: false}).done(function(reponse){
        ligue = reponse;
    });
    return ligue;
}

