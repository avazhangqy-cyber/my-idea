-- Run this after creating public.participant_summary.
-- This clean view is for daily reading in Supabase Table Editor.

create or replace view public.participant_summary_clean as
select
  last_record_at as "最近提交时间",
  left(session_id, 8) as "匿名编号",
  has_core_complete_data as "核心数据完整",
  has_full_complete_data as "全部数据完整",
  pre_answers as "前测答案",
  pre_total_score as "前测总分",
  post_answers as "后测答案",
  post_total_score as "后测总分",
  case
    when pre_answers is not null and post_answers is not null then jsonb_build_array(
      nullif(post_answers->>0, '')::int - nullif(pre_answers->>0, '')::int,
      nullif(post_answers->>1, '')::int - nullif(pre_answers->>1, '')::int,
      nullif(post_answers->>2, '')::int - nullif(pre_answers->>2, '')::int,
      nullif(post_answers->>3, '')::int - nullif(pre_answers->>3, '')::int,
      nullif(post_answers->>4, '')::int - nullif(pre_answers->>4, '')::int
    )
    else changes
  end as "每题变化",
  case
    when pre_total_score is not null and post_total_score is not null then post_total_score - pre_total_score
    else total_change
  end as "总分变化",
  case
    when pre_total_score is not null and post_total_score is not null then round((post_total_score - pre_total_score) / 5.0, 2)
    else average_change
  end as "平均变化",
  diary_topic as "日记方向",
  ai_diary as "AI匿名日记",
  feedback_choice as "快捷反馈",
  felt_sentence as "有感觉的句子",
  thought_change as "读完后的想法",
  feedback_text as "反馈全文"
from public.participant_summary
order by last_record_at desc;
