import { SyntheticEvent, useCallback } from 'react';
import { Box, Autocomplete, TextField, AutocompleteChangeDetails, AutocompleteChangeReason, Grid } from '@mui/material';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { weaponsJson } from '../../constants';

import { ItemQualityPicker, ItemTierPicker, SelectedItems } from './components';
import { selectedMarketItemsAtom, selectedItemsOptionsAtom } from './atoms';
import { Item, ItemPriceInformation, SelectedItem } from './types';
import { getAveragePrice } from './utils';

export const MarketPrices = () => {
  const setSelectedMarketItems = useSetRecoilState(selectedMarketItemsAtom);
  const [selectedItemsOptions, setSelectedItemsOptions] = useRecoilState(selectedItemsOptionsAtom);

  const handleSelectedItemsChange = useCallback(
    async (event: SyntheticEvent<Element, Event>, newItems: Item[], reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<Item>) => {
      console.log('dwadaw', reason, details);
      setSelectedItemsOptions(newItems);

      if (reason === 'clear') return setSelectedMarketItems([]);

      if (!details) return;

      const { option } = details;

      if (reason === 'removeOption') return setSelectedMarketItems((currentlySelectedItems) => currentlySelectedItems.filter(({ name }) => name !== option.name));

      const priceFetchUrl = `https://west.albion-online-data.com/api/v2/stats/prices/${option.name}?locations=Caerleon,Lymhurst,Martlock,Bridgewatch,Thetford,FortSterling`;

      const itemPrices: ItemPriceInformation[] = await fetch(priceFetchUrl)
        .then((response) => response.json())
        .then((data: ItemPriceInformation[]) => getAveragePrice(data));

      console.log('itemPrices', itemPrices);
      console.log('priceFetchUrl', priceFetchUrl);

      const newlySelectedItem: SelectedItem = { ...option, prices: itemPrices };

      setSelectedMarketItems((currentlySelectedItems) => [...currentlySelectedItems, newlySelectedItem]);
    },
    [setSelectedItemsOptions, setSelectedMarketItems]
  );

  return (
    <>
      <Grid container alignItems='center' gap={6} mb={2} justifyContent='center'>
        <Autocomplete
          sx={{ width: '500px' }}
          multiple
          options={weaponsJson}
          getOptionLabel={(option) => option.label}
          fullWidth
          value={selectedItemsOptions}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          onChange={handleSelectedItemsChange}
          renderInput={(params) => <TextField {...params} variant='standard' label='Find your Item' placeholder={weaponsJson[0].label} />}
          ChipProps={{ size: 'small' }}
        />
        <Box>
          <ItemTierPicker />
          <ItemQualityPicker />
        </Box>
      </Grid>
      <SelectedItems />
    </>
  );
};
