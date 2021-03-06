<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import tooltip from '~/vue_shared/directives/tooltip';
import DeprecatedModal from '~/vue_shared/components/deprecated_modal.vue';
import CommitFilesList from './commit_sidebar/list.vue';
import EmptyState from './commit_sidebar/empty_state.vue';
import consts from '../stores/modules/commit/constants';
import { leftSidebarViews, stageKeys } from '../constants';

export default {
  components: {
    DeprecatedModal,
    CommitFilesList,
    EmptyState,
  },
  directives: {
    tooltip,
  },
  computed: {
    ...mapState(['changedFiles', 'stagedFiles', 'lastCommitMsg', 'unusedSeal']),
    ...mapState('commit', ['commitMessage', 'submitCommitLoading']),
    ...mapGetters(['lastOpenedFile', 'hasChanges', 'someUncommittedChanges', 'activeFile']),
    ...mapGetters('commit', ['discardDraftButtonDisabled']),
    showStageUnstageArea() {
      return Boolean(this.someUncommittedChanges || this.lastCommitMsg || !this.unusedSeal);
    },
    activeFileKey() {
      return this.activeFile ? this.activeFile.key : null;
    },
  },
  watch: {
    hasChanges() {
      if (!this.hasChanges) {
        this.updateActivityBarView(leftSidebarViews.edit.name);
      }
    },
  },
  mounted() {
    if (this.lastOpenedFile && this.lastOpenedFile.type !== 'tree') {
      this.openPendingTab({
        file: this.lastOpenedFile,
        keyPrefix: this.lastOpenedFile.staged ? stageKeys.staged : stageKeys.unstaged,
      })
        .then(changeViewer => {
          if (changeViewer) {
            this.updateViewer('diff');
          }
        })
        .catch(e => {
          throw e;
        });
    }
  },
  methods: {
    ...mapActions(['openPendingTab', 'updateViewer', 'updateActivityBarView']),
    ...mapActions('commit', ['commitChanges', 'updateCommitAction']),
    forceCreateNewBranch() {
      return this.updateCommitAction(consts.COMMIT_TO_NEW_BRANCH).then(() => this.commitChanges());
    },
  },
  stageKeys,
};
</script>

<template>
  <div class="multi-file-commit-panel-section">
    <deprecated-modal
      id="ide-create-branch-modal"
      :primary-button-label="__('Create new branch')"
      :title="__('Branch has changed')"
      kind="success"
      @submit="forceCreateNewBranch"
    >
      <template slot="body">
        {{
          __(`This branch has changed since you started editing.
          Would you like to create a new branch?`)
        }}
      </template>
    </deprecated-modal>
    <template v-if="showStageUnstageArea">
      <commit-files-list
        :key-prefix="$options.stageKeys.staged"
        :file-list="stagedFiles"
        :active-file-key="activeFileKey"
        :empty-state-text="__('There are no changes')"
        class="is-first"
        icon-name="unstaged"
      />
    </template>
    <empty-state v-if="unusedSeal" />
  </div>
</template>
