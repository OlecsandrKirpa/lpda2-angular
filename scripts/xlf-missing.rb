# Will get two arguments: the path to the original xlf file and the path to the new xlf file
# The original may be bigger than the new one.
# If it's the case, a file containing only the missing keys will be created in /tmp/missing-#{Time.now.to_i}.txt

# Run this file from root with `ruby scripts/xlf-missing.rb`

# ruby 3.2.2 (2023-03-30 revision e51014f9c0) [x86_64-linux]

require 'nokogiri' #  (1.16.2, 1.15.5)
require "debug" # 1.9.2, 1.9.1, 1.7.1

# Step 1: Check if the files exist and load them.
original_file = ARGV[0] || "locales/messages.xlf"
new_file = ARGV[1] || "locales/messages.en.xlf"
output_file = ARGV[2] || "locales/diff-#{Time.now.to_i}.xlf"

unless File.exist?(original_file)
  puts "The original file doesn't exist."
  exit
end

unless File.exist?(new_file)
  puts "The new file doesn't exist."
  exit
end

original_file = Nokogiri::XML(File.open(original_file))
new_file = Nokogiri::XML(File.open(new_file))

# Need to iterate over original file trans-unit. If the id is present in the new file, remove it from the new file.
# If it's not present, add it to a new file.
original_file.search("trans-unit").each do |trans|
  if new_file.search("##{trans.attributes["id"]&.value.to_s}").count > 0
    trans.remove
  end
end

File.write(output_file, original_file.to_s.gsub(/^\s+$/, "").gsub(/^\n$/, "").gsub(/\n{2,}/, "\n"))

puts "Differences are in #{output_file}"
