import { supabase } from "@/integrations/supabase/client";

export const useEnrollment = () => {
  const checkEnrollment = async (userId: string | undefined, courseId: string) => {
    if (!userId) return { isEnrolled: false };

    const { data, error } = await (supabase
      .from('enrollments')
      .select('id') as any)
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle();

    return { isEnrolled: !!data, error };
  };

  const createEnrollment = async (userId: string, courseId: string, price: number) => {
    if (!userId) return { error: "No user found" };

    // 1. Check if they are already enrolled to prevent errors
    const { isEnrolled, error: checkError } = await checkEnrollment(userId, courseId);
    if (checkError) return { error: checkError };
    if (isEnrolled) return { error: "Already enrolled" };

    // 2. Insert into Enrollments and select the new ID
    const { data: enrollment, error: enrollmentError } = await (supabase
      .from('enrollments') as any)
      .insert({
        user_id: userId,
        course_id: courseId,
        status: 'active',
        enrolled_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (enrollmentError) return { error: enrollmentError };

    // 3. Automatically create the pending payment record
    const { error: paymentError } = await (supabase
      .from('course_payments') as any)
      .insert({
        user_id: userId,
        enrollment_id: enrollment.id,
        amount: price,
        status: 'pending'
      });

    if (paymentError) return { error: paymentError };

    return { data: enrollment, error: null };
  };

  return { checkEnrollment, createEnrollment };
};