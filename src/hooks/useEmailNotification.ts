import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type NotificationType =
  | "assessment_completed"
  | "shortlisted"
  | "not_selected"
  | "payment_confirmed"
  | "internship_enrolled";

interface EmailPayload {
  recipientEmail: string;
  recipientName: string;
  type: NotificationType;
  metadata?: Record<string, string>;
}

/**
 * Hook for triggering email notifications at key assessment milestones.
 * 
 * Currently uses toast notifications as the primary feedback mechanism.
 * The hook is designed to be extensible — when a Supabase Edge Function
 * for email sending is configured (e.g., via Resend or SendGrid),
 * the `triggerEmail` function can invoke it.
 * 
 * Usage:
 *   const { triggerNotification } = useEmailNotification();
 *   await triggerNotification({ recipientEmail, recipientName, type: "shortlisted" });
 */
export const useEmailNotification = () => {
  const { toast } = useToast();

  const getNotificationContent = (type: NotificationType, name: string) => {
    switch (type) {
      case "assessment_completed":
        return {
          title: "Assessment Completed!",
          message: `Great job, ${name}! Your assessment has been submitted successfully. Our team will review your results within 48 hours. You'll receive an email notification once your results are ready.`,
          variant: "default" as const,
        };
      case "shortlisted":
        return {
          title: "🎉 Congratulations! You're Shortlisted!",
          message: `Amazing news, ${name}! You have been shortlisted based on your assessment performance. Our recruitment team will contact you within 48 hours with next steps and your offer details.`,
          variant: "default" as const,
        };
      case "not_selected":
        return {
          title: "Assessment Results Available",
          message: `Thank you for completing the assessment, ${name}. While you weren't selected for this role, we encourage you to explore our internship programs to build your skills. Check the results page for recommended next steps.`,
          variant: "default" as const,
        };
      case "payment_confirmed":
        return {
          title: "Payment Confirmed!",
          message: `Your evaluation fee payment has been confirmed, ${name}. You can now proceed with the assessment rounds. Good luck!`,
          variant: "default" as const,
        };
      case "internship_enrolled":
        return {
          title: "Internship Enrollment Confirmed!",
          message: `Welcome aboard, ${name}! Your internship enrollment is confirmed. Check your dashboard for orientation details and your assigned mentor.`,
          variant: "default" as const,
        };
      default:
        return {
          title: "Notification",
          message: `Hi ${name}, you have a new notification from AADHYRA INNOVATIONS PVT LTD.`,
          variant: "default" as const,
        };
    }
  };

  const triggerNotification = async (payload: EmailPayload) => {
    const content = getNotificationContent(payload.type, payload.recipientName);

    // Show in-app toast notification immediately
    toast({
      title: content.title,
      description: content.message,
    });

    // Attempt to send email via Supabase Edge Function
    // This is designed to work when an email edge function is configured
    try {
      const { error } = await supabase.functions.invoke("send-notification-email", {
        body: {
          to: payload.recipientEmail,
          name: payload.recipientName,
          type: payload.type,
          ...payload.metadata,
        },
      });

      if (error) {
        // Edge function may not exist yet — this is expected
        // The toast notification above serves as the fallback
        console.log("Email notification edge function not configured:", error.message);
      }
    } catch {
      // Silently fail — toast notification is the primary feedback mechanism
      console.log("Email notification skipped (edge function not available)");
    }

    // Log the notification to the database for tracking
    try {
      await (supabase.from("contact_messages") as any).insert({
        name: payload.recipientName,
        email: payload.recipientEmail,
        subject: `[AUTO] ${content.title}`,
        message: content.message,
      });
    } catch {
      // Non-critical — notification was already shown via toast
      console.log("Notification logging skipped");
    }
  };

  return { triggerNotification };
};
