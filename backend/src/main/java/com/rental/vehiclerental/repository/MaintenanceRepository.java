package com.rental.vehiclerental.repository;

import com.rental.vehiclerental.entity.MaintenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaintenanceRepository extends JpaRepository<MaintenanceRecord, Long> {
}
