<script setup lang="ts">
import { _n, prettyConcat } from '@/helpers/utils';
import { PropositionPowerItem } from '@/queries/propositionPower';

type Strategy = PropositionPowerItem['strategies'][0];

const props = defineProps<{
  propositionPower: PropositionPowerItem;
}>();

const OFFCHAIN_ERRORS = {
  'only-members': () =>
    'You need to be a member of the space in order to create a proposal.',
  basic: (strategy: Strategy) =>
    `You need at least ${_n(strategy.params.minScore, 'compact')} ${prettySymbolsList(
      strategy.params.strategies.map(
        s => s.params.symbol || props.propositionPower.symbol
      )
    )} to create a proposal.`,
  'passport-gated': (strategy: Strategy) =>
    `You need a Gitcoin Passport with ${strategy.params.operator === 'AND' ? 'all' : 'one'} of the following stamps to create a proposal: ${prettyConcat(strategy.params.stamps, strategy.params.operator === 'AND' ? 'and' : 'or')}.`,
  'karma-eas-attestation': () =>
    'You need to be attested by Karma EAS to create a proposal.'
} as const;

const LINKS = {
  'passport-gated': {
    label: 'Gitcoin Passport',
    url: 'https://passport.gitcoin.co/#/dashboard'
  }
} as const;

const offchainStrategy = computed(() => {
  const name = props.propositionPower.strategies[0].name;

  if (OFFCHAIN_ERRORS[name]) {
    return props.propositionPower.strategies[0];
  }

  return null;
});

function prettySymbolsList(symbols: string[]): string {
  return prettyConcat(Array.from(new Set(symbols)));
}
</script>

<template>
  <UiAlert type="error" v-bind="$attrs">
    <template v-if="offchainStrategy">
      {{ OFFCHAIN_ERRORS[offchainStrategy.name](offchainStrategy) }}
      <AppLink
        v-if="LINKS[offchainStrategy.name]"
        :to="LINKS[offchainStrategy.name].url"
      >
        {{ LINKS[offchainStrategy.name].label }}
        <IH-arrow-sm-right class="inline-block -rotate-45" />
      </AppLink>
    </template>
    <template v-else>
      You need at least {{ _n(propositionPower.threshold) }}
      {{
        prettySymbolsList(
          propositionPower.strategies.map(
            s => s.params.symbol || propositionPower.symbol
          )
        )
      }}
      to create a proposal.
    </template>
  </UiAlert>
</template>
