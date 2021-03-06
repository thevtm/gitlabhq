import axios from '~/lib/utils/axios_utils';
import Clusters from '~/clusters_list/components/clusters.vue';
import ClusterStore from '~/clusters_list/store';
import MockAdapter from 'axios-mock-adapter';
import { apiData } from '../mock_data';
import { mount } from '@vue/test-utils';
import { GlTable, GlLoadingIcon } from '@gitlab/ui';

describe('Clusters', () => {
  let mock;
  let store;
  let wrapper;

  const endpoint = 'some/endpoint';

  const findLoader = () => wrapper.find(GlLoadingIcon);
  const findTable = () => wrapper.find(GlTable);
  const findStatuses = () => findTable().findAll('.js-status');

  const mockPollingApi = (response, body, header) => {
    mock.onGet(endpoint).reply(response, body, header);
  };

  const mountWrapper = () => {
    store = ClusterStore({ endpoint });
    wrapper = mount(Clusters, { store });
    return axios.waitForAll();
  };

  beforeEach(() => {
    mock = new MockAdapter(axios);
    mockPollingApi(200, apiData, {});

    return mountWrapper();
  });

  afterEach(() => {
    wrapper.destroy();
    mock.restore();
  });

  describe('clusters table', () => {
    describe('when data is loading', () => {
      beforeEach(() => {
        wrapper.vm.$store.state.loading = true;
        return wrapper.vm.$nextTick();
      });

      it('displays a loader instead of the table while loading', () => {
        expect(findLoader().exists()).toBe(true);
        expect(findTable().exists()).toBe(false);
      });
    });

    it('displays a table component', () => {
      expect(findTable().exists()).toBe(true);
    });

    it('renders the correct table headers', () => {
      const tableHeaders = wrapper.vm.fields;
      const headers = findTable().findAll('th');

      expect(headers.length).toBe(tableHeaders.length);

      tableHeaders.forEach((headerText, i) =>
        expect(headers.at(i).text()).toEqual(headerText.label),
      );
    });

    it('should stack on smaller devices', () => {
      expect(findTable().classes()).toContain('b-table-stacked-md');
    });
  });

  describe('cluster status', () => {
    it.each`
      statusName                  | className       | lineNumber
      ${'disabled'}               | ${'disabled'}   | ${0}
      ${'unreachable'}            | ${'bg-danger'}  | ${1}
      ${'authentication_failure'} | ${'bg-warning'} | ${2}
      ${'deleting'}               | ${null}         | ${3}
      ${'created'}                | ${'bg-success'} | ${4}
      ${'default'}                | ${'bg-white'}   | ${5}
    `('renders a status for each cluster', ({ statusName, className, lineNumber }) => {
      const statuses = findStatuses();
      const status = statuses.at(lineNumber);
      if (statusName !== 'deleting') {
        const statusIndicator = status.find('.cluster-status-indicator');
        expect(statusIndicator.exists()).toBe(true);
        expect(statusIndicator.classes()).toContain(className);
      } else {
        expect(status.find(GlLoadingIcon).exists()).toBe(true);
      }
    });
  });
});
