# frozen_string_literal: true

module Gitlab
  class SnippetSearchResults < SearchResults
    include SnippetsHelper

    attr_reader :current_user

    def initialize(current_user, query)
      @current_user = current_user
      @query = query
    end

    def objects(scope, page: nil, per_page: DEFAULT_PER_PAGE)
      paginated_objects(snippet_titles, page, per_page)
    end

    def formatted_count(scope)
      formatted_limited_count(limited_snippet_titles_count)
    end

    def limited_snippet_titles_count
      @limited_snippet_titles_count ||= limited_count(snippet_titles)
    end

    private

    # rubocop: disable CodeReuse/ActiveRecord
    def snippets
      SnippetsFinder.new(current_user, finder_params)
        .execute
        .includes(:author)
        .reorder(updated_at: :desc)
    end
    # rubocop: enable CodeReuse/ActiveRecord

    def snippet_titles
      snippets.search(query)
    end

    def paginated_objects(relation, page, per_page)
      relation.page(page).per(per_page)
    end

    def finder_params
      {}
    end
  end
end

Gitlab::SnippetSearchResults.prepend_if_ee('::EE::Gitlab::SnippetSearchResults')
