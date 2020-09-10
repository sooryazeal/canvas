class ApplicationController < ActionController::Base
    include ApplicationHelper
    before_action :authenticate_user!
    before_action :configure_sanitized_params, if: :devise_controller?

    protected
    def configure_sanitized_params
        devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    end
end
