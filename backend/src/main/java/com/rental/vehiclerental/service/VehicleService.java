
package com.rental.vehiclerental.service;

import com.rental.vehiclerental.entity.Vehicle;
import com.rental.vehiclerental.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Optional<Vehicle> getVehicleById(Long id) {
        return vehicleRepository.findById(id);
    }

    public Vehicle addVehicle(Vehicle vehicle) {
        vehicle.setId(null);
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, Vehicle updatedVehicle) {
        Vehicle existingVehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with ID: " + id));

        existingVehicle.setName(updatedVehicle.getName());
        existingVehicle.setBrand(updatedVehicle.getBrand());
        existingVehicle.setModel(updatedVehicle.getModel());
        existingVehicle.setRegistrationNumber(updatedVehicle.getRegistrationNumber());
        existingVehicle.setRentalPricePerDay(updatedVehicle.getRentalPricePerDay());
        existingVehicle.setAvailable(updatedVehicle.getAvailable());
        existingVehicle.setSeatingCapacity(updatedVehicle.getSeatingCapacity());

        return vehicleRepository.save(existingVehicle);
    }

    public void deleteVehicle(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new RuntimeException("Vehicle not found with ID: " + id);
        }

        vehicleRepository.deleteById(id);
    }
}
