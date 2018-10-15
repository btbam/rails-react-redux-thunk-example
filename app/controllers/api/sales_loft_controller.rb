class Api::SalesLoftController < Api::BaseController
  respond_to :json

  def my_people
    sales_loft_handler = RequestHandler::SalesLoft::SalesLoft.new
    all_people_response = sales_loft_handler.get_all_people

    if !all_people_response.is_a?(RequestHandler::Error)
      all_people_objects = all_people_response.map{ |person| SalesLoft::Person.new(person) }
      render json: all_people_objects, each_serializer: SalesLoft::PersonSerializer
    else
      render status: all_people_response.error
    end
  end
end
