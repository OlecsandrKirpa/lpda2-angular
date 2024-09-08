
# Usage from root:
# ruby scripts/format-xml.rb locales/messages.en.xlf

INPUT_FILE_PATH = ARGV[0] || raise("Usage: #{$0} <input_file_path> [<output_file_path>]")
OUTPUT_FILE_PATH = ARGV[1] || INPUT_FILE_PATH

raise "file not found: #{INPUT_FILE_PATH}" unless File.exist?(INPUT_FILE_PATH)

# ruby 3.2.2 (2023-03-30 revision e51014f9c0) [x86_64-linux]

require "rexml/document" # (3.2.6, 3.2.5)
require "debug" # (1.9.2, 1.9.1, 1.7.1)
# source = '<some><nested><xml>value</xml></nested></some>'

doc = REXML::Document.new(File.read(INPUT_FILE_PATH))
formatter = REXML::Formatters::Pretty.new

# Compact uses as little whitespace as possible
formatter.compact = true

formatter.write(doc, File.open(OUTPUT_FILE_PATH, "w"))
