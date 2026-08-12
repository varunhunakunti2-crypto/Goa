import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = import.meta.env.PUBLIC_SUPABASE_URL     || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Upload PNG blob to Supabase Storage bucket 'generated-images'.
 * Throws a typed Error with .code set to one of:
 *   'SUPABASE_NOT_CONFIGURED' | 'NETWORK_FAILURE' | 'UPLOAD_FAILED'
 */
export async function uploadFrame(fileBlob, fileName) {
  if (!supabase) {
    const err = new Error('Supabase is not configured (missing env vars).');
    err.code = 'SUPABASE_NOT_CONFIGURED';
    throw err;
  }

  // Detect if browser is offline before even trying
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    const err = new Error('No internet connection.');
    err.code = 'NETWORK_FAILURE';
    throw err;
  }

  let uploadResult;
  try {
    uploadResult = await supabase.storage
      .from('generated-images')
      .upload(fileName, fileBlob, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true,
      });
  } catch (networkErr) {
    // fetch() itself threw — DNS / connection refused / timeout
    const err = new Error('Network request failed during upload.');
    err.code = 'NETWORK_FAILURE';
    err.cause = networkErr;
    throw err;
  }

  const { error } = uploadResult;
  if (error) {
    const err = new Error(error.message || 'Supabase upload returned an error.');
    err.code = 'UPLOAD_FAILED';
    err.cause = error;
    throw err;
  }

  const { data: publicUrlData } = supabase.storage
    .from('generated-images')
    .getPublicUrl(fileName);

  return publicUrlData?.publicUrl || null;
}
