class SalesLoft::PersonSerializer < ActiveModel::Serializer
  attributes :id, :first_name, :last_name, :title, :email_address
end
