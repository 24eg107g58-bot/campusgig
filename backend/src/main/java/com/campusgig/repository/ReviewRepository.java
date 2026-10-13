package com.campusgig.repository;

import com.campusgig.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRevieweeIdOrderByCreatedAtDesc(Long revieweeId);
    Optional<Review> findByContractId(Long contractId);
    boolean existsByContractId(Long contractId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.reviewee.id = :revieweeId")
    Double calculateAverageRating(@Param("revieweeId") Long revieweeId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.reviewee.id = :revieweeId")
    Long countReviewsForUser(@Param("revieweeId") Long revieweeId);
}
