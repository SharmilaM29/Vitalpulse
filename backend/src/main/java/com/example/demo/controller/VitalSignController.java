package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.VitalSignDTO;
import com.example.demo.service.VitalSignService;

@RestController
@RequestMapping("/api/vitals")
public class VitalSignController {

    @Autowired
    private VitalSignService vitalSignService;

    @PostMapping("/")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<String> postVitalSign(
            @RequestBody VitalSignDTO.Request vsdr) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(vitalSignService.postVitalSign(vsdr));
    }

    @GetMapping("/")
    @PreAuthorize("hasAnyRole('DOCTOR', 'PATIENT')")
    public ResponseEntity<List<VitalSignDTO.Response>> getVitalSign() {

        return ResponseEntity.ok(
                vitalSignService.getVitalSign()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'PATIENT')")
    public ResponseEntity<VitalSignDTO.Response> getVitalSignbyid(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                vitalSignService.getVitalSignbyid(id)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<String> delete(
            @PathVariable Long id) {

        vitalSignService.delete(id);

        return ResponseEntity.ok(
                "Vital record deleted successfully."
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<String> updateVitalSign(
            @PathVariable Long id,
            @RequestBody VitalSignDTO.Request vsddr) {

        return ResponseEntity.ok(
                vitalSignService.updateVitalSign(id, vsddr)
        );
    }
}
