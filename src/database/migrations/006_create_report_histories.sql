CREATE TABLE report_histories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    report_id UUID NOT NULL,

    old_status VARCHAR(20),

    new_status VARCHAR(20) NOT NULL,

    changed_by UUID NOT NULL,

    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_histories_report
        FOREIGN KEY(report_id)
        REFERENCES reports(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_histories_user
        FOREIGN KEY(changed_by)
        REFERENCES users(id)
        ON DELETE CASCADE
);