-- #------------------------------------------------------------
-- #        Script MySQL.
-- #------------------------------------------------------------





-- #------------------------------------------------------------
-- # Table: ligue
-- #------------------------------------------------------------



CREATE TABLE ligue(
        ligue_num   Int Auto_increment NOT NULL ,
        ligue_nom   Varchar (50) NOT NULL ,
        ligue_sport Varchar (50) NOT NULL ,
        ligue_tel   Varchar (10) NOT NULL ,
        ligue_verr  DATE
	,CONSTRAINT ligue_PK PRIMARY KEY (ligue_num)
)ENGINE=InnoDB;





-- #------------------------------------------------------------
-- # Table: utilisateur
-- #------------------------------------------------------------



CREATE TABLE utilisateur(
        utilisateur_num          Int  Auto_increment  NOT NULL ,
        utilisateur_identifiant  Varchar (30) NOT NULL ,
        utilisateur_mdp          Varchar (40) NOT NULL ,
        utilisateur_admin        Bool NOT NULL ,
        utilisateur_responssable Bool NOT NULL ,
        utilisateur_verr         Date ,
        ligue_num                Int NOT NULL
	,CONSTRAINT utilisateur_PK PRIMARY KEY (utilisateur_num)
	,CONSTRAINT utilisateur_ligue_FK FOREIGN KEY (ligue_num) REFERENCES ligue(ligue_num)
)ENGINE=InnoDB;





-- #------------------------------------------------------------
-- # Table: salle
-- #------------------------------------------------------------



CREATE TABLE salle(
        salle_num         Int  Auto_increment  NOT NULL ,
        salle_nom         Varchar (50) NOT NULL ,
        salle_places      Int NOT NULL ,
        salle_informatise Bool NOT NULL ,
        salle_verr        Date
	,CONSTRAINT salle_PK PRIMARY KEY (salle_num)
)ENGINE=InnoDB;





-- #------------------------------------------------------------
-- # Table: reservation
-- #------------------------------------------------------------



CREATE TABLE reservation(
        reservation_num     Int  Auto_increment  NOT NULL ,
        reservation_demande Datetime NOT NULL ,
        reservation_debut   Datetime NOT NULL ,
        reservation_fin     Datetime NOT NULL ,
        ligue_num           Int NOT NULL ,
        salle_num           Int NOT NULL
	,CONSTRAINT reservation_PK PRIMARY KEY (reservation_num)
	,CONSTRAINT reservation_ligue_FK FOREIGN KEY (ligue_num) REFERENCES ligue(ligue_num)
	,CONSTRAINT reservation_salle0_FK FOREIGN KEY (salle_num) REFERENCES salle(salle_num)
)ENGINE=InnoDB;