package com.campusgig.repository;

import com.campusgig.entity.Project;
import com.campusgig.enums.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByClientIdOrderByCreatedAtDesc(Long clientId);

    @Query("SELECT DISTINCT p FROM Project p " +
           "LEFT JOIN p.requiredSkills s " +
           "WHERE (:status IS NULL OR p.status = :status) " +
           "AND (:category IS NULL OR :category = '' OR p.category = :category) " +
           "AND (:minBudget IS NULL OR p.budget >= :minBudget) " +
           "AND (:maxBudget IS NULL OR p.budget <= :maxBudget) " +
           "AND (:query IS NULL OR :query = '' OR LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Project> searchProjects(
            @Param("status") ProjectStatus status,
            @Param("category") String category,
            @Param("minBudget") BigDecimal minBudget,
            @Param("maxBudget") BigDecimal maxBudget,
            @Param("query") String query,
            Pageable pageable
    );
}
