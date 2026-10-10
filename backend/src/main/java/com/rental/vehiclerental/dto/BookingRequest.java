package com.rental.vehiclerental.dto;

import java.time.LocalDate;

public record BookingRequest(
        Long customerId,
        Long vehicleId,
        LocalDate startDate,
        LocalDate endDate
) {}
