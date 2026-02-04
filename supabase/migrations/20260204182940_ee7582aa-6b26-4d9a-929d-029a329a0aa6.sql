-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  true,
  524288000, -- 500MB limit
  ARRAY['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/avi']
);

-- Allow public access to view videos
CREATE POLICY "Videos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

-- Allow authenticated users to upload videos
CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'videos');

-- Allow users to update their own videos
CREATE POLICY "Users can update videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'videos');

-- Allow users to delete videos
CREATE POLICY "Users can delete videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'videos');