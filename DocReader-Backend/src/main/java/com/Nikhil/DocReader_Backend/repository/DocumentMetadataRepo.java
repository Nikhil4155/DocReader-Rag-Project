package com.Nikhil.DocReader_Backend.repository;

import com.Nikhil.DocReader_Backend.entity.DocumentMetadata;
import com.Nikhil.DocReader_Backend.entity.DocumentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DocumentMetadataRepo extends JpaRepository<DocumentMetadata, UUID> {

    List<DocumentMetadata> findByStatus(DocumentStatus status);

    List<DocumentMetadata> findAllByOrderByCreatedAtDesc();


}