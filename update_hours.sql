-- Update footer hours in the database
-- This updates the hours field in the site_config table

UPDATE site_config
SET data = jsonb_set(
    jsonb_set(
        jsonb_set(
            data,
            '{footer,hours,monThu}',
            '"07:00 - 17:00"'
        ),
        '{footer,hours,friday}',
        '"07:00 - 16:00"'
    ),
    '{footer,hours,weekend}',
    '"Fechado"'
),
updated_at = CURRENT_TIMESTAMP
WHERE key = 'current_config';

-- Remove old keys if they exist
UPDATE site_config
SET data = data #- '{footer,hours,weekdays}' #- '{footer,hours,saturday}'
WHERE key = 'current_config';
