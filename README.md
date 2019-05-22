# La maison des ligues de Normandie - PPE1
* Prérequis
* Installation
* Utilisation
* Documentation
## Prérequis
Sur Debian 9:
### Apache2
    sudo apt install apache
### MySQL
    sudo apt install mysql-server
### PHP7
    sudo apt install php
### PhpMyAdmin
    sudo apt install phpmyadmin
### GIT
    sudo apt install git
## Installation
Dans le répertoire `/var/www/html` faire:

    git clone https://github.com/N4n3x/ppe1.git
Dans phpMyAdmin créer la base de données `ahernandez` puis importer le script suivant:

    ./bdd/ahernandez.sql

## Utilisation
### Connexion
![Connexion](./doc/connexion.PNG)
### Gestion des salles et des ligues
![Gestion salles & ligues](./doc/salles.PNG)
### Interface de réservation
![Réservation](./doc/nouvelleReservation.PNG)
## Documentation
[Lien vers la documentation](http://alexandrehernandez.fr/portfolio/documentations/ppe1)