package com.zosh.service;

public interface AuditLogService {
    void log(String action, String entityType, Long entityId, String performedBy, String details);
}
