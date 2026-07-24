begin;
select plan(11);

select has_table('public', 'profiles', 'profiles exists');
select policies_are(
  'public',
  'profiles',
  array[
    'Users can read their own profile',
    'Users can insert their own profile',
    'Users can update their own profile'
  ],
  'profiles only exposes select, insert and update policies'
);
select col_is_pk('public', 'profiles', 'id', 'id is the primary key');
select col_not_null('public', 'profiles', 'display_name', 'display_name is required');
select trigger_is(
  'public',
  'profiles',
  'profiles_set_updated_at',
  'public',
  'set_updated_at',
  'updated_at trigger exists'
);
select isnt_empty(
  $$select 1 from pg_trigger where tgname = 'on_auth_user_created'$$,
  'new auth users create a profile'
);

insert into auth.users (id, email, raw_user_meta_data)
values
  ('00000000-0000-0000-0000-000000000001', 'one@example.com', '{"display_name":"One"}'),
  ('00000000-0000-0000-0000-000000000002', 'two@example.com', '{"display_name":"Two"}');

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

select results_eq(
  $$select display_name from public.profiles order by id$$,
  array['One']::text[],
  'a user can only read their own profile'
);
select results_eq(
  $$update public.profiles set display_name = 'Updated' where id = '00000000-0000-0000-0000-000000000001' returning display_name$$,
  array['Updated']::text[],
  'a user can update their own profile'
);
select is_empty(
  $$update public.profiles set display_name = 'Forbidden' where id = '00000000-0000-0000-0000-000000000002' returning id$$,
  'a user cannot update another profile'
);
select throws_ok(
  $$delete from public.profiles where id = '00000000-0000-0000-0000-000000000001'$$,
  '42501',
  'permission denied for table profiles',
  'client roles have no permission to delete profiles'
);

reset role;
delete from auth.users
where id = '00000000-0000-0000-0000-000000000002';
select is_empty(
  $$select id from public.profiles where id = '00000000-0000-0000-0000-000000000002'$$,
  'deleting an auth user cascades to their profile'
);

select * from finish();
rollback;
