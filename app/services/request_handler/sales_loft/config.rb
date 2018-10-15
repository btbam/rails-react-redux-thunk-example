module RequestHandler::SalesLoft::Config

  BASE_URL = 'https://api.salesloft.com'.freeze
  
  API_VERSION = 'v2'.freeze

  API_KEY = ENV['SALESLOFT_API_KEY'].freeze

  GET_PEOPLE_RESOURCE = 'people.json'.freeze
  
end
