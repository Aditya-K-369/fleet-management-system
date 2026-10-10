package com.rental.vehiclerental.repository;

import com.rental.vehiclerental.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // True if the vehicle already has an ACTIVE booking overlapping the given dates
    @Query("""
            select count(b) > 0 from Booking b
            where b.vehicle.id = :vehicleId
              and b.status = com.rental.vehiclerental.entity.BookingStatus.ACTIVE
              and b.startDate < :endDate
              and b.endDate > :startDate
            """)
    boolean existsOverlappingBooking(@Param("vehicleId") Long vehicleId,
                                     @Param("startDate") LocalDate startDate,
                                     @Param("endDate") LocalDate endDate);
}
