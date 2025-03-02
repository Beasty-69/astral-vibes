
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function fetchFromDeezer(endpoint: string, params: Record<string, string> = {}) {
  // Build query string from params
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  
  const url = `https://api.deezer.com/${endpoint}${queryString ? `?${queryString}` : ''}`;
  
  console.log(`Fetching from Deezer: ${url}`);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Deezer API error: ${response.status} ${errorText}`);
    throw new Error(`Deezer API error: ${response.status}`);
  }
  
  return response.json();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    const requestData = await req.json();
    
    if (path === 'search') {
      const { query } = requestData;
      if (!query) {
        return new Response(
          JSON.stringify({ error: 'Query parameter is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const data = await fetchFromDeezer('search', { q: query });
      
      // Transform response to match the Spotify format our frontend expects
      const transformedData = {
        tracks: {
          items: data.data.map((track: any) => ({
            id: track.id.toString(),
            name: track.title,
            artists: [{ name: track.artist.name }],
            album: {
              name: track.album.title,
              images: [{ url: track.album.cover_big || track.album.cover_medium || track.album.cover_small }]
            },
            duration_ms: track.duration * 1000,
            external_urls: {
              spotify: track.link  // Deezer link
            },
            preview_url: track.preview
          }))
        }
      };
      
      return new Response(
        JSON.stringify(transformedData),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (path === 'new-releases') {
      // Deezer doesn't have a direct "new releases" endpoint, so we'll use the chart endpoint
      const data = await fetchFromDeezer('chart');
      
      // Transform response to match the Spotify format our frontend expects
      const transformedData = {
        albums: {
          items: data.albums.data.map((album: any) => ({
            id: album.id.toString(),
            name: album.title,
            artists: [{ name: album.artist.name }],
            images: [{ url: album.cover_big || album.cover_medium || album.cover_small }],
            external_urls: {
              spotify: album.link  // Deezer link
            }
          }))
        }
      };
      
      return new Response(
        JSON.stringify(transformedData),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Invalid endpoint' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in Deezer function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
