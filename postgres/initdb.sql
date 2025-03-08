CREATE schema if not exists public;

ALTER SYSTEM
SET
  wal_level TO 'logical';

SELECT
  pg_reload_conf ();