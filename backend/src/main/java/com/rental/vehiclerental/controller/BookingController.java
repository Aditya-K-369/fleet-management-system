package com.rental.vehiclerental.controller;

import com.rental.vehiclerental.dto.BookingRequest;
import com.rental.vehiclerental.entity.Booking;
import com.rental.vehiclerental.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    @GetMapping
    public List<Booking> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Booking getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Booking create(@RequestBody BookingRequest request) {
        return service.create(request);
    }

    @PatchMapping("/{id}/complete")
    public Booking complete(@PathVariable Long id) {
        return service.complete(id);
    }

    @PatchMapping("/{id}/cancel")
    public Booking cancel(@PathVariable Long id) {
        return service.cancel(id);
    }
}
