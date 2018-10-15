class RequestHandler::Error
  attr_reader :error, :message

  def initialize(error:, message:)
    @error = error
    @message = message
  end
end