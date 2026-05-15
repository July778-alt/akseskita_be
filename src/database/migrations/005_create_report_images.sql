CREATE TABLE report_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    report_id UUID NOT NULL,

    image_url TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_report_images_report
        FOREIGN KEY(report_id)
        REFERENCES reports(id)
        ON DELETE CASCADE
);