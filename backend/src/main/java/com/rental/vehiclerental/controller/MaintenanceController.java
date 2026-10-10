package com.rental.vehiclerental.controller;

import com.rental.vehiclerental.dto.MaintenanceRequest;
import com.rental.vehiclerental.entity.MaintenanceRecord;
import com.rental.vehiclerental.service.MaintenanceService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = "http://localhost:5173")
public class MaintenanceController {

    private final MaintenanceService service;

    public MaintenanceController(MaintenanceService service) {
        this.service = service;
    }

    @GetMapping
    public List<MaintenanceRecord> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public MaintenanceRecord getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MaintenanceRecord create(@RequestBody MaintenanceRequest request) {
        return service.create(request);
    }

    @PatchMapping("/{id}/complete")
    public MaintenanceRecord complete(@PathVariable Long id) {
        return service.complete(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
