-- Run this in PostgreSQL/Supabase SQL Editor.
-- It fixes the schema expected by the Spring Boot backend and adds sample data
-- so the admin dashboard can render real slot and booking numbers.

begin;

create table if not exists parking_slots (
  id bigserial primary key,
  slot_number varchar(255) not null,
  floor integer not null,
  status varchar(30) not null default 'AVAILABLE',
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

create table if not exists bookings (
  id bigserial primary key,
  user_id bigint,
  parking_slot_id bigint,
  start_time timestamp,
  end_time timestamp,
  status varchar(30),
  created_at timestamp,
  updated_at timestamp
);

alter table parking_slots
  add column if not exists slot_number varchar(255),
  add column if not exists floor integer,
  add column if not exists status varchar(30),
  add column if not exists created_at timestamp,
  add column if not exists updated_at timestamp;

update parking_slots
set
  status = coalesce(status, 'AVAILABLE'),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now());

alter table bookings
  add column if not exists user_id bigint,
  add column if not exists parking_slot_id bigint,
  add column if not exists start_time timestamp,
  add column if not exists end_time timestamp,
  add column if not exists status varchar(30),
  add column if not exists created_at timestamp,
  add column if not exists updated_at timestamp;

update bookings
set
  start_time = coalesce(start_time, now()),
  end_time = coalesce(end_time, now() + interval '2 hours'),
  status = coalesce(status, 'PENDING'),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now());

with seed_slots as (
  select
    floor_no,
    concat(chr(64 + floor_no), lpad(slot_no::text, 2, '0')) as slot_number,
    case
      when floor_no = 1 and slot_no = 1 then 'RESERVED'
      when floor_no = 1 and slot_no = 2 then 'OCCUPIED'
      when floor_no = 2 and slot_no = 1 then 'RESERVED'
      else 'AVAILABLE'
    end as status
  from generate_series(1, 3) as floor_no
  cross join generate_series(1, 10) as slot_no
)
insert into parking_slots (slot_number, floor, status, created_at, updated_at)
select slot_number, floor_no, status, now(), now()
from seed_slots s
where not exists (
  select 1
  from parking_slots ps
  where ps.floor = s.floor_no
    and ps.slot_number = s.slot_number
);

update bookings
set parking_slot_id = (
  select id
  from parking_slots
  order by floor, slot_number
  limit 1
)
where parking_slot_id is null
  and exists (select 1 from parking_slots);

with first_user as (
  select user_id
  from users
  order by user_id
  limit 1
),
sample_bookings(slot_number, start_time, end_time, status) as (
  values
    ('A01', date_trunc('day', now() at time zone 'Asia/Ho_Chi_Minh') + interval '8 hours',  date_trunc('day', now() at time zone 'Asia/Ho_Chi_Minh') + interval '10 hours', 'CONFIRMED'),
    ('A02', date_trunc('day', now() at time zone 'Asia/Ho_Chi_Minh') + interval '11 hours', date_trunc('day', now() at time zone 'Asia/Ho_Chi_Minh') + interval '13 hours', 'PENDING'),
    ('B01', date_trunc('day', now() at time zone 'Asia/Ho_Chi_Minh') + interval '15 hours', date_trunc('day', now() at time zone 'Asia/Ho_Chi_Minh') + interval '17 hours', 'CONFIRMED'),
    ('A03', date_trunc('day', now() at time zone 'Asia/Ho_Chi_Minh') - interval '1 day' + interval '7 hours',  date_trunc('day', now() at time zone 'Asia/Ho_Chi_Minh') - interval '1 day' + interval '9 hours', 'COMPLETED'),
    ('B02', date_trunc('day', now() at time zone 'Asia/Ho_Chi_Minh') - interval '1 day' + interval '10 hours', date_trunc('day', now() at time zone 'Asia/Ho_Chi_Minh') - interval '1 day' + interval '12 hours', 'CONFIRMED'),
    ('C01', date_trunc('day', now() at time zone 'Asia/Ho_Chi_Minh') - interval '1 day' + interval '16 hours', date_trunc('day', now() at time zone 'Asia/Ho_Chi_Minh') - interval '1 day' + interval '18 hours', 'PENDING')
),
target_rows as (
  select
    u.user_id,
    ps.id as parking_slot_id,
    b.start_time,
    b.end_time,
    b.status
  from sample_bookings b
  cross join first_user u
  join parking_slots ps on ps.slot_number = b.slot_number
)
insert into bookings (user_id, parking_slot_id, start_time, end_time, status, created_at, updated_at)
select user_id, parking_slot_id, start_time, end_time, status, now(), now()
from target_rows t
where not exists (
  select 1
  from bookings b
  where b.user_id = t.user_id
    and b.parking_slot_id = t.parking_slot_id
    and b.start_time = t.start_time
);

commit;

select
  (select count(*) from parking_slots) as total_slots,
  (
    select count(*)
    from bookings
    where start_time::date = (now() at time zone 'Asia/Ho_Chi_Minh')::date
  ) as today_bookings,
  (
    select count(*)
    from bookings
    where start_time::date = ((now() at time zone 'Asia/Ho_Chi_Minh')::date - 1)
  ) as yesterday_bookings;
