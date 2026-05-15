CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    category_id UUID NOT NULL,

    title VARCHAR(200) NOT NULL,

    description TEXT NOT NULL,

    image_url TEXT,

    status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK(status IN (
        'pending',
        'verified',
        'in_progress',
        'resolved',
        'rejected'
    )),

    latitude DECIMAL(10,8),

    longitude DECIMAL(11,8),

    address TEXT,

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_reports_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_reports_category
        FOREIGN KEY(category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE
);