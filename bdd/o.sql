select salle.salle_num
from reservation
                                    join salle on reservation.fk_salle_num = salle.salle_num
                                    where
                                    salle_verr is null
                                    and salle_informatise = 1
                                    and ( "2019-01-12 10:30" between reservation_debut and reservation_fin and "2019-01-12 11:00" between reservation_debut and reservation_fin )
                                    or  ( "2019-01-12 10:30" < reservation_debut and "2019-01-12 11:00" > reservation_fin )
                                    or  ( "2019-01-12 10:30" < reservation_debut and "2019-01-12 11:00" between reservation_debut and reservation_fin )
                                    or  ( "2019-01-12 10:30" between reservation_debut and reservation_fin and "2019-01-12 11:00" > reservation_fin)
                                    limit 1