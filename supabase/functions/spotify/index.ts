
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'
import { encode as base64Encode } from 'https://deno.land/std@0.177.0/encoding/base64.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const endpoint = url.pathname.split('/').pop()
    
    const SPOTIFY_CLIENT_ID = Deno.env.get('SPOTIFY_CLIENT_ID')
    const SPOTIFY_CLIENT_SECRET = Deno.env.get('SPOTIFY_CLIENT_SECRET')
    
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      return new Response(
        JSON.stringify({ error: 'Spotify API credentials not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get access token from Spotify
    async function getSpotifyAccessToken() {
      const credentials = `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${base64Encode(credentials)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      })

      const data = await response.json()
      return data.access_token
    }

    // Common function to call Spotify API
    async function callSpotifyApi(apiUrl: string, accessToken: string) {
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      
      if (!response.ok) {
        console.error('Spotify API error:', await response.text())
        throw new Error(`Spotify API error: ${response.status}`)
      }
      
      return await response.json()
    }

    // Get request body
    const requestData = await req.json()
    const accessToken = await getSpotifyAccessToken()

    let result: any

    // Handle different API endpoints
    if (endpoint === 'search') {
      const { query, type = 'track,artist,album', limit = 20 } = requestData
      
      if (!query) {
        return new Response(
          JSON.stringify({ error: 'Query parameter is required' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
      
      const encodedQuery = encodeURIComponent(query)
      const encodedType = encodeURIComponent(type)
      const apiUrl = `https://api.spotify.com/v1/search?q=${encodedQuery}&type=${encodedType}&limit=${limit}`
      
      result = await callSpotifyApi(apiUrl, accessToken)
    } 
    else if (endpoint === 'recommendations') {
      const { seed_artists = '', seed_tracks = '', seed_genres = 'pop', limit = 20 } = requestData
      
      const apiUrl = `https://api.spotify.com/v1/recommendations?seed_artists=${seed_artists}&seed_tracks=${seed_tracks}&seed_genres=${seed_genres}&limit=${limit}`
      
      result = await callSpotifyApi(apiUrl, accessToken)
    }
    else if (endpoint === 'new-releases') {
      const { country = 'US', limit = 20 } = requestData
      
      const apiUrl = `https://api.spotify.com/v1/browse/new-releases?country=${country}&limit=${limit}`
      
      result = await callSpotifyApi(apiUrl, accessToken)
    }
    else if (endpoint === 'track') {
      const { id } = requestData
      
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Track ID is required' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
      
      const apiUrl = `https://api.spotify.com/v1/tracks/${id}`
      
      result = await callSpotifyApi(apiUrl, accessToken)
    }
    else {
      return new Response(
        JSON.stringify({ error: 'Invalid endpoint' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify(result),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
