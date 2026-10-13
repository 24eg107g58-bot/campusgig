package com.campusgig.repository;

import com.campusgig.entity.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    List<Proposal> findByProjectIdOrderByCreatedAtDesc(Long projectId);
    List<Proposal> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    Optional<Proposal> findByProjectIdAndStudentId(Long projectId, Long studentId);
    boolean existsByProjectIdAndStudentId(Long projectId, Long studentId);
}
