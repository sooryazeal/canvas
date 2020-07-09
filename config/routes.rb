Rails.application.routes.draw do
  root :to => "static#index"
  resources :static, only: :index

  devise_for :users, controllers: {omniauth_callbacks: "omniauth_callbacks"}

  resources :canvas do
    post :save, on: :collection
  end
end
