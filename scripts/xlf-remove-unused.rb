# This is useful if you want to get rid of the keys that are not present in the original file.

# Will get two arguments:
# arg0: file generated with `ng extract-i18n` (e.g. `locales/messages.xlf`)
# arg1: translated file (e.g. `locales/messages.en.xlf`)
# And will save the output file but with only the keys present in the original file.

# Run this file from root with `ruby scripts/xlf-remove-unused.rb`

# ruby 3.2.2 (2023-03-30 revision e51014f9c0) [x86_64-linux]

require 'nokogiri' #  (1.16.2, 1.15.5)
require "debug" # 1.9.2, 1.9.1, 1.7.1
require "rexml/document" # (3.2.6, 3.2.5)

# Step 1: Check if the files exist and load them.
original_file = ARGV[0] || "locales/messages.xlf"
new_file = ARGV[1] || "locales/messages.en.xlf"
output_file = ARGV[2] || "#{new_file}.ony_present_in_orig.xlf"
VERBOSE = true

raise "The original file doesn't exist." unless File.exist?(original_file)
raise "output file not found" unless File.exist?(new_file)
FileUtils.touch(output_file) unless File.exist?(output_file)

original_file = Nokogiri::XML(File.open(original_file))
new_file = Nokogiri::XML(File.open(new_file))

@removed = []

new_file.search("trans-unit").each do |trans|
  next if original_file.search("trans-unit##{trans.attributes["id"]&.value.to_s}").count > 0

  @removed << trans
  trans.remove
end

doc = REXML::Document.new(new_file.to_s)
formatter = REXML::Formatters::Pretty.new

# Compact uses as little whitespace as possible
formatter.compact = true

formatter.write(doc, File.open(output_file, "w+"))

if VERBOSE
  puts "Removed keys:"
  puts @removed.map { |r| "#{r.attributes["id"]}: #{r.search("source").first.text}" }
  puts output_file
end

