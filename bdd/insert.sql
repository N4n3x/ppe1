-- ligue
INSERT INTO ligue 
(ligue_nom, ligue_sport, ligue_tel)
VALUES
('AC Caen', 'athlétisme', '0230313233'),
('AC Lisieux', 'athlétisme', '0231323334'),
('AC Bayeux', 'athlétisme', '0232333435'),
('FC Caen', 'football', '0233343536'),
('FC Lisieux', 'football', '0234353637'),
('FC Bayeux', 'football', '0235363738'),
('RC Caen', 'rugby', '0236373839'),
('RC Bayeux', 'rugby', '0237383940'),
('VC Caen', 'volleyball', '0238394041'),
('VC Bayeux', 'volleyball', '0239404142');

-- utilisateur
INSERT INTO utilisateur 
(utilisateur_identifiant, utilisateur_mdp, utilisateur_admin, utilisateur_responssable, ligue_num)
VALUES
('respAcc', 'mdpachanger', 1, 1, 1),
('respAcl', 'mdpachanger', 1, 1, 2),
('respAcb', 'mdpachanger', 1, 1, 3),
('respFcc', 'mdpachanger', 1, 1, 4),
('respAcl', 'mdpachanger', 1, 1, 5),
('respAcb', 'mdpachanger', 1, 1, 6),
('respRcc', 'mdpachanger', 1, 1, 7),
('respRcb', 'mdpachanger', 1, 1, 8),
('respVcc', 'mdpachanger', 1, 1, 9),
('respVcb', 'mdpachanger', 1, 1, 10);

-- salle
INSERT INTO salle 
(salle_nom, salle_places, salle_informatise)
VALUES
('ni_30_1', 30, 0),
('ni_30_2', 30, 0),
('ni_30_3', 30, 0),
('ni_30_4', 30, 0),
('ni_30_5', 30, 0),
('ni_18_1', 18, 0),
('ni_18_2', 18, 0),
('ni_18_3', 18, 0),
('ni_18_4', 18, 0),
('ni_18_5', 18, 0),
('i_18_1', 18, 1),
('i_18_2', 18, 1),
('i_18_3', 18, 1),
('i_18_4', 18, 1),
('i_18_5', 18, 1);