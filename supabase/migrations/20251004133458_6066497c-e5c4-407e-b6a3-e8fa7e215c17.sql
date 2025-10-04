-- Remove duplicate tools (keep the first created of each duplicate)
WITH duplicates AS (
  SELECT name, MIN(created_at) as first_created
  FROM ai_tools
  WHERE name IN ('Otter.ai', 'Notion AI', 'Tabnine', 'Grammarly', 'Beautiful.ai', 'Runway ML', 'Zendesk AI', 'Julius AI', 'Copy.ai', 'AdCreative.ai', 'Remove.bg', 'Descript')
  GROUP BY name
)
DELETE FROM ai_tools
WHERE id IN (
  SELECT a.id
  FROM ai_tools a
  INNER JOIN duplicates d ON a.name = d.name
  WHERE a.created_at > d.first_created
);