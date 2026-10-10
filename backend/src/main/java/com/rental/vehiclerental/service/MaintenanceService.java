package com.rental.vehiclerental.service;

import com.rental.vehiclerental.dto.MaintenanceRequest;
import com.rental.vehiclerental.entity.MaintenanceRecord;
import com.rental.vehiclerental.entity.MaintenanceStatus;
import com.rental.vehiclerental.entity.Vehicle;
import com.rental.vehiclerental.repository.MaintenanceRepository;
import com.rental.vehiclerental.repository.VehicleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final VehicleRepository vehicleRepository;

    public MaintenanceService(MaintenanceRepository maintenanceRepository,
                              VehicleRepository vehicleRepository) {
        this.maintenanceRepository = maintenanceRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public List<MaintenanceRecord> getAll() {
        return maintenanceRepository.findAll();
    }

    public MaintenanceRecord getById(Long id) {
        return maintenanceRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Maintenance record not found: " + id));
    }

    public MaintenanceRecord create(MaintenanceRequest request) {
        if (request.vehicleId() == null || request.serviceDate() == null
                || request.description() == null || request.description().isBlank()
                || request.cost() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "vehicleId, serviceDate, description and cost are required");
        }
        if (request.cost().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cost cannot be negative");
        }

        Vehicle vehicle = vehicleRepository.findById(request.vehicleId()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found"));

        MaintenanceRecord record = new MaintenanceRecord();
        record.setVehicle(vehicle);
        record.setServiceDate(request.serviceDate());
        record.setDescription(request.description());
        record.setCost(request.cost());
        record.setStatus(MaintenanceStatus.SCHEDULED);
        return maintenanceRepository.save(record);
    }

    public MaintenanceRecord complete(Long id) {
        MaintenanceRecord record = getById(id);
        if (record.getStatus() == MaintenanceStatus.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Record is already completed");
        }
        record.setStatus(MaintenanceStatus.COMPLETED);
        return maintenanceRepository.save(record);
    }

    public void delete(Long id) {
        maintenanceRepository.delete(getById(id));
    }
}
