package com.ems.employeemanagement.service;

import com.ems.employeemanagement.dto.EmployeeDTO;
import com.ems.employeemanagement.exception.DuplicateEmailException;
import com.ems.employeemanagement.exception.EmployeeNotFoundException;
import com.ems.employeemanagement.model.Employee;
import com.ems.employeemanagement.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public EmployeeDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));
        return toDTO(employee);
    }

    public EmployeeDTO createEmployee(EmployeeDTO dto) {
        if (employeeRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateEmailException(dto.getEmail());
        }
        Employee employee = toEntity(dto);
        employee.setId(null);
        Employee saved = employeeRepository.save(employee);
        return toDTO(saved);
    }

    public EmployeeDTO updateEmployee(Long id, EmployeeDTO dto) {
        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));

        employeeRepository.findByEmail(dto.getEmail()).ifPresent(other -> {
            if (!other.getId().equals(id)) {
                throw new DuplicateEmailException(dto.getEmail());
            }
        });

        existing.setFirstName(dto.getFirstName());
        existing.setLastName(dto.getLastName());
        existing.setEmail(dto.getEmail());
        existing.setPhoneNumber(dto.getPhoneNumber());
        existing.setDepartment(dto.getDepartment());
        existing.setDesignation(dto.getDesignation());
        existing.setSalary(dto.getSalary());
        existing.setDateOfJoining(dto.getDateOfJoining());

        Employee updated = employeeRepository.save(existing);
        return toDTO(updated);
    }

    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new EmployeeNotFoundException(id);
        }
        employeeRepository.deleteById(id);
    }

    private EmployeeDTO toDTO(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setEmail(employee.getEmail());
        dto.setPhoneNumber(employee.getPhoneNumber());
        dto.setDepartment(employee.getDepartment());
        dto.setDesignation(employee.getDesignation());
        dto.setSalary(employee.getSalary());
        dto.setDateOfJoining(employee.getDateOfJoining());
        return dto;
    }

    private Employee toEntity(EmployeeDTO dto) {
        Employee employee = new Employee();
        employee.setId(dto.getId());
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setPhoneNumber(dto.getPhoneNumber());
        employee.setDepartment(dto.getDepartment());
        employee.setDesignation(dto.getDesignation());
        employee.setSalary(dto.getSalary());
        employee.setDateOfJoining(dto.getDateOfJoining());
        return employee;
    }
}
