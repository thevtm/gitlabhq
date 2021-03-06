/**
 * API callbacks for pagination and tabs
 * shared between Pipelines and Environments table.
 *
 * Components need to have `scope`, `page` and `requestData`
 */
import { historyPushState, buildUrlWithCurrentLocation } from '../../lib/utils/common_utils';

export default {
  methods: {
    onChangeTab(scope) {
      let params = {
        scope,
        page: '1',
      };

      params = this.onChangeWithFilter(params);

      this.updateContent(params);
    },

    onChangePage(page) {
      /* URLS parameters are strings, we need to parse to match types */
      let params = {
        page: Number(page).toString(),
      };

      if (this.scope) {
        params.scope = this.scope;
      }

      params = this.onChangeWithFilter(params);

      this.updateContent(params);
    },

    onChangeWithFilter(params) {
      const { username, ref } = this.requestData;
      const paramsData = params;

      if (username) {
        paramsData.username = username;
      }

      if (ref) {
        paramsData.ref = ref;
      }

      return paramsData;
    },

    updateInternalState(parameters) {
      // stop polling
      this.poll.stop();

      const queryString = Object.keys(parameters)
        .map(parameter => {
          const value = parameters[parameter];
          // update internal state for UI
          this[parameter] = value;
          return `${parameter}=${encodeURIComponent(value)}`;
        })
        .join('&');

      // update polling parameters
      this.requestData = parameters;

      historyPushState(buildUrlWithCurrentLocation(`?${queryString}`));

      this.isLoading = true;
    },
  },
};
