DELIMITER $$
CREATE DEFINER=`ahernandez`@`localhost` PROCEDURE `resSalle`(IN `deb` DATETIME, IN `fin` DATETIME, IN `info` TINYINT, IN `ligue` INT, IN `places` INT)
begin
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