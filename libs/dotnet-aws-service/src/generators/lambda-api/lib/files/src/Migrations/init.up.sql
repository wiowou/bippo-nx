create table hotels (
  id        serial primary key,
  name      varchar(40) not null,
	address   varchar(40) default null,
	rating    double precision default null,
  cost      decimal(15,2) not null,
  established date not null,
  next_report_date timestamp with time zone not null default current_timestamp,
  created_on timestamp with time zone not null default current_timestamp,
  updated_on timestamp with time zone not null default current_timestamp,
  updated_by bigint default 1
);
create unique index idx_hotels__updated_by on hotels(updated_by);