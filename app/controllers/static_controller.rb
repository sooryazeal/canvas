class StaticController < ApplicationController
    def index
      # new user
      if current_user.file_name.nil?
        @file_contents = nil
      else
        # move to cloud
        @file_contents = File.read(full_file_name(current_user.file_name))
      end

    end
  end
