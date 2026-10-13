package com.campusgig.repository;

import com.campusgig.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
    List<Contract> findByClientIdOrderByStartDateDesc(Long clientId);
    List<Contract> findByStudentIdOrderByStartDateDesc(Long studentId);
    Optional<Contract> findByProjectId(Long projectId);
    boolean existsByProjectId(Long projectId);
}
