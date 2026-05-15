CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    report_id UUID NOT NULL,

    user_id UUID NOT NULL,

    message TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_comments_report
        FOREIGN KEY(report_id)
        REFERENCES reports(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comments_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);