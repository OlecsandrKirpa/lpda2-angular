# Run this file from root with
# ruby scripts/xlf-translate.rb locales/messages.xlf locales/messages.en.xlf

# ruby 3.2.2 (2023-03-30 revision e51014f9c0) [x86_64-linux]

require 'nokogiri' #  (1.16.2, 1.15.5)
require "debug" # 1.9.2, 1.9.1, 1.7.1
require "faraday" # 2.11.0
require "oj" # 3.16.3, 3.16.5

# Step 1: Check if the files exist and load them.
original_file = ARGV[0] || "locales/messages.xlf"
output_file_path = ARGV[1] || "locales/messages.en.xlf"
SAFE = false # when enabled, output file will not be updated. Instead a file called .safe will be saved in the same directory.
skip_present = true # when enabled, will skip translations that are already present in the output file.

pwd = Dir.pwd + "/scripts/"

OPENAI_API_KEY = ENV["OPENAI_API_KEY"] || File.exist?("#{pwd}.openai") && File.read("#{pwd}.openai").strip

raise "Please provide an OpenAI API key in the environment variable OPENAI_API_KEY or in a file called .openai" unless OPENAI_API_KEY

FROM_LANG = "Italian"
TO_LANG = "English"

# CACHE_FILENAME = "#{pwd}/xlf-translate.from-#{FROM_LANG}-to-#{TO_LANG}.cache.json"
# USE_CACHE = true
# CACHE = (USE_CACHE && File.exist?(CACHE_FILENAME)) ? Oj.load(File.read(CACHE_FILENAME)) : {}

unless File.exist?(original_file)
  puts "The original file doesn't exist."
  exit
end

FileUtils.touch(output_file_path) unless File.exist?(output_file_path)

original_file = Nokogiri::XML(File.open(original_file))
output_file = Nokogiri::XML(File.open(output_file_path))

def translate_str(str)
  # puts "#{Time.now.strftime("%H:%M:%S")} translating #{str}"
  response = Faraday.post('https://api.openai.com/v1/chat/completions') do |req|
    req.headers['Content-Type'] = 'application/json'
    req.headers['Authorization'] = "Bearer #{OPENAI_API_KEY}"

    req.body = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a great translator knowing very well many languages. You will reply directly, without the need to explain anything nor add any other character that is not the translation I'm asking you. I will provide you a sentence in #{FROM_LANG} and I need you to translate it to #{TO_LANG}" },
        { role: "user", content: str }
      ]
    }.to_json
  end

  res = response.body

  ## Response.body should look like this:
  # {
  #   "id"=>"chatcmpl-A59RdH2TymBCHXaKrsSaTcHdTE9G0",
  #   "object"=>"chat.completion",
  #   "created"=>1725791309,
  #   "model"=>"gpt-4o-mini-2024-07-18",
  #   "choices"=>[{"index"=>0, "message"=>{"role"=>"assistant", "content"=>"Hello, how are you?", "refusal"=>nil}, "logprobs"=>nil, "finish_reason"=>"stop"}],
  #   "usage"=>{"prompt_tokens"=>71, "completion_tokens"=>6, "total_tokens"=>77},
  #   "system_fingerprint"=>"fp_483d39d857"
  # }

  # puts response.inspect

  if response.status < 200 || response.status > 299
    puts "Something went wrong with the translation: #{res} | #{response.inspect}"
    return nil
  end

  Oj.load(res).dig("choices", 0, "message", "content")
rescue => e
  puts "Error translating: #{e}"
  nil
end

@report = {
  skipped_present: [],
  skipped_cached: [],
  translated: []
}

total_count = original_file.search("trans-unit").count

original_file.search("trans-unit").each_with_index do |orig_trans, index|
  trans_id = orig_trans.attributes["id"].to_s
  out_trans = output_file.search("trans-unit##{trans_id}").first
  original_source = orig_trans.search("source").text
  translated_str = nil # Translated string.

  if skip_present && out_trans
    trans_source = out_trans.search("source")&.text
    out_target = out_trans.search("target").first
    if original_source.to_s.gsub(/\s+/, " ").strip == trans_source.to_s.gsub(/\s+/, " ").strip && out_target && out_target.text.length > 0
      @report[:skipped_present] << { id: trans_id, source: original_source, target: out_target.text }
      translated_str = out_target.children.to_s
    end
  end

  # if USE_CACHE && CACHE[trans_id] && CACHE[trans_id]["source"] == original_source && CACHE[trans_id]["target"]
  #   # CACHE[trans_id], when present, should look like this:
  #   # {"id"=>"5803490350987102192", "source"=>"Sei sicuro?", "target"=>"Are you sure?"}
  #   translated_str = CACHE[trans_id]["target"]
  #   @report[:skipped_cached] << CACHE[trans_id]
  # end

  if translated_str.nil?
    puts "#{Time.now.strftime("%H:%M:%S")} Translating #{index + 1}/#{total_count}: #{original_source.inspect}"
    translated_str = translate_str(orig_trans.search("source").text)
    next if translated_str.nil? # Translation failed, may retry later.

    @report[:translated] << { id: trans_id, source: original_source, target: translated_str }
  end

  orig_trans.search("source").first.add_next_sibling("\n<target>#{translated_str}</target>")
end

puts "Skipped #{@report[:skipped_present].count} translations that were already present."
puts "Translated #{@report[:translated].count} translations."

File.write(SAFE ? "#{output_file_path}.safe" : output_file_path, original_file.to_s)

# File.write(CACHE_FILENAME, @report[:translated].map { |j| [j[:id], j] }.to_h.to_json) if USE_CACHE

# debugger
