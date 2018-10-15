require "#{Rails.root}/app/controllers/api/sales_loft_controller"
require "#{Rails.root}/app/services/request_handler/sales_loft/sales_loft"

# TODO:
# 1. Move all these let statments into a shared_context
# 2. Use FactoryBot and Faker to better generate the JSON hashes
# 3. Combine common setup steps into more shared_context
# 4. Unit test SalesLoft service on it's own, using a controller integration test as a catch-all for now
RSpec.describe Api::SalesLoftController do
  describe 'GET my_people' do
    let(:connection){ double('connection') }
    let(:api_response) { double('api_response') }
    let(:response_body_base){
      '{
        "metadata": {
          "paging": {
            "per_page": 100,
            "current_page": 1,
            "total_pages": 1
          }
        },
        "data": [
          {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "display_name": "John D Doe",
            "email_address": "jdoe@example.com",
            "secondary_email_address": "johndoe@anotherexample.com",
            "personal_email_address": null,
            "title": "Fancy Job Title"
          },
          {
            "id": 2,
            "first_name": "Jane",
            "last_name": "Day",
            "display_name": "Jane J Day",
            "email_address": "janedoe@janeday.com",
            "secondary_email_address": null,
            "personal_email_address": "jday@jane.com",
            "title": "CEO Job Title"
          }
        ]
      }'
    }

    let(:response_body_page_1){
      '{
        "metadata": {
          "paging": {
            "per_page": 100,
            "current_page": 1,
            "total_pages": 2
          }
        },
        "data": [
          {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "display_name": "John D Doe",
            "email_address": "jdoe@example.com",
            "secondary_email_address": "johndoe@anotherexample.com",
            "personal_email_address": null,
            "title": "Fancy Job Title"
          },
          {
            "id": 2,
            "first_name": "Jane",
            "last_name": "Day",
            "display_name": "Jane J Day",
            "email_address": "janedoe@janeday.com",
            "secondary_email_address": null,
            "personal_email_address": "jday@jane.com",
            "title": "CEO Job Title"
          }
        ]
      }'
    }

    let(:response_body_page_2){
      '{
        "metadata": {
          "paging": {
            "per_page": 100,
            "current_page": 2,
            "total_pages": 2
          }
        },
        "data": [
          {
            "id": 3,
            "first_name": "John",
            "last_name": "Doe",
            "display_name": "John D Doe",
            "email_address": "jdoe@example.com",
            "secondary_email_address": "johndoe@anotherexample.com",
            "personal_email_address": null,
            "title": "Fancy Job Title"
          },
          {
            "id": 4,
            "first_name": "Jane",
            "last_name": "Day",
            "display_name": "Jane J Day",
            "email_address": "janedoe@janeday.com",
            "secondary_email_address": null,
            "personal_email_address": "jday@jane.com",
            "title": "CEO Job Title"
          }
        ]
      }'
    }

    before(:each) do
      stub_const('RequestHandler::SalesLoft::Config::BASE_URL', 'http://example.com')
      stub_const('RequestHandler::SalesLoft::Config::API_VERSION', 'v1')
      stub_const('RequestHandler::SalesLoft::Config::API_KEY', 'abc123')
      stub_const('RequestHandler::SalesLoft::Config::GET_PEOPLE_RESOURCE', 'resource.json')

      expect(Faraday).to receive(:new).with(url: 'http://example.com/v1').and_return(connection)
    end

    it 'returns an array of people if there is one page (base case)' do
      expect(connection).to receive(:get).with('resource.json', {:include_paging_counts=>true, :per_page=>100}).once.and_return(api_response)
      expect(api_response).to receive(:status).and_return(200)
      expect(api_response).to receive(:body).and_return(response_body_base)

      get api_my_people_url

      parsed_response = JSON.parse(response.body)

      expect(parsed_response).to eq({"data"=>[
                                      {"id"=>"1", "type"=>"sales-loft-person", "attributes"=>{"first-name"=>"John", "last-name"=>"Doe", "title"=>"Fancy Job Title", "email-address"=>"jdoe@example.com"}},
                                      {"id"=>"2", "type"=>"sales-loft-person", "attributes"=>{"first-name"=>"Jane", "last-name"=>"Day", "title"=>"CEO Job Title", "email-address"=>"janedoe@janeday.com"}}
                                   ]})
    end

    it 'returns an array of people from multiple pages' do
      expect(connection).to receive(:get).with('resource.json', {:include_paging_counts=>true, :per_page=>100}).once.and_return(api_response)
      expect(connection).to receive(:get).with('resource.json', {:page=>2, :per_page=>100}).once.and_return(api_response)
      expect(api_response).to receive(:status).twice.and_return(200)
      expect(api_response).to receive(:body).once.ordered.and_return(response_body_page_1)
      expect(api_response).to receive(:body).once.ordered.and_return(response_body_page_2)

      get api_my_people_url

      parsed_response = JSON.parse(response.body)

      expect(parsed_response).to eq({"data"=>[
                                      {"id"=>"1", "type"=>"sales-loft-person", "attributes"=>{"first-name"=>"John", "last-name"=>"Doe", "title"=>"Fancy Job Title", "email-address"=>"jdoe@example.com"}},
                                      {"id"=>"2", "type"=>"sales-loft-person", "attributes"=>{"first-name"=>"Jane", "last-name"=>"Day", "title"=>"CEO Job Title", "email-address"=>"janedoe@janeday.com"}},
                                      {"id"=>"3", "type"=>"sales-loft-person", "attributes"=>{"first-name"=>"John", "last-name"=>"Doe", "title"=>"Fancy Job Title", "email-address"=>"jdoe@example.com"}},
                                      {"id"=>"4", "type"=>"sales-loft-person", "attributes"=>{"first-name"=>"Jane", "last-name"=>"Day", "title"=>"CEO Job Title", "email-address"=>"janedoe@janeday.com"}}
                                   ]})
    end

    it 'returns a RequestHandler::Error object if HTTP status is not 200' do
      expect(connection).to receive(:get).with('resource.json', {:include_paging_counts=>true, :per_page=>100}).once.and_return(api_response)
      expect(api_response).to receive(:status).twice.and_return(500)
      expect(api_response).to receive(:reason_phrase).once.and_return('Reason Phrase')

      get api_my_people_url

      parsed_response = JSON.parse(response.body)

      expect(parsed_response).to eq({"error"=>500, "message"=>"Reason Phrase"})
      expect(response.status).to eq(500)
    end

    it 'returns a RequestHandler::Error object with 503 status if Faraday::ConnectionFailed' do
      expect(connection).to receive(:get).and_raise(Faraday::ConnectionFailed.new('Execution Expired'))

      get api_my_people_url

      parsed_response = JSON.parse(response.body)

      expect(parsed_response).to eq({"error"=>503, "message"=>"Service Unavailable"})
      expect(response.status).to eq(503)
    end

    it 'returns a RequestHandler::Error object with 503 status if Faraday::TimeoutError' do
      expect(connection).to receive(:get).and_raise(Faraday::TimeoutError.new('Execution Expired'))

      get api_my_people_url

      parsed_response = JSON.parse(response.body)

      expect(parsed_response).to eq({"error"=>503, "message"=>"Service Unavailable"})
      expect(response.status).to eq(503)
    end

    it 'returns a RequestHandler::Error object with 503 status if Faraday::SSLError' do
      expect(connection).to receive(:get).and_raise(Faraday::SSLError.new('SSL Expired'))

      get api_my_people_url

      parsed_response = JSON.parse(response.body)

      expect(parsed_response).to eq({"error"=>503, "message"=>"Service Unavailable"})
      expect(response.status).to eq(503)
    end


  end
end