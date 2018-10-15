class RequestHandler::SalesLoft::SalesLoft

  include RequestHandler::SalesLoft::Config
  
  attr_reader :base_url, :api_version, :api_key

  # Main class to interface with the SalesLoft API
  #
  # @param base_url [String] the base URL of the SalesLoft API. Should come from SalesLoft::Config
  # @param api_version [String] the api version to be used for this instance of requests. Should come from SalesLoft::Config
  # @param api_key [String] the api key for the SalesLoft API. Should come from SalesLoft::Config which comes from ENV
  # @return [RequestHandler::SalesLoft::SalesLoft] object for querying SalesLoft API.
  def initialize(base_url: BASE_URL, api_version: API_VERSION, api_key: API_KEY)
    @base_url = base_url
    @api_version = api_version
    @api_key = api_key
  end

  # Get all people objects associated with SalesLoft API_KEY
  #
  # @return [optional, Array<Hash>, RequestHandler::Error]
  #   Returns Array of Hashes containing SalesLoft People JSON on success.  
  #   Returns RequestHandler::Error on error.
  def get_all_people
    results = get_resource(resource: GET_PEOPLE_RESOURCE, include_paging_counts: true, per_page: 100)
    if !results.is_a?(RequestHandler::Error)
      get_all_pages(page_1: results, resource: GET_PEOPLE_RESOURCE, per_page: 100)
    else
      results
    end
  end

  private

  # Loop through all additional pages, based on first page results, and gather all objects
  #
  # @param page_1 [Hash] the parsed result of the JSON from the first page
  # @param resource [String] the resource for the endpoint to be used. Should come from SalesLoft::Config
  # @param opts [Hash] random options to pass to the SalesLoft API
  # @return [Array<Hash>] Array of Hashes containing SalesLoft People JSON.
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

  # Call a SalesLoft resource and get results
  #
  # @param resource [String] the resource for the endpoint to be used. Should come from SalesLoft::Config
  # @param opts [Hash] random options to pass to the SalesLoft API
  # @return [optional, Array<Hash>, RequestHandler::Error]
  #   Returns Array of Hashes containing SalesLoft People JSON on success.  
  #   Returns RequestHandler::Error on error.
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

  # Create a Faraday Instance for API accessability
  #
  # @param base [String] the base URL of the SalesLoft API. Should come from SalesLoft::Config
  # @param version [String] the api version to be used for this instance of requests. Should come from SalesLoft::Config
  # @param key [String] the api key for the SalesLoft API. Should come from SalesLoft::Config which comes from ENV
  # @return [Faraday] Faraday object to call resources and get results
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