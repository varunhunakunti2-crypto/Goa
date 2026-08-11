import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Upload PNG blob to Supabase Storage Bucket 'frames'
 */
export async function uploadFrame(fileBlob, fileName) {
  if (!supabase) {
    console.error("Supabase client not initialized. Make sure PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY are set.");
    return null;
  }

  const { data, error } = await supabase.storage
    .from('frames')
    .upload(fileName, fileBlob, {
      contentType: 'image/png',
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    console.error("Error uploading to Supabase:", error);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from('frames')
    .getPublicUrl(fileName);

  return publicUrlData?.publicUrl || null;
}
