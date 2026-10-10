package com.rental.vehiclerental.service;

import com.rental.vehiclerental.dto.BookingRequest;
import com.rental.vehiclerental.entity.Booking;
import com.rental.vehiclerental.entity.BookingStatus;
import com.rental.vehiclerental.entity.Customer;
import com.rental.vehiclerental.entity.Vehicle;
import com.rental.vehiclerental.repository.BookingRepository;
import com.rental.vehiclerental.repository.CustomerRepository;
import com.rental.vehiclerental.repository.VehicleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final VehicleRepository vehicleRepository;

    public BookingService(BookingRepository bookingRepository,
                          CustomerRepository customerRepository,
                          VehicleRepository vehicleRepository) {
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public List<Booking> getAll() {
        return bookingRepository.findAll();
    }

    public Booking getById(Long id) {
        return bookingRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found: " + id));
    }

    public Booking create(BookingRequest request) {
        if (request.customerId() == null || request.vehicleId() == null
                || request.startDate() == null || request.endDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "customerId, vehicleId, startDate and endDate are required");
        }
        if (!request.endDate().isAfter(request.startDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "End date must be after start date");
        }

        Customer customer = customerRepository.findById(request.customerId()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));
        Vehicle vehicle = vehicleRepository.findById(request.vehicleId()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found"));

        if (bookingRepository.existsOverlappingBooking(
                vehicle.getId(), request.startDate(), request.endDate())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Vehicle is already booked for these dates");
        }

        long days = ChronoUnit.DAYS.between(request.startDate(), request.endDate());
        // String conversion works whether the price field is double, Double or BigDecimal
        BigDecimal dailyRate = new BigDecimal(String.valueOf(vehicle.getRentalPricePerDay()));

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setVehicle(vehicle);
        booking.setStartDate(request.startDate());
        booking.setEndDate(request.endDate());
        booking.setTotalPrice(dailyRate.multiply(BigDecimal.valueOf(days)));
        booking.setStatus(BookingStatus.ACTIVE);
        return bookingRepository.save(booking);
    }

    public Booking complete(Long id) {
        return changeStatus(id, BookingStatus.COMPLETED);
    }

    public Booking cancel(Long id) {
        return changeStatus(id, BookingStatus.CANCELLED);
    }

    private Booking changeStatus(Long id, BookingStatus newStatus) {
        Booking booking = getById(id);
        if (booking.getStatus() != BookingStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Only ACTIVE bookings can be changed");
        }
        booking.setStatus(newStatus);
        return bookingRepository.save(booking);
    }
}
