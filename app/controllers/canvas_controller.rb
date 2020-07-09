class CanvasController < ApplicationController
    def save
      # create only file for new user
      file_name = current_user.file_name || SecureRandom.urlsafe_base64(nil, false)
      current_user.file_name = file_name
      current_user.save!


      file_name = full_file_name(file_name)
      File.open(file_name, 'w') { |file| file.write(params[:file_contents]); file.close }
      head 201, content_type: "application/json"
    end
  end
