class StaticController < ApplicationController
    def index
      if current_user.file_name.nil?
        @file_contents = nil
      else
        @file_contents = File.read(assets_dir + "/" + current_user.file_name)
      end

    end

    def save
      file_name = current_user.file_name || SecureRandom.urlsafe_base64(nil, false)
      current_user.file_name = file_name
      current_user.save!
      file_name = assets_dir + "/" + file_name
      File.open(file_name, 'w') { |file| file.write(params[:file_contents]); file.close }
      head 201, content_type: "application/json"
    end
  end
