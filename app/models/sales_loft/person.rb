class SalesLoft::Person < ActiveModelSerializers::Model
  attributes :id, :created_at, :updated_at, :last_contacted_at, :last_replied_at, :first_name, :last_name,
             :display_name, :email_address, :secondary_email_address, :personal_email_address, :phone, 
             :phone_extension, :home_phone, :mobile_phone, :linkedin_url, :title, :city, :state, :country,
             :work_city, :work_state, :work_country, :crm_url, :crm_id, :crm_object_type, :owner_crm_id,
             :person_company_name, :person_company_website, :person_company_industry, :do_not_contact, :bouncing,
             :locale, :personal_website, :twitter_handle, :last_contacted_type, :custom_fields, :tags,
             :contact_restrictions, :counts, :account, :owner, :last_contacted_by, :import, :person_stage
end
