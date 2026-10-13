package com.campusgig.repository;

import com.campusgig.entity.StudentProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByUserId(Long userId);

    @Query("SELECT DISTINCT sp FROM StudentProfile sp " +
           "LEFT JOIN sp.skills s " +
           "WHERE (:query IS NULL OR LOWER(sp.user.fullName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(sp.university) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(sp.degree) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<StudentProfile> searchProfiles(@Param("query") String query, Pageable pageable);
}
