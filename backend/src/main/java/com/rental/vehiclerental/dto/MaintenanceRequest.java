package com.rental.vehiclerental.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MaintenanceRequest(
        Long vehicleId,
        LocalDate serviceDate,
        String description,
        BigDecimal cost
) {}
