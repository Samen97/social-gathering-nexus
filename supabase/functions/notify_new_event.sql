CREATE OR REPLACE FUNCTION public.notify_new_event()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Add debug logging
    RAISE LOG 'notify_new_event triggered: is_official=%, approval_status=%', NEW.is_official, NEW.approval_status;
    
    IF NEW.is_official THEN
        -- Notify all users about official events
        INSERT INTO public.notifications (user_id, type, title, content, reference_id)
        SELECT 
            p.id,
            'new_official_event',
            'New Official Event',
            'A new official event has been scheduled: ' || NEW.title,
            NEW.id
        FROM public.profiles p
        WHERE p.id != NEW.created_by;
        
        RAISE LOG 'Notifications created for official event: %', NEW.title;
    ELSIF NEW.approval_status = 'approved' THEN
        -- Notify about approved community events
        INSERT INTO public.notifications (user_id, type, title, content, reference_id)
        SELECT 
            p.id,
            'new_community_event',
            'New Community Event',
            'A new community event has been approved: ' || NEW.title,
            NEW.id
        FROM public.profiles p
        WHERE p.id != NEW.created_by;
        
        RAISE LOG 'Notifications created for approved community event: %', NEW.title;
    END IF;
    
    RETURN NEW;
END;
$function$;

-- Make sure the trigger is properly set up
DROP TRIGGER IF EXISTS on_event_created_or_approved ON public.events;
CREATE TRIGGER on_event_created_or_approved
    AFTER INSERT OR UPDATE OF approval_status, is_official
    ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_event();