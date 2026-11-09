CREATE TABLE renungan (
  id BIGSERIAL PRIMARY KEY,
  publish_date DATE NOT NULL,
  title TEXT NOT NULL,
  verse TEXT NOT NULL,
  scripture TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  image_attribution TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One entry per day; the service enforces this, the index only guards races.
CREATE UNIQUE INDEX idx_renungan_publish_date ON renungan (publish_date);
CREATE INDEX idx_renungan_published_date ON renungan (is_published, publish_date);
