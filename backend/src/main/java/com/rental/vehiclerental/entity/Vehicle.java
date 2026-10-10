
package com.rental.vehiclerental.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

import java.math.BigDecimal;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Vehicle name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Brand is required")
    @Column(nullable = false)
    private String brand;

    @NotBlank(message = "Model is required")
    @Column(nullable = false)
    private String model;

    @NotBlank(message = "Registration number is required")
    @Column(nullable = false, unique = true)
    private String registrationNumber;

    @NotNull(message = "Rental price is required")
    @DecimalMin(value = "0.01", message = "Rental price must be greater than zero")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal rentalPricePerDay;

    @NotNull(message = "Availability status is required")
    @Column(nullable = false)
    private Boolean available = true;

    @NotNull(message = "Seating capacity is required")
    @Min(value = 1, message = "Seating capacity must be at least 1")
    @Column(nullable = false)
    private Integer seatingCapacity;

    public Vehicle() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public BigDecimal getRentalPricePerDay() {
        return rentalPricePerDay;
    }

    public void setRentalPricePerDay(BigDecimal rentalPricePerDay) {
        this.rentalPricePerDay = rentalPricePerDay;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public Integer getSeatingCapacity() {
        return seatingCapacity;
    }

    public void setSeatingCapacity(Integer seatingCapacity) {
        this.seatingCapacity = seatingCapacity;
    }
}
