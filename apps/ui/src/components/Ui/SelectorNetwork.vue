<script setup lang="ts">
import { getUrl } from '@/helpers/utils';
import { enabledNetworks, getNetwork } from '@/networks';
import { BaseDefinition, NetworkID } from '@/types';

const network = defineModel<string | number | null>({
  required: true
});

const props = defineProps<{
  definition: BaseDefinition<string | number | null> & {
    networkId: NetworkID;
    networksListKind?: 'full' | 'builtin' | 'offchain';
  };
}>();

const { networks } = useOffchainNetworksList(props.definition.networkId);

const options = computed(() => {
  const networksListKind = props.definition.networksListKind;
  if (networksListKind === 'full' || networksListKind === 'offchain') {
    const baseNetworks = networks.value
      .filter(network => {
        if (
          props.definition.networkId === 's' &&
          'testnet' in network &&
          network.testnet
        ) {
          return false;
        }

        return true;
      })
      .map(network => ({
        id: network.chainId,
        name: network.name,
        icon: h('img', {
          src: getUrl(network.logo),
          alt: network.name,
          class: 'rounded-full'
        })
      }));
    if (networksListKind === 'offchain') return baseNetworks;

    return [
      ...baseNetworks,
    ];
  }

  return enabledNetworks
    .map(id => {
      const { name, readOnly, avatar } = getNetwork(id);

      return {
        id,
        name,
        icon: h('img', {
          src: getUrl(avatar),
          alt: name,
          class: 'rounded-full'
        }),
        readOnly
      };
    })
    .filter(network => !network.readOnly);
});
</script>

<template>
  <Combobox
    v-model="network"
    :definition="{
      ...definition,
      enum: options.map(c => c.id),
      options: options,
      examples: ['Select network']
    }"
  />
</template>
