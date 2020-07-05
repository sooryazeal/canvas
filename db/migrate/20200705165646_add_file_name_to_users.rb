class AddFileNameToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :file_name, :string
  end
end
