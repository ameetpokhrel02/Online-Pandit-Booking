create table students (
    id serial primary key,
    name varchar(100) not null,
    age int not null,
    enrollment_date date not null
);