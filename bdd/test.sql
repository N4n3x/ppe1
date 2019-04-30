select salle.salle_num
from reservation
join salle on reservation.fk_salle_num = salle.salle_num
where
salle_verr is null
and salle_informatise = info
and ( "2019-02-20 11:30:00" < reservation_fin and "2019-02-20 12:30:00" > reservation_debut)