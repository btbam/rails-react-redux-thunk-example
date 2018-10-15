Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }

  namespace :api, defaults: { format: "json" } do
    get :me, to: 'me#me'

    get :my_people, to: 'sales_loft#my_people'
  end

  root to: "main#index"
end
