package com.campusgig.repository;

import com.campusgig.entity.User;
import com.campusgig.enums.RoleType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.role.name = :roleType")
    List<User> findByRoleType(@Param("roleType") RoleType roleType);

    @Query("SELECT u FROM User u WHERE u.role.name = :roleType")
    Page<User> findByRoleType(@Param("roleType") RoleType roleType, Pageable pageable);
}
