package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.VitalSign;

@Repository
public interface VitalSignRepository extends JpaRepository<VitalSign, Long>{

}
