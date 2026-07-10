-- Run this once in Supabase SQL Editor.
-- It creates readable views for the anonymous diary research records.

create or replace function public.try_parse_jsonb(input_text text)
returns jsonb
language plpgsql
stable
as $$
begin
  return input_text::jsonb;
exception when others then
  return null;
end;
$$;

create or replace view public.research_records_flat as
with parsed as (
  select
    created_at,
    topic,
    title,
    body,
    privacy_warnings,
    status,
    public.try_parse_jsonb(body) as data
  from public.anonymous_stories
)
select
  created_at,
  topic,
  title,
  status,
  data->>'schema_version' as schema_version,
  coalesce(
    data->>'record_type',
    case
      when topic = '研究问卷' and data->>'survey_stage' = 'pre' then 'pre_survey'
      when topic = '研究问卷' and data->>'survey_stage' = 'post' then 'post_survey'
      when topic = '匿名日记记录' then 'ai_diary'
      when topic = '网站反馈' then 'site_feedback'
      else null
    end
  ) as record_type,
  data->>'session_id' as session_id,
  data->>'survey_stage' as survey_stage,
  data->>'survey_stage_label' as survey_stage_label,
  data->'answers' as answers,
  nullif(data->>'total_score', '')::numeric as total_score,
  data->'pre_answers' as pre_answers,
  data->'post_answers' as post_answers,
  data->'changes' as changes,
  nullif(data->>'pre_total_score', '')::numeric as pre_total_score,
  nullif(data->>'post_total_score', '')::numeric as post_total_score,
  nullif(data->>'total_change', '')::numeric as total_change,
  nullif(data->>'average_change', '')::numeric as average_change,
  data->>'diary_topic' as diary_topic,
  data->>'diary' as ai_diary,
  data->>'feedback_choice' as feedback_choice,
  data->>'felt_sentence' as felt_sentence,
  data->>'thought_change' as thought_change,
  coalesce(data->>'feedback_text', case when data is null then body else null end) as feedback_text,
  privacy_warnings,
  body as raw_body
from parsed;

create or replace view public.participant_summary as
with grouped as (
  select
    session_id,
    min(created_at) as first_record_at,
    max(created_at) as last_record_at,
    count(*) filter (where record_type = 'pre_survey') as pre_record_count,
    count(*) filter (where record_type = 'post_survey') as post_record_count,
    count(*) filter (where record_type = 'ai_diary') as ai_diary_count,
    count(*) filter (where record_type = 'site_feedback') as feedback_count,
    (jsonb_agg(answers order by created_at desc) filter (
      where record_type = 'pre_survey' and answers is not null
    ))->0 as saved_pre_answers,
    (jsonb_agg(answers order by created_at desc) filter (
      where record_type = 'post_survey' and answers is not null
    ))->0 as saved_post_answers,
    (jsonb_agg(pre_answers order by created_at desc) filter (
      where record_type = 'post_survey' and pre_answers is not null
    ))->0 as post_embedded_pre_answers,
    (jsonb_agg(post_answers order by created_at desc) filter (
      where record_type = 'post_survey' and post_answers is not null
    ))->0 as post_embedded_post_answers,
    (jsonb_agg(changes order by created_at desc) filter (
      where record_type = 'post_survey' and changes is not null
    ))->0 as changes,
    (array_agg(total_score order by created_at desc) filter (
      where record_type = 'pre_survey' and total_score is not null
    ))[1] as saved_pre_total_score,
    (array_agg(total_score order by created_at desc) filter (
      where record_type = 'post_survey' and total_score is not null
    ))[1] as saved_post_total_score,
    (array_agg(pre_total_score order by created_at desc) filter (
      where record_type = 'post_survey' and pre_total_score is not null
    ))[1] as post_embedded_pre_total_score,
    (array_agg(post_total_score order by created_at desc) filter (
      where record_type = 'post_survey' and post_total_score is not null
    ))[1] as post_embedded_post_total_score,
    (array_agg(total_change order by created_at desc) filter (
      where record_type = 'post_survey' and total_change is not null
    ))[1] as total_change,
    (array_agg(average_change order by created_at desc) filter (
      where record_type = 'post_survey' and average_change is not null
    ))[1] as average_change,
    (array_agg(diary_topic order by created_at desc) filter (
      where record_type = 'ai_diary' and diary_topic is not null
    ))[1] as diary_topic,
    (array_agg(ai_diary order by created_at desc) filter (
      where record_type = 'ai_diary' and ai_diary is not null
    ))[1] as ai_diary,
    (array_agg(feedback_choice order by created_at desc) filter (
      where record_type = 'site_feedback' and feedback_choice is not null
    ))[1] as feedback_choice,
    (array_agg(felt_sentence order by created_at desc) filter (
      where record_type = 'site_feedback' and felt_sentence is not null
    ))[1] as felt_sentence,
    (array_agg(thought_change order by created_at desc) filter (
      where record_type = 'site_feedback' and thought_change is not null
    ))[1] as thought_change,
    (array_agg(feedback_text order by created_at desc) filter (
      where record_type = 'site_feedback' and feedback_text is not null
    ))[1] as feedback_text
  from public.research_records_flat
  where session_id is not null
  group by session_id
),
normalized as (
  select
    session_id,
    first_record_at,
    last_record_at,
    pre_record_count,
    post_record_count,
    ai_diary_count,
    feedback_count,
    coalesce(saved_pre_answers, post_embedded_pre_answers) as pre_answers,
    coalesce(saved_post_answers, post_embedded_post_answers) as post_answers,
    changes,
    coalesce(saved_pre_total_score, post_embedded_pre_total_score) as pre_total_score,
    coalesce(saved_post_total_score, post_embedded_post_total_score) as post_total_score,
    total_change,
    average_change,
    diary_topic,
    ai_diary,
    feedback_choice,
    felt_sentence,
    thought_change,
    feedback_text
  from grouped
)
select
  session_id,
  first_record_at,
  last_record_at,
  pre_record_count,
  post_record_count,
  ai_diary_count,
  feedback_count,
  (pre_answers is not null and post_answers is not null and ai_diary is not null) as has_core_complete_data,
  (pre_answers is not null and post_answers is not null and ai_diary is not null and feedback_text is not null) as has_full_complete_data,
  pre_answers,
  nullif(pre_answers->>0, '')::int as pre_q1_understood,
  nullif(pre_answers->>1, '')::int as pre_q2_less_lonely,
  nullif(pre_answers->>2, '')::int as pre_q3_self_acceptance,
  nullif(pre_answers->>3, '')::int as pre_q4_safer_next_step,
  nullif(pre_answers->>4, '')::int as pre_q5_patience,
  pre_total_score,
  post_answers,
  nullif(post_answers->>0, '')::int as post_q1_understood,
  nullif(post_answers->>1, '')::int as post_q2_less_lonely,
  nullif(post_answers->>2, '')::int as post_q3_self_acceptance,
  nullif(post_answers->>3, '')::int as post_q4_safer_next_step,
  nullif(post_answers->>4, '')::int as post_q5_patience,
  post_total_score,
  changes,
  total_change,
  average_change,
  diary_topic,
  ai_diary,
  feedback_choice,
  felt_sentence,
  thought_change,
  feedback_text
from normalized
order by last_record_at desc;
