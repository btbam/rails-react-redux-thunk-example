class RequestHandler::SalesLoft::SalesLoft

  include RequestHandler::SalesLoft::Config
  
  attr_reader :base_url, :api_version, :api_key

  def initialize(base_url: BASE_URL, api_version: API_VERSION, api_key: API_KEY)
    @base_url = base_url
    @api_version = api_version
    @api_key = api_key
  end

  def get_all_people
    results = get_resource(resource: GET_PEOPLE_RESOURCE, include_paging_counts: true, per_page: 100)
    if !results.is_a?(RequestHandler::Error)
      get_all_pages(page_1: results, resource: GET_PEOPLE_RESOURCE, per_page: 100)
    else
      results
    end
  end

  private

  def get_all_pages(page_1:, resource:, **opts)
    last_page = page_1['metadata']['paging']['total_pages']
    all_objects = page_1['data']
    current_page = page_1['metadata']['paging']['current_page']
    while(current_page < last_page)
      current_page += 1
      all_objects.push(*get_resource(resource: resource, **opts.merge(page: current_page))['data'])
    end
    all_objects
  end

  def get_resource(resource:, **opts)
    begin
      response = connection.get resource, opts
    rescue Faraday::ConnectionFailed, Faraday::TimeoutError, Faraday::SSLError => e
      Rails.logger.error "Faraday Failed: #{e.inspect}"
      return RequestHandler::Error.new(error: 503, message: 'Service Unavailable')
    end
    if response.status == 200
      JSON.parse(response.body)
    else
      RequestHandler::Error.new(error: response.status, message: response.reason_phrase)
    end
  end

  def connection(base: base_url, version: api_version, key: api_key)
    @connection ||= begin
      Faraday.new(url: [base, version].join('/')) do |faraday|
        faraday.response :logger do | logger |
          logger.filter(/(Bearer\ )(\w+)/,'\1[REMOVED]')
        end
        faraday.options[:open_timeout] = 3
        faraday.options[:timeout] = 6
        faraday.request  :url_encoded
        faraday.adapter Faraday.default_adapter
        faraday.headers['Content-Type'] = 'application/json'
        faraday.headers['Authorization'] = ['Bearer', key].join(' ')
      end
    end
  end

end