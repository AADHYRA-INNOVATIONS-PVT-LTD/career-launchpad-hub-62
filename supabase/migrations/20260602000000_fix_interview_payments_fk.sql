-- The interview_fee_payments table uses course_categories IDs, not courses IDs.
-- We must drop the strict foreign key to the courses table to allow entrance test payments for categories.
ALTER TABLE IF EXISTS interview_fee_payments 
DROP CONSTRAINT IF EXISTS interview_fee_payments_course_id_fkey;
