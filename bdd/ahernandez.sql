-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Client :  localhost:3306
-- Généré le :  Mar 21 Mai 2019 à 12:14
-- Version du serveur :  5.7.25-0ubuntu0.18.04.2
-- Version de PHP :  7.2.15-0ubuntu0.18.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `ahernandez`
--

DELIMITER $$
--
-- Procédures
--
CREATE DEFINER=`ahernandez`@`localhost` PROCEDURE `resSalle` (IN `deb` DATETIME, IN `fin` DATETIME, IN `info` TINYINT, IN `ligue` INT, IN `places` INT)  begin
set @salle = (select salle_num 
              from salle
              where salle_verr is null
              and salle_informatise = info
              and salle_places = places
              and salle_num not in (select salle.salle_num
                                    from reservation
                                    join salle on reservation.fk_salle_num = salle.salle_num
                                    where
                                    salle_verr is null
                                    and salle_informatise = info
                                    and ( deb < reservation_fin and fin > reservation_debut))
              						ORDER BY RAND()
                                    limit 1);
if ((@salle is not null) and (deb<fin)) then
	insert into reservation (reservation_demande, reservation_debut, reservation_fin, fk_ligue_num, fk_salle_num)
    values (now(), deb, fin, ligue, @salle);
ELSE
    signal sqlstate '45000' set message_text = 'Reservation impossible pour les critères choisies';
end if;
end$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `ligue`
--

CREATE TABLE `ligue` (
  `ligue_num` int(11) NOT NULL,
  `ligue_nom` varchar(50) NOT NULL,
  `ligue_sport` varchar(50) NOT NULL,
  `ligue_tel` varchar(10) NOT NULL,
  `ligue_verr` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ligue`
--

INSERT INTO `ligue` (`ligue_num`, `ligue_nom`, `ligue_sport`, `ligue_tel`, `ligue_verr`) VALUES
(1, 'AC Caen', 'athletisme', '0230313233', NULL),
(2, 'AC Lisieux', 'athletisme', '0231323334', NULL),
(3, 'AC Bayeux', 'athletisme', '0232333435', NULL),
(4, 'FC Caen', 'football', '0233343536', NULL),
(5, 'FC Lisieux', 'football', '0234353637', NULL),
(6, 'FC Bayeux', 'football', '0235363738', NULL),
(7, 'RC Caen', 'rugby', '0236373839', NULL),
(8, 'RC Bayeux', 'rugby', '0237383940', NULL),
(9, 'VC Caen', 'volleyball', '0238394041', NULL),
(10, 'VC Bayeux', 'volleyball', '0239404142', NULL),
(11, 'ad', 'ad', '0000000001', NULL),
(12, 'teste', 'osef', '0000000002', '2019-01-16'),
(13, 'ligue 2', 'football', '0601020304', NULL),
(14, 'ligue', 'football', '0601020304', '2019-03-04');

-- --------------------------------------------------------

--
-- Structure de la table `reservation`
--

CREATE TABLE `reservation` (
  `reservation_num` int(11) NOT NULL,
  `reservation_demande` datetime NOT NULL,
  `reservation_debut` datetime NOT NULL,
  `fk_ligue_num` int(11) NOT NULL,
  `fk_salle_num` int(11) NOT NULL,
  `reservation_fin` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `reservation`
--

INSERT INTO `reservation` (`reservation_num`, `reservation_demande`, `reservation_debut`, `fk_ligue_num`, `fk_salle_num`, `reservation_fin`) VALUES
(120, '2019-01-13 20:42:29', '2019-01-15 08:00:00', 11, 11, '2019-01-15 10:30:00'),
(123, '2019-01-13 21:34:22', '2019-01-14 08:00:00', 11, 12, '2019-01-14 18:30:00'),
(124, '2019-01-13 23:32:56', '2019-01-16 08:00:00', 11, 6, '2019-01-16 08:30:00'),
(125, '2019-01-14 18:01:37', '2019-01-16 08:00:00', 11, 7, '2019-01-16 08:30:00'),
(127, '2019-01-14 18:03:47', '2019-01-15 08:00:00', 11, 12, '2019-01-15 11:30:00'),
(129, '2019-01-14 18:05:02', '2019-01-14 08:00:00', 11, 13, '2019-01-14 18:30:00'),
(130, '2019-01-14 18:05:32', '2019-01-14 08:00:00', 11, 14, '2019-01-14 18:30:00'),
(131, '2019-01-14 18:05:42', '2019-01-14 08:00:00', 11, 15, '2019-01-14 18:30:00'),
(132, '2019-01-14 18:05:51', '2019-01-14 08:00:00', 11, 20, '2019-01-14 18:30:00'),
(134, '2019-01-14 18:11:42', '2019-01-14 08:00:00', 11, 11, '2019-01-14 18:30:00'),
(135, '2019-01-14 18:13:45', '2019-01-17 08:00:00', 11, 6, '2019-01-17 18:30:00'),
(138, '2019-02-05 09:24:14', '2019-02-05 12:00:00', 11, 11, '2019-02-05 12:30:00'),
(139, '2019-02-11 11:52:48', '2019-02-12 08:00:00', 11, 11, '2019-02-12 12:30:00'),
(140, '2019-02-11 11:53:04', '2019-02-12 08:00:00', 11, 12, '2019-02-12 10:30:00'),
(141, '2019-02-19 14:32:57', '2019-02-20 08:00:00', 11, 11, '2019-02-20 11:30:00'),
(151, '2019-02-24 15:35:12', '2019-02-20 08:00:00', 11, 20, '2019-02-20 11:30:00'),
(154, '2019-02-24 16:23:45', '2019-02-23 08:30:00', 11, 11, '2019-02-23 09:00:00'),
(155, '2019-02-24 16:24:26', '2019-02-23 08:00:00', 11, 12, '2019-02-23 10:30:00'),
(157, '2019-02-24 16:32:21', '2019-02-22 11:30:00', 11, 11, '2019-02-22 12:00:00'),
(166, '2019-02-24 17:08:53', '2019-02-23 08:00:00', 11, 13, '2019-02-23 11:30:00'),
(178, '2019-02-25 12:44:48', '2019-02-25 08:00:00', 11, 11, '2019-02-25 14:30:00'),
(195, '2019-02-25 15:24:36', '2019-04-11 08:00:00', 11, 11, '2019-04-11 08:30:00'),
(197, '2019-02-25 16:21:22', '2019-02-28 08:00:00', 11, 11, '2019-02-28 08:30:00'),
(201, '2019-02-25 16:28:30', '2019-03-01 08:00:00', 11, 11, '2019-03-01 08:30:00'),
(206, '2019-02-25 16:53:00', '2019-02-26 11:30:00', 11, 12, '2019-02-26 17:00:00'),
(207, '2019-02-25 16:53:43', '2019-02-26 08:30:00', 11, 12, '2019-02-26 09:00:00'),
(210, '2019-02-25 16:55:25', '2019-02-27 08:00:00', 11, 12, '2019-02-27 17:30:00'),
(213, '2019-02-25 17:06:56', '2019-02-20 11:30:00', 11, 13, '2019-02-20 12:00:00'),
(214, '2019-02-25 17:07:20', '2019-02-20 14:00:00', 11, 11, '2019-02-20 14:30:00'),
(216, '2019-02-25 17:27:04', '2019-02-21 08:00:00', 11, 11, '2019-02-21 10:30:00'),
(219, '2019-02-25 17:27:40', '2019-02-22 11:00:00', 11, 11, '2019-02-22 11:30:00'),
(220, '2019-02-25 17:27:57', '2019-02-22 12:00:00', 11, 11, '2019-02-22 12:30:00'),
(221, '2019-02-25 19:11:46', '2019-03-01 09:00:00', 11, 14, '2019-03-01 09:30:00'),
(222, '2019-02-25 19:11:49', '2019-03-01 09:30:00', 11, 13, '2019-03-01 10:00:00'),
(223, '2019-02-25 19:11:51', '2019-03-01 10:00:00', 11, 14, '2019-03-01 10:30:00'),
(224, '2019-02-25 19:11:53', '2019-03-01 10:30:00', 11, 12, '2019-03-01 11:00:00'),
(225, '2019-02-25 19:11:56', '2019-03-01 11:00:00', 11, 13, '2019-03-01 11:30:00'),
(227, '2019-02-25 20:47:52', '2019-02-18 08:00:00', 11, 15, '2019-02-18 11:30:00'),
(230, '2019-02-25 20:48:48', '2019-02-25 08:30:00', 11, 20, '2019-02-25 09:00:00'),
(232, '2019-02-25 21:16:57', '2019-03-01 12:00:00', 11, 14, '2019-03-01 12:30:00'),
(233, '2019-02-25 21:35:08', '2019-02-28 12:00:00', 11, 11, '2019-02-28 12:30:00'),
(234, '2019-02-25 21:36:20', '2019-02-28 12:30:00', 11, 14, '2019-02-28 13:00:00'),
(235, '2019-02-25 21:45:29', '2019-03-06 08:00:00', 11, 11, '2019-03-06 08:30:00'),
(236, '2019-02-25 21:49:05', '2019-03-04 08:00:00', 11, 12, '2019-03-04 08:30:00'),
(237, '2019-02-25 21:55:12', '2019-03-06 08:30:00', 11, 20, '2019-03-06 12:00:00'),
(238, '2019-02-25 22:04:42', '2019-03-14 08:00:00', 11, 11, '2019-03-14 10:30:00'),
(239, '2019-02-25 22:04:53', '2019-03-21 08:00:00', 11, 11, '2019-03-21 12:30:00'),
(240, '2019-02-25 22:05:51', '2019-03-21 08:00:00', 11, 13, '2019-03-21 10:30:00'),
(241, '2019-02-26 15:13:15', '2019-02-22 08:00:00', 11, 12, '2019-02-22 08:30:00'),
(244, '2019-02-26 15:20:04', '2019-02-27 08:00:00', 11, 14, '2019-02-27 08:30:00'),
(246, '2019-02-26 15:22:15', '2019-03-08 08:30:00', 11, 14, '2019-03-08 09:00:00'),
(250, '2019-02-26 15:42:04', '2019-02-25 18:30:00', 11, 12, '2019-02-25 19:00:00'),
(251, '2019-02-26 15:42:12', '2019-02-25 19:00:00', 11, 11, '2019-02-25 22:30:00'),
(252, '2019-02-26 15:42:21', '2019-02-25 18:30:00', 11, 20, '2019-02-25 21:00:00'),
(254, '2019-02-26 16:05:59', '2019-02-25 11:30:00', 11, 12, '2019-02-25 16:00:00'),
(255, '2019-02-26 16:07:50', '2019-03-05 08:00:00', 11, 20, '2019-03-05 10:30:00'),
(256, '2019-02-26 16:07:56', '2019-03-05 08:00:00', 11, 11, '2019-03-05 10:30:00'),
(257, '2019-02-26 16:08:00', '2019-03-05 08:00:00', 11, 12, '2019-03-05 10:30:00'),
(260, '2019-02-26 17:46:42', '2019-03-02 08:00:00', 11, 20, '2019-03-02 09:00:00'),
(261, '2019-02-26 17:46:50', '2019-03-02 08:00:00', 11, 14, '2019-03-02 09:00:00'),
(262, '2019-02-26 17:47:02', '2019-03-02 08:30:00', 11, 12, '2019-03-02 09:30:00'),
(263, '2019-02-26 17:47:23', '2019-03-02 09:00:00', 11, 13, '2019-03-02 10:00:00'),
(264, '2019-02-26 17:47:37', '2019-03-02 10:00:00', 11, 14, '2019-03-02 11:00:00'),
(265, '2019-02-26 17:47:46', '2019-03-02 10:30:00', 11, 15, '2019-03-02 11:30:00'),
(266, '2019-02-27 15:03:07', '2019-03-07 08:00:00', 11, 13, '2019-03-07 10:30:00'),
(267, '2019-03-03 21:34:18', '2019-02-28 08:00:00', 11, 15, '2019-02-28 12:30:00'),
(268, '2019-03-03 21:34:35', '2019-02-28 08:30:00', 11, 14, '2019-02-28 11:00:00'),
(269, '2019-03-03 21:34:59', '2019-03-01 08:00:00', 11, 20, '2019-03-01 16:30:00'),
(270, '2019-03-03 21:36:34', '2019-03-01 08:30:00', 11, 11, '2019-03-01 12:00:00'),
(271, '2019-03-04 13:20:44', '2019-03-06 08:00:00', 11, 14, '2019-03-06 08:30:00'),
(273, '2019-03-04 13:36:32', '2019-03-08 08:00:00', 11, 13, '2019-03-08 17:30:00'),
(274, '2019-03-04 13:40:01', '2019-03-05 13:30:00', 11, 14, '2019-03-05 16:00:00'),
(275, '2019-03-04 13:40:23', '2019-03-06 14:00:00', 11, 12, '2019-03-06 17:30:00'),
(276, '2019-04-30 11:59:23', '2019-05-01 08:00:00', 11, 31, '2019-05-01 10:30:00');

-- --------------------------------------------------------

--
-- Structure de la table `salle`
--

CREATE TABLE `salle` (
  `salle_num` int(11) NOT NULL,
  `salle_nom` varchar(50) NOT NULL,
  `salle_places` int(11) NOT NULL,
  `salle_informatise` tinyint(1) NOT NULL,
  `salle_verr` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `salle`
--

INSERT INTO `salle` (`salle_num`, `salle_nom`, `salle_places`, `salle_informatise`, `salle_verr`) VALUES
(1, 'ni_30_1', 30, 0, NULL),
(2, 'ni_30_2', 30, 0, NULL),
(3, 'ni_30_3', 30, 0, NULL),
(4, 'ni_30_4', 30, 0, NULL),
(5, 'ni_30_5', 30, 0, NULL),
(6, 'ni_18_1', 18, 0, NULL),
(7, 'ni_18_2', 18, 0, NULL),
(8, 'ni_18_3', 18, 0, NULL),
(9, 'ni_18_4', 18, 0, NULL),
(10, 'ni_18_5', 18, 0, NULL),
(11, 'i_18_1', 18, 1, NULL),
(12, 'i_18_2', 18, 1, NULL),
(13, 'i_18_3', 18, 1, NULL),
(14, 'i_18_4', 18, 1, NULL),
(15, 'i_18_5', 18, 1, NULL),
(17, 'i_18_6', 18, 1, '2018-11-16'),
(20, 'i_18_6', 18, 1, NULL),
(21, 'ni_18_6', 18, 0, NULL),
(22, 'teste', 30, 1, '2019-01-14'),
(23, 'teste', 30, 1, '2019-01-14'),
(24, 'tes', 30, 1, '2019-01-16'),
(25, 'test', 30, 1, '2019-01-16'),
(26, 'oo', 10, 1, '2019-01-16'),
(27, 'Dublin', 18, 1, '2019-03-04'),
(28, 'Dublin', 18, 1, '2019-03-04'),
(29, 'Dublin2', 18, 1, '2019-03-04'),
(30, 'Dublin2', 18, 1, '2019-03-04'),
(31, 'Dublin', 18, 1, NULL),
(32, 'Dublin 2', 18, 1, NULL),
(33, 'Dublin3', 18, 1, '2019-03-04');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `utilisateur_num` int(11) NOT NULL,
  `utilisateur_identifiant` varchar(30) NOT NULL,
  `utilisateur_mdp` varchar(40) NOT NULL,
  `utilisateur_admin` tinyint(1) NOT NULL,
  `utilisateur_responssable` tinyint(1) NOT NULL,
  `utilisateur_verr` date DEFAULT NULL,
  `fk_ligue_num` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `utilisateur`
--

INSERT INTO `utilisateur` (`utilisateur_num`, `utilisateur_identifiant`, `utilisateur_mdp`, `utilisateur_admin`, `utilisateur_responssable`, `utilisateur_verr`, `fk_ligue_num`) VALUES
(1, 'respAcc', 'MdpDuJury@956842', 0, 1, NULL, 1),
(2, 'respAcl', 'mdpachanger', 0, 1, NULL, 2),
(3, 'respAcb', 'mdpachanger', 0, 1, NULL, 3),
(4, 'respFcc', 'mdpachanger', 0, 1, NULL, 4),
(5, 'respAcl', 'mdpachanger', 0, 1, NULL, 5),
(6, 'respAcb', 'mdpachanger', 0, 1, NULL, 6),
(7, 'respRcc', 'mdpachanger', 0, 1, NULL, 7),
(8, 'respRcb', 'mdpachanger', 0, 1, NULL, 8),
(9, 'respVcc', 'mdpachanger', 0, 1, NULL, 9),
(10, 'respVcb', 'mdpachanger', 0, 1, NULL, 10),
(11, 'admin', 'admin', 1, 0, NULL, 11),
(12, 'juryadmin', 'MdpDuJury@956842', 1, 0, NULL, 11);

--
-- Index pour les tables exportées
--

--
-- Index pour la table `ligue`
--
ALTER TABLE `ligue`
  ADD PRIMARY KEY (`ligue_num`);

--
-- Index pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`reservation_num`),
  ADD KEY `reservation_ligue_FK` (`fk_ligue_num`),
  ADD KEY `reservation_salle0_FK` (`fk_salle_num`);

--
-- Index pour la table `salle`
--
ALTER TABLE `salle`
  ADD PRIMARY KEY (`salle_num`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`utilisateur_num`),
  ADD KEY `utilisateur_ligue_FK` (`fk_ligue_num`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `ligue`
--
ALTER TABLE `ligue`
  MODIFY `ligue_num` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT pour la table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `reservation_num` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=277;
--
-- AUTO_INCREMENT pour la table `salle`
--
ALTER TABLE `salle`
  MODIFY `salle_num` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;
--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `utilisateur_num` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `reservation_ligue_FK` FOREIGN KEY (`fk_ligue_num`) REFERENCES `ligue` (`ligue_num`),
  ADD CONSTRAINT `reservation_salle0_FK` FOREIGN KEY (`fk_salle_num`) REFERENCES `salle` (`salle_num`);

--
-- Contraintes pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD CONSTRAINT `utilisateur_ligue_FK` FOREIGN KEY (`fk_ligue_num`) REFERENCES `ligue` (`ligue_num`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
