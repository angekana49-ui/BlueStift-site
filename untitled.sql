create view public.valid_insights as
select
  i.id,
  i.class_year_id,
  i.school_id,
  i.subject,
  i.chapter,
  i.difficulty_level,
  i.mastery_score,
  i.critical_gap,
  i.concepts_acquired,
  i.recommended_action,
  i.student_effort_level,
  i.sample_size,
  i.period,
  i.created_at,
  s.name as school_name,
  c.name as class_name,
  sy.label as school_year
from
  insights i
  join class_years cy on cy.id = i.class_year_id
  join classes c on c.id = cy.class_id
  join schools s on s.id = i.school_id
  join school_years sy on sy.id = cy.school_year_id
where
  i.sample_size >= 5
order by
  i.created_at desc;


create view public.user_stats as
select
  u.id,
  u.email,
  u.username,
  u.full_name,
  u.role,
  u.account_type,
  s.name as school_name,
  c.name as class_name,
  u.total_lessons_completed,
  u.current_streak_days,
  u.longest_streak_days,
  count(distinct conv.id) as total_conversations,
  count(distinct m.id) as total_messages,
  sum(m.tokens_used) as total_tokens_used,
  u.last_activity_at,
  case
    when u.premium_until > now() then 'Active Premium'::text
    when u.account_type = 'free'::account_type then 'Free'::text
    else 'Expired'::text
  end as subscription_status
from
  users u
  left join schools s on s.id = u.school_id
  left join class_years cy on cy.id = u.class_year_id
  left join classes c on c.id = cy.class_id
  left join conversations conv on conv.user_id = u.id
  left join messages m on m.conversation_id = conv.id
where
  u.role = 'student'::user_role
group by
  u.id,
  u.email,
  u.username,
  u.full_name,
  u.role,
  u.account_type,
  s.name,
  c.name,
  u.total_lessons_completed,
  u.current_streak_days,
  u.longest_streak_days,
  u.last_activity_at,
  u.premium_until;

create view public.school_subject_overview as
select
  school_id,
  subject,
  round(avg(mastery_score), 2) as avg_pkm,
  array_agg(distinct critical_gap) filter (
    where
      critical_gap is not null
  ) as all_difficulties,
  array_agg(distinct concepts_acquired) filter (
    where
      concepts_acquired is not null
  ) as all_concepts_acquired,
  array_agg(distinct recommended_action) filter (
    where
      recommended_action is not null
  ) as all_recommendations,
  mode() within group (
    order by
      student_effort_level
  ) as dominant_effort,
  sum(sample_size) as total_sample_size,
  count(*) as insight_count,
  class_year_id
from
  insights i
where
  sample_size >= 5
group by
  school_id,
  subject,
  class_year_id;

create view public.school_plan_pricing as
select
  s.id as school_id,
  sp.id as plan_id,
  sp.name as plan_name,
  sp.description,
  sp.features,
  sp.is_active,
  sp.tier,
  pz.id as zone_id,
  pz.name as zone_name,
  COALESCE(pzp.price, sp.price) as price,
  round(COALESCE(pzp.price, sp.price) * 12::numeric * 0.9) as yearly_price,
  round(
    COALESCE(pzp.price, sp.price) / 1000::numeric * 0.70,
    2
  ) as extra_student_price,
  COALESCE(pzp.currency, pz.currency, 'USD'::text) as currency
from
  schools s
  left join zone_countries zc on zc.country_code = s.country_code
  left join pricing_zones pz on pz.id = zc.zone_id
  cross join subscription_plans sp
  left join plan_zone_prices pzp on pzp.plan_id = sp.id
  and pzp.zone_id = pz.id
where
  sp.is_active = true
  and sp.category = 'school_b2b'::text
order by
  s.id,
  (
    case sp.tier
      when 'standard'::text then 1
      when 'pro'::text then 2
      when 'custom'::text then 3
      else 9
    end
  );

create view public.school_global_overview as
select
  id as school_id,
  name as school_name,
  subscription_tier,
  COALESCE(
    (
      select
        count(*) as count
      from
        users u
      where
        u.school_id = s.id
        and u.role = 'student'::user_role
    ),
    0::bigint
  ) as total_students,
  COALESCE(
    (
      select
        round(avg(i.mastery_score), 2) as round
      from
        insights i
      where
        i.school_id = s.id
        and i.sample_size >= 5
    ),
    0::numeric
  ) as avg_pkm,
  COALESCE(
    (
      select
        round(avg(u.current_streak_days), 0) as round
      from
        users u
      where
        u.school_id = s.id
        and u.role = 'student'::user_role
    ),
    0::numeric
  ) as avg_streak,
  COALESCE(
    (
      select
        sum(u.total_lessons_completed) as sum
      from
        users u
      where
        u.school_id = s.id
        and u.role = 'student'::user_role
    ),
    0::bigint
  ) as total_lessons_completed,
  COALESCE(
    (
      select
        count(distinct i.subject) as count
      from
        insights i
      where
        i.school_id = s.id
        and i.sample_size >= 5
    ),
    0::bigint
  ) as subjects_covered,
  COALESCE(
    (
      select
        count(*) as count
      from
        class_years cy
      where
        cy.school_id = s.id
        and cy.school_year_id = s.current_school_year_id
    ),
    0::bigint
  ) as total_classes_current_year
from
  schools s;

create view public.school_dashboard_stats as
select
  s.id as school_id,
  s.name as school_name,
  s.city,
  zc.country_name as country,
  s.country_code,
  s.subscription_tier,
  sy.label as current_school_year,
  count(distinct cy.id) as active_class_years,
  count(distinct cy.class_id) as total_classes,
  count(distinct u.id) as registered_students,
  count(
    distinct case
      when cy.is_full then cy.id
      else null::uuid
    end
  ) as full_classes,
  count(distinct c2.id) as total_conversations,
  round(avg(i.mastery_score), 2) as avg_mastery_score,
  count(distinct i.subject) as subjects_covered,
  (
    select
      json_agg(
        json_build_object(
          'subject',
          subq.subject,
          'count',
          subq.cnt,
          'avg_score',
          subq.avg_score
        )
      ) as json_agg
    from
      (
        select
          i2.subject,
          count(*) as cnt,
          round(avg(i2.mastery_score), 2) as avg_score
        from
          insights i2
        where
          i2.school_id = s.id
        group by
          i2.subject
        order by
          (count(*)) desc
        limit
          5
      ) subq
  ) as top_subjects
from
  schools s
  left join zone_countries zc on zc.country_code = s.country_code
  left join school_years sy on sy.id = s.current_school_year_id
  left join class_years cy on cy.school_id = s.id
  and cy.school_year_id = s.current_school_year_id
  left join users u on u.school_id = s.id
  and u.role = 'student'::user_role
  left join conversations c2 on c2.user_id = u.id
  left join insights i on i.school_id = s.id
group by
  s.id,
  s.name,
  s.city,
  zc.country_name,
  s.country_code,
  s.subscription_tier,
  sy.label;

create view public.paid_adjustments_report as
select
  s.name as school_name,
  c.name as class_name,
  sy.label as school_year,
  ca.quarter,
  ca.old_size,
  ca.new_size,
  ca.difference,
  ca.amount_charged,
  ca.payment_status,
  ca.payment_reference,
  ca.created_at,
  ca.updated_at
from
  class_adjustments ca
  join class_years cy on cy.id = ca.class_year_id
  join classes c on c.id = cy.class_id
  join schools s on s.id = ca.school_id
  join school_years sy on sy.id = ca.school_year_id
where
  ca.adjustment_type = 'paid'::adjustment_type
order by
  ca.created_at desc;

create view public.full_classes_report as
select
  s.name as school_name,
  s.city,
  c.class_number,
  c.name as class_name,
  cy.promo_code,
  cy.initial_size,
  cy.expected_size,
  cy.student_count,
  cy.max_overflow,
  cy.is_full,
  cy.expected_size + cy.max_overflow - cy.student_count as spots_left,
  round(
    cy.student_count::numeric / NULLIF(cy.expected_size, 0)::numeric * 100::numeric,
    1
  ) as fill_percentage,
  cy.adjustments_count,
  cy.total_adjustments_paid,
  sy.label as school_year
from
  class_years cy
  join classes c on c.id = cy.class_id
  join schools s on s.id = c.school_id
  join school_years sy on sy.id = cy.school_year_id
where
  cy.is_active = true
order by
  cy.is_full desc,
  (
    cy.expected_size + cy.max_overflow - cy.student_count
  );

  create table public.zone_countries (
  country_code text not null,
  country_name text not null,
  zone_id text not null,
  constraint zone_countries_pkey primary key (country_code),
  constraint zone_countries_zone_id_fkey foreign KEY (zone_id) references pricing_zones (id)
) TABLESPACE pg_default;

create table public.waitlist (
  id uuid not null default gen_random_uuid (),
  email text not null,
  full_name text not null,
  position integer null,
  status public.waitlist_status null default 'pending'::waitlist_status,
  signup_source text null default 'web'::text,
  referral_code text null,
  joined_at timestamp with time zone null default now(),
  verified_at timestamp with time zone null,
  profile_type text null,
  is_early_bird boolean GENERATED ALWAYS as (
    (
      ("position" is not null)
      and ("position" <= 500)
    )
  ) STORED null,
  auth_user_id uuid null,
  constraint waitlist_pkey primary key (id),
  constraint waitlist_email_key unique (email),
  constraint waitlist_position_key unique ("position"),
  constraint waitlist_auth_user_id_fkey foreign KEY (auth_user_id) references auth.users (id),
  constraint waitlist_email_check check (
    (
      email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text
    )
  ),
  constraint waitlist_profile_type_check check (
    (
      (profile_type is null)
      or (
        profile_type = any (
          array[
            'student'::text,
            'university_student'::text,
            'parent'::text,
            'teacher'::text,
            'self_learner'::text,
            'professional'::text,
            'other'::text
          ]
        )
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_waitlist_position on public.waitlist using btree ("position") TABLESPACE pg_default;

create index IF not exists idx_waitlist_status on public.waitlist using btree (status) TABLESPACE pg_default;

create trigger set_waitlist_position_trigger BEFORE INSERT on waitlist for EACH row
execute FUNCTION set_waitlist_position ();

create trigger trigger_waitlist_position BEFORE INSERT on waitlist for EACH row
execute FUNCTION set_waitlist_position ();

create table public.users (
  id uuid not null default gen_random_uuid (),
  auth_user_id uuid not null,
  email text not null,
  username text null,
  full_name text null,
  profile_picture_url text null,
  role public.user_role null default 'student'::user_role,
  account_type public.account_type null default 'free'::account_type,
  school_id uuid null,
  class_year_id uuid null,
  premium_until timestamp with time zone null,
  is_founder boolean null default false,
  total_lessons_completed integer null default 0,
  current_streak_days integer null default 0,
  longest_streak_days integer null default 0,
  last_activity_at timestamp with time zone null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint users_pkey primary key (id),
  constraint users_auth_user_id_key unique (auth_user_id),
  constraint users_email_key unique (email),
  constraint users_username_key unique (username),
  constraint users_class_year_id_fkey foreign KEY (class_year_id) references class_years (id) on delete set null,
  constraint users_school_id_fkey foreign KEY (school_id) references schools (id) on delete set null,
  constraint users_auth_user_id_fkey foreign KEY (auth_user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_users_auth on public.users using btree (auth_user_id) TABLESPACE pg_default;

create index IF not exists idx_users_school on public.users using btree (school_id) TABLESPACE pg_default;

create index IF not exists idx_users_class_year on public.users using btree (class_year_id) TABLESPACE pg_default;

create index IF not exists idx_users_role on public.users using btree (role) TABLESPACE pg_default;

create trigger trigger_users_timestamp BEFORE
update on users for EACH row
execute FUNCTION update_timestamp ();

create table public.usage_metrics (
  id uuid not null default gen_random_uuid (),
  school_id uuid not null,
  period text not null,
  metric text not null,
  value numeric not null default 0,
  updated_at timestamp with time zone not null default now(),
  constraint usage_metrics_pkey primary key (id),
  constraint usage_metrics_school_id_period_metric_key unique (school_id, period, metric),
  constraint usage_metrics_unique unique (school_id, period, metric),
  constraint usage_metrics_school_id_fkey foreign KEY (school_id) references schools (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.subscriptions (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  school_id uuid null,
  plan_id text not null,
  status public.subscription_status null default 'active'::subscription_status,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone null,
  auto_renew boolean null default true,
  payment_method text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint subscriptions_pkey primary key (id),
  constraint subscriptions_plan_id_fkey foreign KEY (plan_id) references subscription_plans (id),
  constraint subscriptions_school_id_fkey foreign KEY (school_id) references schools (id) on delete CASCADE,
  constraint subscriptions_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE,
  constraint subscriptions_dates_check check (
    (
      (end_date is null)
      or (end_date > start_date)
    )
  ),
  constraint subscriptions_owner_check check (
    (
      (user_id is not null)
      or (school_id is not null)
    )
  ),
  constraint subscriptions_check check (
    (
      (
        (user_id is not null)
        and (school_id is null)
      )
      or (
        (user_id is null)
        and (school_id is not null)
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_subscriptions_user on public.subscriptions using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_subscriptions_school on public.subscriptions using btree (school_id) TABLESPACE pg_default;

create index IF not exists idx_subscriptions_status on public.subscriptions using btree (status) TABLESPACE pg_default;

create trigger sync_school_subscription_trigger
after INSERT
or DELETE
or
update on subscriptions for EACH row
execute FUNCTION sync_school_subscription ();

create trigger trigger_subscriptions_timestamp BEFORE
update on subscriptions for EACH row
execute FUNCTION update_timestamp ();

create table public.subscription_plans (
  id text not null,
  name text not null,
  description text not null,
  category text not null,
  price numeric(10, 2) null,
  billing_period public.billing_period not null,
  features jsonb not null default '[]'::jsonb,
  message_limit integer null,
  credits_per_period integer null,
  storage_gb integer null,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  tier text null,
  constraint subscription_plans_pkey primary key (id),
  constraint subscription_plans_credits_check check (
    (
      (credits_per_period is null)
      or (credits_per_period >= 0)
    )
  ),
  constraint subscription_plans_message_limit_check check (
    (
      (message_limit is null)
      or (message_limit > 0)
    )
  ),
  constraint subscription_plans_price_check check (
    (
      (price is null)
      or (price >= (0)::numeric)
    )
  ),
  constraint subscription_plans_storage_check check (
    (
      (storage_gb is null)
      or (storage_gb > 0)
    )
  ),
  constraint subscription_plans_tier_check check (
    (
      tier = any (
        array['standard'::text, 'pro'::text, 'custom'::text]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_subscription_plans_category on public.subscription_plans using btree (category) TABLESPACE pg_default;

create index IF not exists idx_subscription_plans_active on public.subscription_plans using btree (is_active) TABLESPACE pg_default
where
  (is_active = true);

create table public.schools (
  id uuid not null default gen_random_uuid (),
  name text not null,
  city text null,
  email text null,
  phone text null,
  admin_key text not null,
  subscription_tier public.subscription_tier null default 'none'::subscription_tier,
  subscription_expires_at timestamp with time zone null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  school_type text null default 'secondary'::text,
  country_code text null,
  pilot_until date null,
  current_school_year_id uuid null,
  constraint schools_pkey primary key (id),
  constraint schools_admin_key_key unique (admin_key),
  constraint schools_country_code_fkey foreign KEY (country_code) references zone_countries (country_code),
  constraint schools_current_school_year_id_fkey foreign KEY (current_school_year_id) references school_years (id),
  constraint schools_school_type_check check (
    (
      school_type = any (
        array[
          'primary'::text,
          'secondary'::text,
          'university'::text,
          'vocational'::text,
          'other'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_schools_admin_key on public.schools using btree (admin_key) TABLESPACE pg_default;

create index IF not exists idx_schools_subscription on public.schools using btree (subscription_tier) TABLESPACE pg_default;

create trigger "New-school-Notification"
after INSERT on schools for EACH row
execute FUNCTION supabase_functions.http_request (
  'https://hook.eu1.make.com/[ton-webhook-id]',
  'POST',
  '{"Content-type":"application/json"}',
  '{}',
  '5000'
);

create trigger trigger_schools_timestamp BEFORE
update on schools for EACH row
execute FUNCTION update_timestamp ();

create table public.school_years (
  id uuid not null default gen_random_uuid (),
  label text not null,
  start_date date not null,
  end_date date not null,
  is_current boolean null default false,
  created_at timestamp with time zone null default now(),
  constraint school_years_pkey primary key (id),
  constraint school_years_label_key unique (label),
  constraint school_years_dates_check check ((end_date > start_date))
) TABLESPACE pg_default;

create unique INDEX IF not exists idx_school_years_current on public.school_years using btree (is_current) TABLESPACE pg_default
where
  (is_current = true);

create table public.push_subscriptions (
  id uuid not null default gen_random_uuid (),
  school_id uuid null,
  user_id uuid null,
  endpoint text not null,
  keys jsonb not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint push_subscriptions_pkey primary key (id),
  constraint push_subscriptions_endpoint_key unique (endpoint),
  constraint push_subscriptions_school_id_fkey foreign KEY (school_id) references schools (id) on delete CASCADE,
  constraint push_subscriptions_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.promo_codes (
  id uuid not null default gen_random_uuid (),
  code text not null,
  description text not null,
  discount_type public.discount_type not null,
  discount_value numeric(10, 2) not null,
  bonus_duration_days integer null,
  max_uses integer null,
  current_uses integer null default 0,
  valid_from timestamp with time zone not null,
  valid_until timestamp with time zone null,
  applicable_plans jsonb null,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  bonus_features jsonb null default '[]'::jsonb,
  constraint promo_codes_pkey primary key (id),
  constraint promo_codes_code_key unique (code),
  constraint promo_codes_dates_check check (
    (
      (valid_until is null)
      or (valid_until > valid_from)
    )
  ),
  constraint promo_codes_discount_value_check check ((discount_value >= (0)::numeric)),
  constraint promo_codes_max_uses_check check (
    (
      (max_uses is null)
      or (max_uses > 0)
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_promo_codes_code on public.promo_codes using btree (code) TABLESPACE pg_default;

create index IF not exists idx_promo_codes_active on public.promo_codes using btree (is_active) TABLESPACE pg_default
where
  (is_active = true);

create table public.pricing_zones (
  id text not null,
  name text not null,
  currency text not null default 'USD'::text,
  created_at timestamp with time zone null default now(),
  constraint pricing_zones_pkey primary key (id)
) TABLESPACE pg_default;

create table public.plan_zone_prices (
  id serial not null,
  plan_id text not null,
  zone_id text not null,
  price numeric(12, 2) not null,
  currency text not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint plan_zone_prices_pkey primary key (id),
  constraint plan_zone_prices_plan_id_zone_id_key unique (plan_id, zone_id),
  constraint plan_zone_prices_plan_id_fkey foreign KEY (plan_id) references subscription_plans (id) on delete CASCADE,
  constraint plan_zone_prices_zone_id_fkey foreign KEY (zone_id) references pricing_zones (id),
  constraint plan_zone_prices_price_check check ((price >= (0)::numeric))
) TABLESPACE pg_default;

create table public.messages (
  id uuid not null default gen_random_uuid (),
  conversation_id uuid not null,
  sender public.message_sender not null,
  text text not null,
  timestamp timestamp with time zone null default now(),
  has_files boolean null default false,
  model_used text null,
  mode_used text null,
  tokens_used integer null,
  constraint messages_pkey primary key (id),
  constraint messages_conversation_id_fkey foreign KEY (conversation_id) references conversations (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_messages_conversation on public.messages using btree (conversation_id) TABLESPACE pg_default;

create index IF not exists idx_messages_timestamp on public.messages using btree ("timestamp") TABLESPACE pg_default;

create table public.insights (
  id uuid not null default gen_random_uuid (),
  class_year_id uuid not null,
  school_id uuid not null,
  subject text not null,
  chapter text null,
  difficulty_level text null,
  mastery_score numeric(4, 2) null,
  critical_gap text null,
  concepts_acquired text[] null,
  recommended_action text null,
  student_effort_level text null,
  sample_size integer null default 1,
  period text null default 'daily'::text,
  created_at timestamp with time zone null default now(),
  constraint insights_pkey primary key (id),
  constraint insights_class_year_id_fkey foreign KEY (class_year_id) references class_years (id) on delete CASCADE,
  constraint insights_school_id_fkey foreign KEY (school_id) references schools (id) on delete CASCADE,
  constraint insights_mastery_score_check check (
    (
      (mastery_score >= (0)::numeric)
      and (mastery_score <= (1)::numeric)
    )
  ),
  constraint insights_period_check check (
    (
      period = any (
        array['daily'::text, 'weekly'::text, 'monthly'::text]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_insights_class_year on public.insights using btree (class_year_id) TABLESPACE pg_default;

create index IF not exists idx_insights_school on public.insights using btree (school_id) TABLESPACE pg_default;

create index IF not exists idx_insights_subject on public.insights using btree (subject) TABLESPACE pg_default;

create index IF not exists idx_insights_sample_size on public.insights using btree (sample_size) TABLESPACE pg_default;

create table public.feedbacks (
  id uuid not null default gen_random_uuid (),
  email text null,
  name text null,
  rating integer null,
  type public.feedback_type null default 'other'::feedback_type,
  message text not null,
  page_url text null,
  submitted_at timestamp with time zone null default now(),
  constraint feedbacks_pkey primary key (id),
  constraint feedbacks_rating_check check (
    (
      (rating >= 1)
      and (rating <= 5)
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_feedbacks_type on public.feedbacks using btree (type) TABLESPACE pg_default;

create index IF not exists idx_feedbacks_rating on public.feedbacks using btree (rating) TABLESPACE pg_default;

create table public.conversations (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  class_year_id uuid null,
  title text not null,
  preview text null,
  context_type text null default 'general'::text,
  is_active boolean null default false,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint conversations_pkey primary key (id),
  constraint conversations_class_year_id_fkey foreign KEY (class_year_id) references class_years (id) on delete set null,
  constraint conversations_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_conversations_user on public.conversations using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_conversations_class_year on public.conversations using btree (class_year_id) TABLESPACE pg_default;

create index IF not exists idx_conversations_active on public.conversations using btree (is_active) TABLESPACE pg_default
where
  (is_active = true);

create trigger trigger_conversations_timestamp BEFORE
update on conversations for EACH row
execute FUNCTION update_timestamp ();

create table public.contributions (
  id uuid not null default gen_random_uuid (),
  email text not null,
  contributor_name text not null,
  category text not null,
  title text not null,
  description text null,
  file_count integer null default 0,
  status public.contribution_status null default 'pending'::contribution_status,
  rejection_reason text null,
  reviewed_by uuid null,
  submitted_at timestamp with time zone null default now(),
  reviewed_at timestamp with time zone null,
  school_id uuid null,
  storage_path text null,
  constraint contributions_pkey primary key (id),
  constraint contributions_reviewed_by_fkey foreign KEY (reviewed_by) references users (id) on delete set null,
  constraint contributions_school_id_fkey foreign KEY (school_id) references schools (id) on delete set null
) TABLESPACE pg_default;

create index IF not exists idx_contributions_status on public.contributions using btree (status) TABLESPACE pg_default;

create index IF not exists idx_contributions_category on public.contributions using btree (category) TABLESPACE pg_default;

create table public.contact_messages (
  id uuid not null default gen_random_uuid (),
  name text not null,
  email text not null,
  phone text null,
  subject text not null,
  message text not null,
  source public.contact_source null default 'form'::contact_source,
  is_read boolean null default false,
  replied boolean null default false,
  created_at timestamp with time zone null default now(),
  school_id uuid null,
  constraint contact_messages_pkey primary key (id),
  constraint contact_messages_school_id_fkey foreign KEY (school_id) references schools (id) on delete set null
) TABLESPACE pg_default;

create index IF not exists idx_contact_messages_read on public.contact_messages using btree (is_read) TABLESPACE pg_default;

create table public.classes (
  id uuid not null default gen_random_uuid (),
  school_id uuid not null,
  name text not null,
  expected_size integer null default 30,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  class_number integer generated always as identity not null,
  constraint classes_pkey primary key (id),
  constraint classes_class_number_unique unique (class_number),
  constraint classes_school_id_name_key unique (school_id, name),
  constraint classes_school_name_unique unique (school_id, name),
  constraint classes_school_id_fkey foreign KEY (school_id) references schools (id) on delete CASCADE,
  constraint classes_expected_size_check check ((expected_size > 0))
) TABLESPACE pg_default;

create index IF not exists idx_classes_school on public.classes using btree (school_id) TABLESPACE pg_default;

create trigger trigger_classes_timestamp BEFORE
update on classes for EACH row
execute FUNCTION update_timestamp ();

create table public.class_years (
  id uuid not null default gen_random_uuid (),
  class_id uuid not null,
  school_year_id uuid not null,
  school_id uuid not null,
  promo_code text not null,
  initial_size integer not null,
  expected_size integer not null,
  student_count integer null default 0,
  max_overflow integer null default 5,
  adjustments_count integer null default 0,
  last_adjustment_date date null,
  total_adjustments_paid numeric(10, 2) null default 0,
  is_active boolean null default true,
  bonus_config jsonb null default '{}'::jsonb,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  is_full boolean GENERATED ALWAYS as ((student_count >= (expected_size + max_overflow))) STORED null,
  constraint class_years_pkey primary key (id),
  constraint class_years_class_id_school_year_id_key unique (class_id, school_year_id),
  constraint class_years_promo_code_key unique (promo_code),
  constraint class_years_class_year_unique unique (class_id, school_year_id),
  constraint class_years_class_id_fkey foreign KEY (class_id) references classes (id) on delete CASCADE,
  constraint class_years_promo_code_fkey foreign KEY (promo_code) references promo_codes (code) on update CASCADE,
  constraint class_years_school_id_fkey foreign KEY (school_id) references schools (id) on delete CASCADE,
  constraint class_years_school_year_id_fkey foreign KEY (school_year_id) references school_years (id) on delete CASCADE,
  constraint class_years_sizes_check check (
    (
      (initial_size > 0)
      and (expected_size > 0)
      and (max_overflow >= 0)
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_class_years_promo_code on public.class_years using btree (promo_code) TABLESPACE pg_default;

create index IF not exists idx_class_years_school on public.class_years using btree (school_id) TABLESPACE pg_default;

create index IF not exists idx_class_years_active on public.class_years using btree (is_active) TABLESPACE pg_default
where
  (is_active = true);

create trigger class_year_school_check BEFORE INSERT
or
update on class_years for EACH row
execute FUNCTION check_class_year_school ();

create trigger create_class_promo_code_trigger BEFORE INSERT on class_years for EACH row
execute FUNCTION create_class_promo_code ();

create trigger trigger_class_years_full_status BEFORE
update OF student_count,
expected_size,
max_overflow on class_years for EACH row
execute FUNCTION update_class_full_status ();

create trigger trigger_class_years_timestamp BEFORE
update on class_years for EACH row
execute FUNCTION update_timestamp ();

create table public.class_adjustments (
  id uuid not null default gen_random_uuid (),
  class_year_id uuid not null,
  school_id uuid not null,
  old_size integer not null,
  new_size integer not null,
  difference integer not null,
  adjustment_type public.adjustment_type not null,
  amount_charged numeric(10, 2) null default 0,
  payment_status public.payment_status null default 'pending'::payment_status,
  payment_reference text null,
  quarter integer null,
  requested_by uuid null,
  notes text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  school_year_id uuid null,
  constraint class_adjustments_pkey primary key (id),
  constraint class_adjustments_class_year_id_fkey foreign KEY (class_year_id) references class_years (id) on delete CASCADE,
  constraint class_adjustments_requested_by_fkey foreign KEY (requested_by) references users (id) on delete set null,
  constraint class_adjustments_school_id_fkey foreign KEY (school_id) references schools (id) on delete CASCADE,
  constraint class_adjustments_school_year_id_fkey foreign KEY (school_year_id) references school_years (id) on delete set null,
  constraint class_adjustments_quarter_check check (
    (
      (quarter >= 1)
      and (quarter <= 4)
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_class_adjustments_class_year on public.class_adjustments using btree (class_year_id) TABLESPACE pg_default;

create index IF not exists idx_class_adjustments_school on public.class_adjustments using btree (school_id) TABLESPACE pg_default;

create index IF not exists idx_class_adjustments_payment on public.class_adjustments using btree (payment_status) TABLESPACE pg_default;

create table public.attached_files (
  id uuid not null default gen_random_uuid (),
  message_id uuid not null,
  file_name text not null,
  file_type public.file_type not null,
  file_url text not null,
  file_size integer not null,
  mime_type text not null,
  uploaded_at timestamp with time zone null default now(),
  constraint attached_files_pkey primary key (id),
  constraint attached_files_message_id_fkey foreign KEY (message_id) references messages (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_attached_files_message on public.attached_files using btree (message_id) TABLESPACE pg_default;

create trigger trigger_message_files_flag
after INSERT on attached_files for EACH row
execute FUNCTION update_message_files_flag ();