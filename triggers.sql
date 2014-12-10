create sequence media_id_seq
start with 10000
increment by 1
nomaxvalue;

create trigger media_trigger
before insert on Media
for each row
    begin
    select media_id_seq.nextval into :new.mid from dual;
    end;
/

create sequence album_id_seq
start with 10000
increment by 1
nomaxvalue;

create trigger album_trigger
before insert on Album
for each row
    begin
    select album_id_seq.nextval into :new.aid from dual;
    end;
/
