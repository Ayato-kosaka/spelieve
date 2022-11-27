import { useState } from 'react';
import { Searchbar } from 'react-native-paper';
import { ENV } from '@/ENV';

export const MItineraryHashtag = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tags, setTags] = useState<Array<string>>([]);
  const indexName: string = 'search-itinerary-tags';

  const fetchSetTags = (query: string) => {

    const requestUrl = ENV.ELASTIC_CLOUD_BASE_URL + `/${indexName}/_search`
    const data = {
      'query': {
        'match': {
          'tag': query
        }
      },
      'sort': {
        'attached_count': 'desc'
      }
    }

    const fetchTag = async () => {
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `ApiKey ${ENV.ELASTIC_CLOUD_API_KEY}`,
        },
        body: JSON.stringify(data)
      });
      return response.json()

    }
    fetchTag()
    .then(res => {
      console.log(res.hits)
    })
    .catch(e => console.log(e));
  }

  const onChangeQuery = async (query: string) => {
    setSearchQuery(query);
    fetchSetTags(searchQuery);
  };

  return (
    <>
      <Searchbar value={searchQuery} placeholder='Search Tag' onChangeText={onChangeQuery} />
    </>
  );
}
