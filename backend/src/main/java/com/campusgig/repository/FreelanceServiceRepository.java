package com.campusgig.repository;

import com.campusgig.entity.FreelanceService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FreelanceServiceRepository extends JpaRepository<FreelanceService, Long> {
    List<FreelanceService> findByStudentId(Long studentId);
    Page<FreelanceService> findByActiveTrue(Pageable pageable);

    @Query("SELECT fs FROM FreelanceService fs WHERE fs.active = true " +
           "AND (:category IS NULL OR fs.category = :category) " +
           "AND (:query IS NULL OR LOWER(fs.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(fs.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<FreelanceService> searchServices(@Param("category") String category,
                                          @Param("query") String query,
                                          Pageable pageable);
}
