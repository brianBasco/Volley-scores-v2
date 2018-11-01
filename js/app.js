document.addEventListener("DOMContentLoaded", function(event) {

    document.querySelector("#nveauMatch").addEventListener("click", function() {
        nouveauMatch();
    })

    document.querySelector("#btn_inverser").addEventListener("click", function() {
        change();
    })

    document.querySelector("#nomGauche").addEventListener("blur" , function() {
        scoreGauche.attribuerNom();
        recapNom();
    })
    
    document.querySelector("#nomDroite").addEventListener("blur" , function() {
        scoreDroite.attribuerNom();
        recapNom();
    })  

    let tps_morts = document.querySelectorAll(".tps-mort");
    for(let i = 0; i<tps_morts.length; i++) {
        tps_morts[i].addEventListener("click", function(){
            enlever(this);
        })
    }
})

function initSet(){
    if(sessionStorage.getItem('set') == null) sessionStorage.setItem('set', 1);
}


function initTpsMort(){
    if(sessionStorage.getItem('tpsMortGauche') == null) {
        sessionStorage.setItem('tpsMortGauche', 2);
        sessionStorage.setItem('tpsMortDroite', 2);
    }
    
}


function loadingTpsMort(){
    var tpsmortGauche = sessionStorage.getItem('tpsMortGauche');
    var tpsmortDroite = sessionStorage.getItem('tpsMortDroite');
    for(var i = 0; i<tpsmortGauche; i++){
        var id = "tps" + (i+1);
        document.getElementById(id).style.opacity = 1;
    }
    for(var i = 0; i<tpsmortDroite; i++){
        var id = "tps" + (i+3);
        document.getElementById(id).style.opacity = 1;
    }

}

function setTpsMort(){
    sessionStorage.setItem('tpsMortGauche', 2);
    sessionStorage.setItem('tpsMortDroite', 2);
}



function initTpsMortTech(){
    if(sessionStorage.getItem('tpsMortTech1') == null ){
        sessionStorage.setItem('tpsMortTech1', 0);
        sessionStorage.setItem('tpsMortTech2', 0);
    }   
}

//Remet les temps mort techniques à 0 dans le sessionStorage
function setTpsMortTech(){
    sessionStorage.setItem('tpsMortTech1', 0);
    sessionStorage.setItem('tpsMortTech2', 0);
}


//récupère l'ID d'une balise et l'affiche
function ouvrirDiv(div) {

    var myDiv = $("#" + div);    
    var hauteur = $( document ).height();
    myDiv.css("height", hauteur);
    myDiv.css("display", 'block');
}     

//récupère l'ID d'une balise et enlève son affichage
function fermerDiv(div) {
    
    var myDiv = $("#" + div);
    myDiv.css("display", "none");
}

function disableBtnNveauSet(){
    $("#nveauSet").attr('disabled', true);
}

function enableBtnNveauSet(){
    $("#nveauSet").attr('disabled', false);
}

function nouveauSet(){

    //check si on est à la fin du match    
    if((set_en_cours() >= 5) ){
        //on affiche la div FinMatch
        finMatch();
    }
    else {

    fermerDiv('finSet');

    disableBtnNveauSet();

    //Insertion du score du set suivant le vainqueur
    inscrire_score_set();

    //sessionStorage du set en cours
    incrementer_set();

    //insertion du set dans le HTML
    afficherRound();
    
    //Remet les scores à 0
    scoreGauche.remiseZero();
    scoreDroite.remiseZero();

    //Remet les temps morts techniques à 0
    setTpsMortTech();
    
    //echange les div de place
    change();
            
    //Remet les temps mort à 2 par équipe et les fait réapparaitre 
    setTpsMort();
    loadingTpsMort();
    }
}   

//Echange les div de place
function change(){

        $(".equipe-gauche").toggleClass("droite");
        $(".equipe-droite").toggleClass("droite");
        
        $(".row_btn-score").toggleClass("droite");

        $(".equipe").toggleClass("droite");

        $("#setDroite").toggleClass("droite");
        $("#setGauche").toggleClass("droite");        
 }


//Incrémente le score du set et modifie la vue
function inscrire_score_set(){

    var gauche = parseInt(sessionStorage.getItem("scoreGauche"));
    var droite = parseInt(sessionStorage.getItem("scoreDroite"));

    if(gauche > droite) 
    {
        scoreGauche.setPlusUn();
    }
    else 
    {
        scoreDroite.setPlusUn();
    }
}

//affiche les temps morts techniques quand un score arrive à 8 ou 16
//enregistrer les scores dans le recap

function clickScore(actionAfaire) {

    //ActionAfaire est une methode de la classe Scores
    //Il s'agit d'incrémenter ou décrémenter le score de scoreGauche ou scoreDroite
    actionAfaire;

    //enregistre les scores dans le recap
    enregistrer_score();

    //affichage dans recap
    recap();

    //affiche les temps morts techniques
    var tpsMorttech1 = sessionStorage.getItem('tpsMortTech1');
    var tpsMorttech2 = sessionStorage.getItem('tpsMortTech2');

    var gauche = parseInt(sessionStorage.getItem("scoreGauche"));
    var droite = parseInt(sessionStorage.getItem("scoreDroite"));


    if(set_en_cours() < 5){
        if( (gauche == 8 || droite == 8) && (tpsMorttech1 == 0) )
            {
                if(window.confirm("prendre tps mort")) afficherTempsMort("technique");
                sessionStorage.setItem('tpsMortTech1', 1);
            }
        if((gauche == 16 || droite == 16) && (tpsMorttech2 == 0) )
            {
                if(window.confirm("prendre tps mort")) afficherTempsMort("technique");
                sessionStorage.setItem('tpsMortTech2', 1);
            }

        //calcul des scores pour la fin de match:
        if((gauche >= 25 || droite >= 25) && (((gauche - droite) >= 2) || ((droite - gauche) >= 2)))
        {
            enableBtnNveauSet();

        }
    }
        
    else if(set_en_cours() == 5){

        //demande de changement de position
        if( ((gauche == 8) || (droite == 8)) ) 
        {
            if(window.confirm("changer position")) change();
        }
        if((gauche >=15 || droite >= 15) && (((gauche - droite) >= 2) || ((droite - gauche) >= 2)))
        {
            finMatch();
        }
    }
}


function finSet(){
        insertionInfos();
        ouvrirDiv('finSet');
}

function finMatch(){
    insertionInfos();
    ouvrirDiv('finMatch');    
}

//Fait disparaitre les temps morts quand ils sont cliqués
function enlever(element){
    
    if(window.confirm("temps mort")) {
        afficherTempsMort('normal');

        let numero = element.getAttribute("data-tps_mort");

        if(numero == 1 || numero == 2){
            var tpsMort = sessionStorage.getItem('tpsMortGauche');
            tpsMort --;
            sessionStorage.setItem('tpsMortGauche', tpsMort);
        }
        else {
            var tpsMort = sessionStorage.getItem('tpsMortDroite');
            tpsMort --;
            sessionStorage.setItem('tpsMortDroite', tpsMort);
        }
        
        element.style.opacity = 0;
    }
    
}

   
//affiche TEMPS MORT TECHNIQUE
function afficherTempsMort(tpsMort) {

    insertionInfos();
    var tps = $("#tempsMortTechnique");

    //Si c'est un temps mort technique
    if (tpsMort == "technique") {
              
        tps.css("display", "block");

        setTimeout(function () {
            tps.css("opacity", 1);
        }, 200)

        chrono(60);
    }
    else if (tpsMort == "normal"){

        tps.css("display", "block");

        setTimeout(function () {
            tps.css("opacity", 1);
        }, 200)

        chrono(30);
    }
}

function passerTempsMortTechnique(){
    var tps = $("#tempsMortTechnique");

    tps.css("opacity", 0);
    tps.css("display", "none");
}


//Tout remettre à zéro et supprimer les sessions storage
function nouveauMatch(){

    if(window.confirm("nouveau Match ?")) {
        sessionStorage.clear();
        location = location;
    }
}

//Enregistrement du score dans sessionStorage
function enregistrer_score(){

    var gauche = sessionStorage.getItem("scoreGauche");
    var droite = sessionStorage.getItem("scoreDroite");

    for(var i = 1; i <= 5; i++){
        if(set_en_cours() == i){
            sessionStorage.setItem('set'+i+'_score_gauche', gauche);
            sessionStorage.setItem('set'+i+'_score_droite', droite);
        }
    }
}

function set_en_cours(){

    return sessionStorage.getItem('set');
}

function incrementer_set(){
    var set = set_en_cours();
    set++;

    sessionStorage.setItem('set', set);
}




function afficherNewSet(){
    var height = $(document).height();
    var equipe1 = document.getElementById('equipe1');
    var equipe2 = document.getElementById('equipe2');
    var x = document.getElementById("myAudio");

    x.play();

    afficherRound();

    if(b("nomGauche") != "equipe" && b("nomGauche") != "") equipe1.value = sessionStorage.getItem('nomGauche');
    else equipe1.value = "equipe 1";

    if(b("nomDroite") != "equipe" && b("nomDroite") != "") equipe2.value = sessionStorage.getItem('nomDroite');
    else equipe2.value = "equipe 2";

    $('.newSet').css('height', height);
    $('.newSet').css('display', 'block');

    setTimeout(function(){
        $('.newSet').css('display', 'none');
    }, 5000) //Afficher le nouveau set pendant 5 secondes
}

function afficherRound(){
    var balise = document.getElementById('numeroRound');
    balise.value = set_en_cours();
}

function a(cle){
    return document.getElementById(cle).value = sessionStorage.getItem(cle);
}

function b(cle){
    return sessionStorage.getItem(cle);
}

function c(cle){
    return document.getElementById(cle);
}

//Récupère le temps de chrono du HTML, 30 secondes ou 60 secondes
function chrono(tps){
    var chrono = $("#chrono");
    var time = tps;
    var display = $("#tempsMortTechnique").css("display");

    setInterval(function(){
        
        if((time >= 0) && (display == "block")){
            chrono.html(time);
            time--;
            display = $("#tempsMortTechnique").css("display");            
        }
        else {
            
            clearInterval();            
        }            
    }, 1000);
    
    chrono.html("");
}


function insertionInfos(){

    var equipeGauche = $(".equipeGauche p");
    var equipeDroite = $(".equipeDroite p");
    var scoreGauche = $(".equipeGauche button");
    var scoreDroite = $(".equipeDroite button");

    var score1 = sessionStorage.getItem("scoreGauche");
    var score2 = sessionStorage.getItem("scoreDroite");
    var nom1 = sessionStorage.getItem("nomGauche");
    var nom2 = sessionStorage.getItem("nomDroite");

    equipeGauche.html(nom1);
    equipeDroite.html(nom2);
    scoreGauche.html(score1);
    scoreDroite.html(score2);

}










 
