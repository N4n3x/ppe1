DELIMITER |
create procedure resSalle (IN deb datetime, IN fin datetime, IN info tinyint(1), IN ligue int)
begin
set @salle = (select salle_num 
              from salle
              where salle_verr is null
              and salle_informatise = info
              and salle_num not in (select salle.salle_num
                                    from reservation
                                    join salle on reservation.salle_num = salle.salle_num
                                    where
                                    salle_verr is null
                                    and salle_informatise = info
                                    and ( deb between reservation_debut and reservation_fin and fin between reservation_debut and reservation_fin )
                                    or  ( deb < reservation_debut and fin > reservation_fin )
                                    or  ( deb < reservation_debut and fin between reservation_debut and reservation_fin
                                    or  ( deb between reservation_debut and reservation_fin and fin > reservation_fin))
                                    limit 1)|
              if (@salle is not null ) then
              insert into reservation (reservation_demande, reservation_debut, reservation_fin, ligue_num, salle_num)
              values (now(), deb, fin, ligue, @salle);
              end if|
              if (@salle is null ) then
              signal sqlstate '45000' set message_text = 'Reservation impossible pour les critères choisies';
              end if|
              end;