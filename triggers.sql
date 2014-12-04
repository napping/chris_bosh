create sequence media_id_seq
start with 10000
increment by 1
nomaxvalue;

create trigger media_trigger
before insert on Media
for each row
    begin
    select media_id_seq.nextval into :new.id from dual;
    end;
