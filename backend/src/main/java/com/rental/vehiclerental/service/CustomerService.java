package com.rental.vehiclerental.service;

import com.rental.vehiclerental.entity.Customer;
import com.rental.vehiclerental.repository.CustomerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository repository;

    public CustomerService(CustomerRepository repository) {
        this.repository = repository;
    }

    public List<Customer> getAll() {
        return repository.findAll();
    }

    public Customer getById(Long id) {
        return repository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found: " + id));
    }

    public Customer create(Customer customer) {
        if (repository.existsByLicenseNumber(customer.getLicenseNumber())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "License number already exists");
        }
        customer.setId(null);
        return repository.save(customer);
    }

    public Customer update(Long id, Customer updated) {
        Customer existing = getById(id);
        existing.setFullName(updated.getFullName());
        existing.setPhone(updated.getPhone());
        existing.setEmail(updated.getEmail());
        existing.setLicenseNumber(updated.getLicenseNumber());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.delete(getById(id));
    }
}
