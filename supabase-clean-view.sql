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
  changes as "每题变化",
  total_change as "总分变化",
  average_change as "平均变化",
  diary_topic as "日记方向",
  ai_diary as "AI匿名日记",
  feedback_choice as "快捷反馈",
  felt_sentence as "有感觉的句子",
  thought_change as "读完后的想法",
  feedback_text as "反馈全文"
from public.participant_summary
order by last_record_at desc;
