import { Injectable } from '@nestjs/common';

@Injectable()
export class CityService {
  async searchNominatim(query: string): Promise<any> {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', query);
    url.searchParams.set('format', 'json');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('limit', '15');
    url.searchParams.set('countrycodes', 'es');
    url.searchParams.set('featuretype', 'settlement');

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'Waiting-Room-App',
      },
    });

    return response.json();
  }
}
