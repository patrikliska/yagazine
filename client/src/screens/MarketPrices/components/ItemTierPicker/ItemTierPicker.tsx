import { Box, Button, FormControlLabel, Checkbox, FormLabel, Typography } from '@mui/material';
import { useRecoilState } from 'recoil';
import { useCallback } from 'react';

import { itemTiersAtom } from '../../atoms';
import { itemTiers } from '../../constants';
import { ItemTier } from '../../types';

export const ItemTierPicker = () => {
  const [selectedItemTiers, setSelectedItemTiers] = useRecoilState(itemTiersAtom);

  const handleSelectedItemTiers = useCallback(
    (itemTier: ItemTier) => {
      setSelectedItemTiers((currentlySelectedItemTiers) => {
        if (currentlySelectedItemTiers.includes(itemTier)) {
          if (currentlySelectedItemTiers.length === 1) return currentlySelectedItemTiers;

          const updatedSelectedItems = currentlySelectedItemTiers.filter((tier) => tier !== itemTier);

          return updatedSelectedItems;
        } else {
          const updatedSelectedItems = [...currentlySelectedItemTiers, itemTier];

          updatedSelectedItems.sort((a, b) => a - b);

          return updatedSelectedItems;
        }
      });
    },
    [setSelectedItemTiers]
  );

  return (
    <Box width='fit-content'>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <FormLabel sx={{ m: 0 }}>
          <Typography variant='body2'>Tier</Typography>
        </FormLabel>
        <Box>
          <Button variant='text' size='small' onClick={() => setSelectedItemTiers(itemTiers)}>
            Select all
          </Button>
          <Button variant='text' size='small' onClick={() => setSelectedItemTiers([itemTiers[0]])}>
            Unselect all
          </Button>
        </Box>
      </Box>
      <Box>
        {itemTiers.map((itemTier, index) => (
          <FormControlLabel
            key={`${itemTier}-${index}`}
            control={<Checkbox checked={selectedItemTiers.includes(itemTier)} onClick={() => handleSelectedItemTiers(itemTier)} size='small' />}
            label={`T .${itemTier}`}
          />
        ))}
      </Box>
    </Box>
  );
};
