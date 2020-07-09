module ApplicationHelper
    def full_file_name(fname)
        return assets_dir + "/" + fname
    end
end
