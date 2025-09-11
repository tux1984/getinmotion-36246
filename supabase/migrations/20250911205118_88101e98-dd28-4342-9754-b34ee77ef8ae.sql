-- Create the missing RPC function for maturity scores
CREATE OR REPLACE FUNCTION public.get_latest_maturity_scores(user_uuid uuid)
RETURNS TABLE(
  idea_validation integer, 
  user_experience integer, 
  market_fit integer, 
  monetization integer, 
  created_at timestamp with time zone, 
  profile_data jsonb
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT 
    ums.idea_validation,
    ums.user_experience,
    ums.market_fit,
    ums.monetization,
    ums.created_at,
    ums.profile_data
  FROM public.user_maturity_scores ums
  WHERE ums.user_id = user_uuid
  ORDER BY ums.created_at DESC
  LIMIT 1;
$function$;