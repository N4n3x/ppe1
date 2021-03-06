/** Construit un tableau HTML aux dimensions correspondant aux données fournies. */
class tableau {
    
    /**
     * @constructor
     * @param  {string} domTarget Id du dom cible
     * @param  {JSON} data Données au format JSON
     * @param  {string} titre="" Titre du tableau (visible au dessus du tableau)
     */
    constructor(domTarget, data, titre = "") {
        this.domTarget = document.querySelector(domTarget);
        this.data = data;
        this.entete = Object.keys(this.data[0]);
        this.titre = titre;
    }

    /** 
     * @desc Construit le tableau HTML aux dimensions nécessaire
     * @param  {string} id="tableJs" Id de la balise table souhaité
     */
    initTableau(id = "tableJs") {
        var table = document.createElement("table");
        table.classList.add("tableJs");
        table.id = id;
        var titreTable = document.createElement("caption");
        titreTable.innerHTML = this.titre;
        table.appendChild(titreTable);
        var headTable = document.createElement("thead");
        var ligHeadTable = document.createElement("tr");
        this.entete.forEach(element => {
            var cellLHT = document.createElement("th");
            cellLHT.innerHTML = element;
            cellLHT.id = element;
            cellLHT.addEventListener("click", function (e) {
                //console.log(e.target);
                sortTable(e);
                console.log(e.target);
            });
            ligHeadTable.appendChild(cellLHT);
        })
        headTable.appendChild(ligHeadTable);
        table.appendChild(headTable);
        var bodyTable = document.createElement("tbody");
        this.data.forEach(element => {
            var elemData = element;
            var ligBodyTable = document.createElement("tr");
            this.entete.forEach(element => {
                var cellLBT = document.createElement("td");
                cellLBT.innerHTML = elemData[element];
                ligBodyTable.appendChild(cellLBT);
            })
            bodyTable.appendChild(ligBodyTable);
        });
        table.appendChild(bodyTable);
        this.domTarget.appendChild(table);
    }
}

/**
 * Modifie la classe Tableau pour fournir une mise en forme conforme aux exigences du PPE1.
 * @extends Tableau
 */
class tablePPE1 extends tableau {

    
    /**
     * @constructor
     * @param  {string} domTarget Id du dom cible 
     * @param  {JSON} data Données au format JSON
     * @param  {string} id Id de la balise table
     * @param  {string} titre Titre du tableau (visible au dessus du tableau)
     * @param  {Array} nomCol Tableau avec les noms de colonnes dans l'ordre voulue
     * @param  {Array} session Données de la session php courante
     */
    constructor(domTarget, data, id, titre, nomCol,session) {
        super(domTarget, data, titre);
        this.dataTable = data;
        this.id = id;
        this.initTableau(this.id);
        this.table = document.getElementById(this.id);
        this.allLignes = this.table.getElementsByTagName("tr");
        this.session = JSON.parse(session);
        this.initBtn();
        this.formatTable(nomCol);
        this.nomTable = Object.keys(this.dataTable[0])[0].split("_")[0];
        this.miseEnForm();
    }
    /**
     * Ajoute les noms de colonnes et change les "0" et les "1" par des OUI et NON vert ou rouge
     * @param  {Array} $nomCol tableau qui contient les noms de colonnes dans le bon ordre
     */
    formatTable($nomCol) {
        
        for (var i = 0; i < $nomCol.length; i++) {
            this.allLignes[0].childNodes[i].innerHTML = $nomCol[i];
        }

        for (var j = 0; j < this.allLignes.length; j++) {
            for (var k = 0; k < this.allLignes[j].childNodes.length; k++) {
                if (k == 0 | k == 4) { this.allLignes[j].childNodes[k].style.display = "none" }
                if (this.allLignes[j].childNodes[k].innerHTML === "0" && this.allLignes[j].childNodes[k].style.display != "none") {
                    this.allLignes[j].childNodes[k].innerHTML = "NON";
                    this.allLignes[j].childNodes[k].style.backgroundColor = "red";
                }
                if (this.allLignes[j].childNodes[k].innerHTML === "1" && this.allLignes[j].childNodes[k].style.display != "none") {
                    this.allLignes[j].childNodes[k].innerHTML = "OUI";
                    this.allLignes[j].childNodes[k].style.backgroundColor = "green";
                }
            }
        }
    }
    /**
     * Ajoute les boutons d'édition des données
     */
    initBtn() {
        
        if (this.session["ligue_nom"] == "ad") {
            var cellBtnAjout = document.createElement("th");
            var cellBtnEmpty = document.createElement("th");
            //var btnAjout = document.createElement("div");
            cellBtnAjout.addEventListener("click", function (e) {
                btnAction(e);
            });
            cellBtnAjout.innerHTML = "+";
            cellBtnAjout.id = "add";
            cellBtnAjout.style.padding = "2px";
            cellBtnAjout.style.backgroundColor = "green";
            cellBtnAjout.style.border = "1px solid black"
            cellBtnAjout.style.borderRadius = "5px";
            cellBtnAjout.style.fontWeight = "bold";
            cellBtnAjout.style.textAlign = "center";
            //cellBtnAjout.appendChild(btnAjout);
            this.allLignes[0].appendChild(cellBtnAjout);
            this.allLignes[0].appendChild(cellBtnEmpty);
            
            for (var l = 1; l < this.allLignes.length; l++) {
                var cellBtnSupr = document.createElement("td");
                var cellBtnEdit = document.createElement("td");
                //-------------------------------------------
                //var btnSupr = document.createElement("div");

                cellBtnSupr.addEventListener("click", function (e) {
                    btnAction(e);
                });
                cellBtnSupr.innerHTML = "X";
                cellBtnSupr.style.padding = "2px";
                cellBtnSupr.style.backgroundColor = "red";
                cellBtnSupr.style.border = "1px solid black"
                cellBtnSupr.style.borderRadius = "5px";
                cellBtnSupr.style.fontWeight = "bold";
                cellBtnSupr.style.textAlign = "center";
                cellBtnSupr.id = "des-" + l;
                //cellBtnSupr.appendChild(btnSupr);
                //---------------------------------------------
                //var btnEdit = document.createElement("div");
                cellBtnEdit.addEventListener("click", function (e) {
                    btnAction(e);
                });
                cellBtnEdit.innerHTML = "Editer";
                cellBtnEdit.id = "update-" + l;
                cellBtnEdit.style.fontWeight = "bold";
                cellBtnEdit.style.textAlign = "center";
                //cellBtnEdit.appendChild(btnEdit);
                //-------------------------------------------
                this.allLignes[l].appendChild(cellBtnSupr);
                this.allLignes[l].appendChild(cellBtnEdit);
            }
        }
        //console.log(this.allLignes[0].childNodes);
        // this.allLignes[0].childNodes.forEach(function(e){
            
        //     e.addEventListener("click", function(e){
        //         console.log(e.target); //js array sort
        //     });
        // });
    }

    miseEnForm(){
        var cells = this.table.tHead.rows[0].cells;
        //console.log(cells);
        for(var i=0; i<cells.length; i++){
            cells[i].style.width = 90/cells.length + "%";
        }
    }
}
/**
 * Execute une action en fonction de l'ID de la cible du clic
 * @param  {string} id format de l'ID: action-num de ligne
 */
function btnAction(e) {
    console.log(e);
    var id = e.target.id;
    var numLig = id.split("-");
    numLig[1] = Number(numLig[1]);
    
    switch (numLig[0]) {
        case 'update':
            initForm(numLig[0], e.target.parentNode);
            break;
        case 'des':
            initForm(numLig[0], e.target.parentNode);
            break;
        case 'add':
            initForm(numLig[0]);
            break;
    }
}
/**
 * Initialise le formulaire en fonction de l'action
 * @param  {string} type action [update,des,add]
 * @param  {HTMLElement} dataLigne=null Ligne du tableau source du clic
 */
function initForm(type, dataLigne = null) {
    if (dataLigne) { var cellLig = dataLigne.childNodes };
    var nom = document.getElementsByTagName("thead")[0].childNodes[0];
    var lenLig = nom.childNodes.length - 2;
    var formZone = document.getElementById("dynContentForm");
    formZone.innerHTML = " ";

    var typeForm = document.createElement("input");
    typeForm.setAttribute("type", "hidden");
    typeForm.setAttribute("value", type);
    typeForm.name = "type";
    formZone.appendChild(typeForm);

    var nomTableForm = document.createElement("input");
    var nomTb = nom.childNodes[0].id.split("_")[0];
    nomTableForm.setAttribute("type", "hidden");
    nomTableForm.setAttribute("value", nomTb);
    nomTableForm.name = "nomTable";
    formZone.appendChild(nomTableForm);

    switch (type) {
        case "update":
            for (var k = 0; k < lenLig; k++) {
                var ligForm = document.createElement("tr");
                ligForm.classList.add("tableJs");
                if (k == 0  || k == lenLig-1){
                    ligForm.style.display = "none";
                }else{
                    var labForm = document.createElement("td");
                    labForm.innerHTML = nom.childNodes[k].innerHTML;
                    ligForm.appendChild(labForm);
                }

                var input = document.createElement("input");
                var inpForm = document.createElement("td");
                input.name = nom.childNodes[k].id;
                if (k == 0  || k == lenLig-1) { input.type = "hidden" } else { input.type = "text" };
                input.value = cellLig[k].innerHTML;
                //if(input.value==="OUI"){input.value=true}else if(input.value==="NON"){input.value=false}
                inpForm.appendChild(input);
                ligForm.appendChild(inpForm);

                formZone.appendChild(ligForm);
            }
            break;
        case "des":
            var cellLig = dataLigne.childNodes;
            var lenLig = dataLigne.childNodes.length - 2;
            var labForm = document.createElement("tr");
            labForm.classList.add("tableJs");
            labForm.innerHTML = "Désactiver " + cellLig[1].innerHTML + " ?";
            formZone.appendChild(labForm);
            for (var k = 0; k < lenLig; k++) {
                var ligForm = document.createElement("tr");
                var input = document.createElement("input");
                var inpForm = document.createElement("td");
                input.name = nom.childNodes[k].id;
                input.type = "hidden";
                input.value = cellLig[k].innerHTML
                if (cellLig[k].innerHTML == "") {
                    currDate = new Date();
                    input.value = currDate.getFullYear() + "-" + (currDate.getMonth() + 1) + "-" + currDate.getDate();
                }
                if (input.value === "OUI") { input.value = 1 } else if (input.value === "NON") { input.value = 0 }
                inpForm.appendChild(input);
                ligForm.appendChild(inpForm);

                formZone.appendChild(ligForm);
            }
            break;
        case "add":
            for (var k = 1; k < lenLig; k++) {
                var ligForm = document.createElement("tr");
                ligForm.classList.add("tableJs");
                if (k == 0  || k == lenLig-1){
                    ligForm.style.display = "none";
                }else{
                    var labForm = document.createElement("td");
                    labForm.innerHTML = nom.childNodes[k].innerHTML;
                    ligForm.appendChild(labForm);
                }
                

                var input = document.createElement("input");
                var inpForm = document.createElement("td");
                input.name = nom.childNodes[k].id;
                if (k == 0 || k == lenLig-1) { input.type = "hidden" } else { input.type = "text" };
                inpForm.appendChild(input);
                ligForm.appendChild(inpForm);

                formZone.appendChild(ligForm);
            }
            break;
    }
    var formulaire = document.getElementById("formEdit");
    formulaire.style.display = "block";
}

function sortTable(filter) {
    var n = filter.target.cellIndex;
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    //table = document.getElementById("myTable2");
    table = filter.target.offsetParent;
    //console.log(table.tBodies[0].rows);
    table = table.tBodies[0];
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 0; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[n];
        //console.log(n);
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount ++;
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
}