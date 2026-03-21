// src/musicbrainz/musicbrainz.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class MusicbrainzService {
  async searchArtists(query: string) {
    const url = new URL('https://musicbrainz.org/ws/2/artist');
    url.searchParams.append('query', `artist:${query} AND type:Group`);
    url.searchParams.append('limit', '10');
    url.searchParams.append('fmt', 'json');

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'User-Agent': 'MusiciansApp/1.0 (https://yourapp.com)',
        },
      });

      if (!response.ok) {
        throw new Error(`MusicBrainz error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('MusicBrainz error:', error);
      throw error;
    }
  }
}
