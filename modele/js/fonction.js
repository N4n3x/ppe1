/**
 * Extrait l'heure d'un objet Date
 * @param  {Date} uneHeure Objet Date
 * @returns "hh:mm"
 */
function formatageHeure(uneHeure){ //de type Date()
    var h = uneHeure.getHours();
    if(h<10){h=0 + "" + h};
    var m = uneHeure.getMinutes();
    if(m<10){m=0 + "" + m};
    return h + ":" + m;
}
/**
 * Effectue une action en fonction de l'element cliqué par l'utilisateur
 * @param  {HTMLElement} element Element cliqué
 */
function actionOnClick(element){
    if(!document.querySelector('#popUpReservation')){
        var dataRes = element.target.className.split(' ');
        var popUp = initPopUp(element);
        if(dataRes.indexOf("cell")>=0){
            popUpNewRes(popUp);
        }else{
            popUpEditRes(popUp);
        }
    }else{
        destroyNode(document.querySelector('#popUpReservation'));
    }
    
}
/**
 * Construit un popUp à la position de l'element cliqué. Il hérite de son ID.
 * @param  {HTMLElement} element element cliqué
 * @returns un popUp pret à l'emploi (HTMLElement DIV)
 */
function initPopUp(element){
    if(document.querySelector('#popUpReservation')){
        var popUp = document.querySelector('#popUpReservation');
        destroyNode(popUp);
    }
    var popUp = document.createElement("div");
    document.querySelector("body").insertBefore(popUp,document.querySelector("#menu"));
    popUp.id = "popUpReservation";
    popUp.className = element.target.className;
    popUp.style.position = "absolute";
    popUp.style.backgroundColor = "rgba(85, 128, 185, 0.712)";
    popUp.style.borderRadius = "3px";
    popUp.style.padding = "3px";
    popUp.style.width = "145px";
    popUp.style.height = "195px";
    popUp.style.zIndex = "1";
    //console.log(element);
    popUp.style.top = (element.target.getBoundingClientRect().top + window.scrollY) + "px";
    popUp.style.left = (element.target.getBoundingClientRect().left + window.scrollX) + "px";
    return popUp;
}
/**
 * Initialise un popUp de reservation de salle
 * @param  {HTMLElement} popUp un popUp
 */
function popUpNewRes(popUp){
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
    popUp.appendChild(formRes);
    formRes.addEventListener("submit", function (event) {
        event.preventDefault();
        sendData(formRes,"./index.php?action=editerReservation");
    });
}
/**
 * Détruit un element HTML et ses enfants
 * @param  {HTMLElement} node element à détruire
 */
function destroyNode(node){
    node.remove();
}

/**
 * retourne true si l'elementI est "à coté" de l'elementII
 * @param  {HTMLElement} elementI 
 * @param  {HTMLElement} elementII
 * @returns bool
 */
function isNextTo(elementI,elementII){
    var posEleI = elementI.getBoundingClientRect();
    var posEleII = elementII.getBoundingClientRect();
    var res = false;
    if(!((posEleII.top>=posEleI.bottom) || (posEleII.bottom<=posEleI.top))){
        res = true;
        //console.log(elementI,elementII);
    }
    return res;
}
/**
 * Mise en place des reservations
 */
function formatMultiRes(){
    var firstLine = document.querySelectorAll('[class="08:00"]')[0];
    firstLine.childNodes.forEach(element =>{
        if(element.childNodes.length>1){
            var sizeParent = element.offsetWidth;
            for(var i=0;i<=element.childNodes.length-1;i++){
                var tb = [element.childNodes[i]];
                for(var j=0;j<=element.childNodes.length-1;j++){
                    //console.log(element.childNodes[i],element.childNodes[j]);
                    if(i!=j){
                        if(isNextTo(element.childNodes[i],element.childNodes[j])){
                            if(tb.indexOf(element.childNodes[j])==-1){
                                tb.push(element.childNodes[j]);
                            }
                       }
                    }

                }
                element.childNodes[i].style.width = (100/tb.length)+"%";
                for(k=0;k<tb.length;k++){
                    element.childNodes[k].style.left = ((sizeParent/tb.length)*k)+"px";
                    element.childNodes[k].style.backgroundColor = "rgb(207, "+(40+40*k%255)+", 77)";
                    if(tb.length>2){
                        element.childNodes[k].style.writingMode = "vertical-lr";
                    }
                }
                
            }
        }
            // element.addEventListener("click",function(e){
            //     actionOnClick(e);
            // });
    });
}
/**
 * Construit un formulaire à partir d'informations sous forme de tableau.
 * (voir:function popUpNewRes())
 * @param  {string} name nom du formulaire (name + id)
 * @param  {Int} nbCol nombre de colonne
 * @param  {Array} elements description du formulaire sous forme de tableau
 * @returns un formulaire (HTMLElement)
 */
function initForm(name,nbCol,elements){
    var form = document.createElement("form");
    form.id = name;
    var tb = document.createElement("table");
    form.appendChild(tb);
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
    return form;
}
/**
 * Construit un element HTML avec les attributs renseigné [input,select,button]
 * @param  {string} type [input,select,button]
 * @param  {string} name nom et id de l'element
 * @param  {array} option=null attributs de l'element
 */
function initInput(type,name,option=null){
    switch(type){
        case "select":
            var input = document.createElement(type);
            input.name = name;
            input.id = name;
            option.forEach(function(e){
                var opt = document.createElement("option");
                opt.value = e;
                opt.innerHTML = e;
                input.appendChild(opt);
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
/**
 * Envoi des données au serveur
 * @param  {HTMLElement} form données à envoyer
 * @param  {string} url url du serveur
 */
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
  