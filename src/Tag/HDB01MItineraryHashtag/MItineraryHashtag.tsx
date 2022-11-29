import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { AutocompleteInput } from 'react-native-autocomplete-input';
import { Searchbar, Text } from 'react-native-paper';

import { styles } from './MItineraryHashtagStyle';

import { ENV } from '@/ENV';



export const HDB01MItineraryHashtag = ({ onAutoCompleteClicked }) => {
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [tags, setTags] = useState<Array<string>>([]);
	const indexName = 'search-m_itinerary_hashtags';

	const fetchSetTags = (query: string) => {
		const requestUrl = `${ENV.ELASTIC_CLOUD_BASE_URL  }/${indexName}/_search`;
		const data = {
			query: {
				match: {
					tag: query,
				},
			},
			sort: {
				attached_count: 'desc',
			},
		};

		const fetchTag = async () => {
			const response = await fetch(requestUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `ApiKey ${ENV.ELASTIC_CLOUD_API_KEY}`,
				},
				body: JSON.stringify(data),
			});
			return response.json();
		};

		fetchTag()
			.then((res) => {
				setTags(res.hits.hits.map((doc) => doc._source.tag));
			})
			.catch((e) => console.log(e));
	};

	const onChangeQuery = (query: string) => {
		fetchSetTags(query);
		setSearchQuery(query);
	};

	return (
		<>
			<AutocompleteInput
				data={tags}
				value={searchQuery}
				onChangeText={onChangeQuery}
				flatListProps={{
					renderItem: ({ item }) => (
							<TouchableOpacity onPress={onAutoCompleteClicked}>
								<Text style={styles.tagText}>{item}</Text>
							</TouchableOpacity>
						),
				}}
			/>
		</>
	);
};
